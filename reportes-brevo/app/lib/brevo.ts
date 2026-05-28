// Pausar el tiempo y dejar respirar a la API
const pausa = (milisegundos: number) => new Promise(resolver => setTimeout(resolver, milisegundos));

// Va a Brevo a buscar las campanas usando la llave de la marca enviada
async function getCampaigns(status: string, apiKey: string) {
    const limit = 50; // Maximo que permite Brevo por peticion
    let offset = 0; // El marcador de pagina inicia en el renglon cero
    let intentos429 = 0; // Contador de reintentos

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

                if (respuesta.status === 429) {
                    intentos429++;
                    if (intentos429 <= 6) {
                        console.log(`Brevo limito las solicitudes. Intento ${intentos429}/6. Esperando 60 segundos antes de continuar...`);
                        await pausa(60000);
                        continue;
                    } else {
                        console.log("Se supero el limite maximo de 6 reintentos por error 429. Deteniendo buscle de seguridad.");
                    }
                }

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
function processCampaigns(campaigns: any[], brandName: string, apiSource: 'A' | 'B') {
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
            id: campaign.id,
            apiSource,
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
let promesaEnCurso: Promise<any> | null = null;

// Se obtiene la lista completa de campanas procesadas
export async function getAllProcessedCampaigns(forceRefresh: boolean = false) {
    const ahora = Date.now();
    const unaHoraEnMilisegundos = 3600000; // 1 hora (60 minutos)

    // Si ya hay una descarga activa en este preciso instante, las demas llamadas paralelas esperan su resultado
    if (promesaEnCurso !== null) {
        console.log("Ya hay una descarga en curso de Brevo. Compartiendo promesa activa...");
        return promesaEnCurso;
    }

    // Si forceRefresh es false, se ignora la cache y se buscan datos frescos en Brevo
    if (!forceRefresh && memoriaCache !== null && (ahora - ultimaVezActualizado < unaHoraEnMilisegundos)) {
        console.log("Entregando datos instantaneos desde la Memoria Manual...");
        return memoriaCache;
    }

    // Creamos la promesa de descarga compartida
    promesaEnCurso = (async () => {
        try {
            console.log("Paso 1 hora o no hay memoria. Descargando datos frescos de Brevo...");

            const keyA = process.env.BREVO_API_KEY_MARCA_A;
            const keyB = process.env.BREVO_API_KEY_MARCA_B;

            let todosLosDatosLimpios: any[] = [];

            // Descargamos campanas de Marca A (Ideal Plastic Surgery)
            if (keyA) {
                console.log("Descargando campanas de Marca A (Ideal Plastic Surgery)...");
                const sentA = await getCampaigns('sent', keyA);
                await pausa(2000);
                const archiveA = await getCampaigns('archive', keyA);
                const procesadosA = processCampaigns([...sentA, ...archiveA], 'Ideal Plastic Surgery', 'A');
                todosLosDatosLimpios = [...todosLosDatosLimpios, ...procesadosA];
            }

            // Descargamos campanas de Marca B y le indicamos extraer las marcas de forma dinamica
            if (keyB) {
                console.log("Descargando campanas de Marca B...");
                const sentB = await getCampaigns('sent', keyB);
                await pausa(2000);
                const archiveB = await getCampaigns('archive', keyB);
                const procesadosB = processCampaigns([...sentB, ...archiveB], 'dinamico', 'B');
                todosLosDatosLimpios = [...todosLosDatosLimpios, ...procesadosB];
            }

            if (todosLosDatosLimpios.length > 0) {
                memoriaCache = todosLosDatosLimpios;
                ultimaVezActualizado = Date.now();
            }

            return todosLosDatosLimpios;
        } finally {
            // Al terminar la descarga (con éxito o fallo), liberamos la promesa en curso
            promesaEnCurso = null;
        }
    })();

    return promesaEnCurso;
}
