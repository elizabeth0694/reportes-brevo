// Pausar el tiempo y dejar respirar a la API
const pausa = (milisegundos: number) => new Promise(resolver => setTimeout(resolver, milisegundos));

// Va a Brevo a buscar TODAS las campañas usando paginacion sin saturar el sistema
async function getCampaigns(status: string) {
    const apiKey = process.env.BREVO_API_KEY;
    const limit = 50; // Maximo que permite Brevo por peticion
    let offset = 0; // El marcador de pagina inicia en el renglon cero

    let todasLasCampanas: any[] = [];
    let seguirBuscando = true;

    while (seguirBuscando) {
        const url = `https://api.brevo.com/v3/emailCampaigns?status=${status}&statistics=globalStats&limit=${limit}&offset=${offset}`;

        // "try/catch": Un escudo de fuerza. Intenta ejecutar esto, y si Brevo lanza un misil de error, atrapalo sin explotar.
        try {
            const respuesta = await fetch(url, {
                method: 'GET',
                headers: {
                    'api-key': apiKey as string,
                    'Accept': 'application/json'
                },
                cache: 'no-store'
            });

            // Motivo exacto de rechazo
            if (!respuesta.ok) {
                const errorReal = await respuesta.text();
                console.log("🛑 BREVO RESPONDIO CON ERROR:", respuesta.status, errorReal);
                break;
            }

            const json = await respuesta.json();
            const campañasExtraidas = json.campaigns || [];

            todasLasCampanas = [...todasLasCampanas, ...campañasExtraidas];

            if (campañasExtraidas.length < limit || todasLasCampanas.length >= 1000) {
                seguirBuscando = false;
            } else {
                offset += limit;
                await pausa(500);
            }
        } catch (error) {
            // Escudo 2: Si hay un "Timeout", rompemos el ciclo para no colapsar la pantalla
            console.log("Brevo no responde (Timeout). Deteniendo bucle...");
            break;
        }
    }

    return todasLasCampanas;
}



// Recibe el arreglo sucio de campañas y nos devuelve solo los datos matemáticos utiles
function processCampaigns(campaigns: any[]) {

    // Crea una caja donde iremos metiendo unicamente los correos que ya hayan sido limpiados
    const processedData: any[] = [];

    // Ciclo que revisa cada correo uno por uno. Si el correo trae estadisticas, las extrae, si viene roto, deja un objeto vacio
    campaigns.forEach(campaign => {

        const stats = (campaign.statistics && campaign.statistics.globalStats) ? campaign.statistics.globalStats : {};

        // Rescata los numeros de enviados y entregados. Si Brevo mando los campos vacios, usamos || 0 para forzarlos a cero
        const sent = stats.sent || 0;
        const delivered = stats.delivered || 0;

        // Si detecta que el correo no se envio a nadie, abandona el proceso. Si pasa el filtro, extraemos el resto de metricas
        if (sent === 0 && delivered === 0) return;

        const aperturasUnicas = stats.uniqueViews || 0;
        const totalAperturas = stats.viewed || 0;
        const clicsUnicos = stats.uniqueClicks || 0;
        const totalClics = stats.clickers || stats.clicks || 0;
        const unsubscribes = stats.unsubscriptions || stats.unsubscribed || 0;
        const softBounces = stats.softBounces || 0;
        const hardBounces = stats.hardBounces || 0;

        // Division matematica segura, si hubo entregas reales hace la division, si no anota un cero absoluto. El signo ? evita el error fatal de dividir entre cero si nadie recibio el correo
        const openRate = delivered > 0 ? (aperturasUnicas / delivered) : 0;
        const clickRate = delivered > 0 ? (clicsUnicos / delivered) : 0;

        const name = campaign.name || 'Sin Nombre';

        const rawDate = campaign.sentDate || campaign.createdAt;

        // Dos variables en blanco listas para recibir la fecha y hora ya formateadas
        let dateStr = "";
        let timeStr = "";

        if (rawDate) {
            // Verificamos que exista la fecha. Si es asi, new Date() la agarra y la convierte a un formato que JavaScript puede entender y modificar
            let dateObj = new Date(rawDate);

            // Se usa toLocale para forzar que la fecha y hora se impriman en español (dia/mes/año) y no en formato americano
            dateStr = dateObj.toLocaleDateString('es-ES');
            timeStr = dateObj.toLocaleTimeString('es-ES');
        }

        // Empujamos los datos limpios dentro del arreglo. Cuando termina de revisar todos los correos, usa return para entregar el resultado final.
        processedData.push({
            name, sent, delivered, aperturasUnicas, openRate,
            totalAperturas, clicsUnicos, clickRate, totalClics,
            unsubscribes, softBounces, hardBounces, dateStr, timeStr
        });
    });

    return processedData;
}

// Antes de ir a molestar a Brevo, revisa si tenemos una copia de los correos guardada de hace menos de 30 minutos. Si ya la tenemos, la entrega al instante. Si no la tenemos (o ya es vieja), descarga todo fresco, lo purifica, lo guarda en la memoria y nos lo entrega.
let memoriaCache: any = null;
let ultimaVezActualizado = 0;


export async function getAllProcessedCampaigns() {
    const ahora = Date.now();
    const mediaHoraEnMilisegundos = 1800000; // 30 minutos = 1,800,000 milisegundos


    if (memoriaCache !== null && (ahora - ultimaVezActualizado < mediaHoraEnMilisegundos)) {
        console.log("Entregando datos instantaneos desde la Memoria Manual...");
        return memoriaCache;
    }

    console.log("Pasaron 30 minutos o no hay memoria. Descargando datos frescos de Brevo...");
    const sentCampaigns = await getCampaigns('sent');
    const archivedCampaigns = await getCampaigns('archive');

    const allCampaigns = [...sentCampaigns, ...archivedCampaigns];


    const datosLimpios = processCampaigns(allCampaigns);

    // Guardamos solo si Brevo nos entrego datos reales (Para no guardar errores o tablas vacias)
    if (datosLimpios.length > 0) {
        memoriaCache = datosLimpios;
        ultimaVezActualizado = ahora;
    }

    // Regresa los datosLimpios (que estaran llenos si Brevo funciono, o vacios si Brevo sigue castigandonos)
    return datosLimpios;

}


