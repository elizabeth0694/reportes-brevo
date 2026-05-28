// Se importa la funcion maestra desde la carpeta lib
import { getAllProcessedCampaigns } from './lib/brevo';
import { getProcessedSmsCampaigns } from './lib/sms';


// Se importan los componentes interactivos de Mailing y SMS
import DashboardClient from './brevo/DashboardClient';
import DashboardSmsClient from './sms/DashboardSmsClient';

// Esta funcion marca el inicio de la pagina principal de la web (Server Component)
export default async function Home() {

  // Se traen los datos de Mailing de Brevo
  const campanasMailing = await getAllProcessedCampaigns();

  // Se traen las campanas de SMS reales o contingencia de 360NRS
  const campanasSms = await getProcessedSmsCampaigns();


  // El HTML que se envia al navegador para mostrar el contenido de ambos reportes
  return (
    <main className="p-4 space-y-12">

      {/* Seccion del reporte de Mailing Brevo con su letrero ID correspondiente */}
      <div id="seccion-mailing">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Reportes Mailing Brevo
        </h1>
        <DashboardClient datosIniciales={campanasMailing} />
      </div>

      {/* Linea divisoria elegante con su letrero ID correspondiente */}
      <hr id="linea-divisoria" className="border-gray-200 my-8" />

      {/* Seccion del reporte de SMS con su letrero ID correspondiente */}
      <div id="seccion-sms" className="pb-12">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Reportes SMS
        </h1>
        <DashboardSmsClient datosIniciales={campanasSms} />
      </div>

    </main>
  );
}
