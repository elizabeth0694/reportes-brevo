// Pausar el tiempo y dejar respirar a la API
const pausa = (milisegundos: number) => new Promise(resolver => setTimeout(resolver, milisegundos));

// Va a Brevo a buscar las campanas usando la llave de la marca enviada
async function getCampaigns(status: string, apiKey: string) {
    const limit = 50; // Maximo que permite Brevo por peticion
    let offset = 0; // El marcador de pagina inicia en el renglon cero

    let todasLasCampanas: any[] = [];
    let seguirBuscando = true;

    if (!apiKey) {
        console.log("No se detecto llave API para el estado:", status);
        return [];
    }

    while (seguirBuscando) {
        const url = `https://api.brevo.com/v3/emailCampaigns?status=${status}&statistics=globalStats&limit=${limit}&offset=${offset}`;

        try {
            const respuesta = await fetch(url, {
                method: 'GET',
                headers: {
                    'api-key': apiKey,
                    'Accept': 'application/json'
                },
                cache: 'no-store'
            });

            if (!respuesta.ok) {
                const errorReal = await respuesta.text();
                console.log("🛑 BREVO RESPONDIO CON ERROR:", respuesta.status, errorReal);
                break;
            }

            const json = await respuesta.json();
            const campanasExtraidas = json.campaigns || [];

            todasLasCampanas = [...todasLasCampanas, ...campanasExtraidas];

            if (campanasExtraidas.length < limit || todasLasCampanas.length >= 1000) {
                seguirBuscando = false;
            } else {
                offset += limit;
                await pausa(500);
            }
        } catch (error) {
            console.log("Brevo no responde (Timeout). Deteniendo bucle...");
            break;
        }
    }

    return todasLasCampanas;
}

// Recibe el arreglo sucio de campanas y agrega o extrae la marca
function processCampaigns(campaigns: any[], brandName: string) {
    const processedData: any[] = [];

    campaigns.forEach(campaign => {
        const stats = (campaign.statistics && campaign.statistics.globalStats) ? campaign.statistics.globalStats : {};

        const sent = stats.sent || 0;
        const delivered = stats.delivered || 0;

        if (sent === 0 && delivered === 0) return;

        const aperturasUnicas = stats.uniqueViews || 0;
        const totalAperturas = stats.viewed || 0;
        const clicsUnicos = stats.uniqueClicks || 0;
        const totalClics = stats.clickers || stats.clicks || 0;
        const unsubscribes = stats.unsubscriptions || stats.unsubscribed || 0;
        const softBounces = stats.softBounces || 0;
        const hardBounces = stats.hardBounces || 0;

        const openRate = delivered > 0 ? (aperturasUnicas / delivered) : 0;
        const clickRate = delivered > 0 ? (clicsUnicos / delivered) : 0;

        const name = campaign.name || 'Sin Nombre';
        const rawDate = campaign.sentDate || campaign.createdAt;

        let dateStr = "";
        let timeStr = "";

        if (rawDate) {
            let dateObj = new Date(rawDate);
            dateStr = dateObj.toLocaleDateString('es-ES');
            timeStr = dateObj.toLocaleTimeString('es-ES');
        }

        // --- EXTRACCION DINAMICA DE MARCA ---
        let marcaFinal = brandName;
        
        if (brandName === 'dinamico') {
            const marcasValidas = [
                'ideal plastic',
                'ideal plastic surgery',
                'pato pekin',
                'mombasa',
                'casa candela',
                'coralina',
                'mendoza',
                'ubari'
            ];

            const formatoMarcas: { [key: string]: string } = {
                'ideal plastic': 'Ideal Plastic Surgery', // Mapeado a Ideal Plastic Surgery
                'ideal plastic surgery': 'Ideal Plastic Surgery', // Mapeado a Ideal Plastic Surgery
                'pato pekin': 'Pato Pekin',
                'mombasa': 'Mombasa',
                'casa candela': 'Casa Candela',
                'coralina': 'Coralina',
                'mendoza': 'Mendoza',
                'ubari': 'Ubari'
            };

            let marcaEncontrada = '';

            // Primero intentamos por guion si existe
            if (name.includes('-')) {
                const posibleMarca = name.split('-')[0].trim().toLowerCase();
                if (marcasValidas.includes(posibleMarca)) {
                    marcaEncontrada = formatoMarcas[posibleMarca];
                }
            }

            // Si no se encontro por guion buscamos si el nombre empieza con alguna de las marcas conocidas
            if (!marcaEncontrada) {
                const nameLower = name.toLowerCase().trim();
                for (const marca of marcasValidas) {
                    if (nameLower.startsWith(marca)) {
                        marcaEncontrada = formatoMarcas[marca];
                        break;
                    }
                }
            }

            marcaFinal = marcaEncontrada || 'Marca General';
        }

        processedData.push({
            brand: marcaFinal,
            name, sent, delivered, aperturasUnicas, openRate,
            totalAperturas, clicsUnicos, clickRate, totalClics,
            unsubscribes, softBounces, hardBounces, dateStr, timeStr
        });
    });

    return processedData;
}

let memoriaCache: any = null;
let ultimaVezActualizado = 0;

export async function getAllProcessedCampaigns() {
    const ahora = Date.now();
    const mediaHoraEnMilisegundos = 1800000; // 30 minutos

    if (memoriaCache !== null && (ahora - ultimaVezActualizado < mediaHoraEnMilisegundos)) {
        console.log("Entregando datos instantaneos desde la Memoria Manual...");
        return memoriaCache;
    }

    console.log("Pasaron 30 minutos o no hay memoria. Descargando datos frescos de Brevo...");
    
    const keyA = process.env.BREVO_API_KEY_MARCA_A;
    const keyB = process.env.BREVO_API_KEY_MARCA_B;

    let todosLosDatosLimpios: any[] = [];

    // Descargamos campanas de Marca A (Ideal Plastic Surgery)
    if (keyA) {
        console.log("Descargando campanas de Marca A (Ideal Plastic Surgery)...");
        const sentA = await getCampaigns('sent', keyA);
        const archiveA = await getCampaigns('archive', keyA);
        const procesadosA = processCampaigns([...sentA, ...archiveA], 'Ideal Plastic Surgery');
        todosLosDatosLimpios = [...todosLosDatosLimpios, ...procesadosA];
    }

    // Descargamos campanas de Marca B y le indicamos extraer las marcas de forma dinamica
    if (keyB) {
        console.log("Descargando campanas de Marca B...");
        const sentB = await getCampaigns('sent', keyB);
        const archiveB = await getCampaigns('archive', keyB);
        
        // Pasamos el parametro 'dinamico' para activar el extractor
        const procesadosB = processCampaigns([...sentB, ...archiveB], 'dinamico');
        todosLosDatosLimpios = [...todosLosDatosLimpios, ...procesadosB];
    }

    if (todosLosDatosLimpios.length > 0) {
        memoriaCache = todosLosDatosLimpios;
        ultimaVezActualizado = ahora;
    }

    return todosLosDatosLimpios;
}