// Funcion para codificar las credenciales de idealteam en Basic Auth Base64
const obtenerBasicAuth = () => {
    const username = process.env.NRS360_USERNAME || '';
    const apiPassword = process.env.NRS360_API_PASSWORD || '';

    if (!username || !apiPassword) {
        console.warn("Advertencia: Faltan credenciales de 360NRS en .env.local");
    }

    return 'Basic ' + Buffer.from(username + ':' + apiPassword).toString('base64');
};

// Funcion maestra asincrona conectada 100% en vivo y directo a la API de 360NRS
export async function getProcessedSmsCampaigns() {
    // Endpoint oficial para obtener el listado en vivo de envios realizados (Sendings)
    const url = 'https://dashboard.360nrs.com/api/rest/sendings';
    const tokenAuth = obtenerBasicAuth();

    try {
        console.log("Iniciando peticion HTTP en vivo a la API de 360NRS...");

        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': tokenAuth,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        if (!respuesta.ok) {
            throw new Error(`La API de 360NRS rechazo la conexion. Codigo HTTP: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        console.log("API de 360NRS respondio con exito!");

        // Mapeamos los envios reales obtenidos en vivo al formato de nuestra tabla
        const enviosReales = (datos.data || []).map((envio: any) => {
            // Extraemos la fecha de creacion o envio usando las claves camelCase reales de la API
            const fechaObj = new Date(envio.createdAt || envio.scheduledAt || Date.now());

            return {
                id: envio.id || 0,
                brand: 'Ideal Plastic Surgery',
                name: (envio.campaignName || '').trim(),
                status: envio.status,
                sent: envio.events?.sent || envio.processed || 0,
                delivered: envio.events?.delivered || 0,
                rejected: envio.events?.rejected || 0,
                clicks: envio.events?.clicked || 0,
                dateStr: fechaObj.toLocaleDateString('es-ES'),
                timeStr: fechaObj.toLocaleTimeString('es-ES')
            };

        });

        // Aplicamos la regla de oro: Filtramos para dejar pasar solo los envios que SI tienen nombre y estan FINALIZADOS
        const enviosFiltrados = enviosReales.filter((envio: any) => {
            return envio.name !== '' && envio.status === 'FINISHED';
        });
        return enviosFiltrados;

    } catch (error: any) {
        console.error("🚨 ERROR EN VIVO CON LA API DE 360NRS:", error.message);

        // Retornamos una lista vacia para que la aplicacion muestre el estado real del fallo de conexion
        return [];
    }
}
