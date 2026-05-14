// Se importa la funcion maestra desde la carpeta lib para obtener los datos
import { getAllProcessedCampaigns } from '../lib/brevo';

// Se importa el componente interactivo que maneja los filtros y la tabla
import DashboardClient from './DashboardClient';

// Esta funcion marca el inicio de la pagina de reportes
export default async function BrevoReportPage() {

  // Se llama a la funcion para traer la lista completa de campañas
  const campañas = await getAllProcessedCampaigns();

  // El HTML que se envia al navegador para mostrar el contenido
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Reporte Brevo Ideal Plastic
      </h1>

      {/* Aqui se entrega el control al componente interactivo pasandole los datos */}
      <DashboardClient datosIniciales={campañas} />
    </main>
  );
}
