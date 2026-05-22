'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/* Etiqueta multilinea para nombres de campana muy largos */
const EtiquetaMultilinea = ({ x, y, payload }: any) => {
  const texto = payload.value;
  const palabras = texto.split(' ');
  const lineas: string[] = [];
  let lineaActual = '';

  palabras.forEach((palabra: string) => {
    if ((lineaActual + palabra).length > 25) {
      lineas.push(lineaActual.trim());
      lineaActual = palabra + ' ';
    } else {
      lineaActual += palabra + ' ';
    }
  });
  if (lineaActual) lineas.push(lineaActual.trim());

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)" fontSize={10}>
        {lineas.map((linea, indice) => (
          <tspan x={0} dy={indice === 0 ? 0 : 12} key={indice}>
            {linea}
          </tspan>
        ))}
      </text>
    </g>
  );
};

/* Estilos para cada marca, incluye caso Marca General */
const obtenerEstiloMarca = (marca: string) => {
  const m = (marca || '').trim().toLowerCase();

  if (m === 'ideal plastic' || m === 'ideal plastic surgery') return 'bg-zinc-900 text-zinc-50 border-zinc-900';
  if (m === 'pato pekin') return 'bg-red-50 text-red-700 border-red-200';
  if (m === 'mombasa') return 'bg-amber-100 text-amber-800 border-amber-200';
  if (m === 'casa candela') return 'bg-[#451a03] text-[#fef3c7] border-[#451a03]';
  if (m === 'coralina') return 'bg-orange-50 text-orange-700 border-orange-200';
  if (m === 'mendoza') return 'bg-zinc-500 text-zinc-50 border-zinc-500';
  if (m === 'ubari') return 'bg-sky-50 text-sky-700 border-sky-200';

  /* Caso por defecto: Marca General */
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
};

export default function DashboardClient({
  datosIniciales,
}: {
  datosIniciales: any[];
}) {
  /* Calculo de fechas por defecto (mes anterior) */
  const ahora = new Date();
  const fechaInicioAuto = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
  const fechaFinAuto = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

  const inicioFormateado = fechaInicioAuto.toISOString().split('T')[0];
  const finFormateado = fechaFinAuto.toISOString().split('T')[0];

  /* Estado local */
  const [fechaInicio, setFechaInicio] = useState(inicioFormateado);
  const [fechaFin, setFechaFin] = useState(finFormateado);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('todas');
  const [error, setError] = useState('');

  /* Datos filtrados inicialmente (mes anterior) */
  const [datosFiltrados, setDatosFiltrados] = useState(() => {
    return datosIniciales.filter((c) => {
      const f = new Date(c.dateStr.split('/').reverse().join('-'));
      return f >= fechaInicioAuto && f <= fechaFinAuto;
    });
  });

  /* Lista unica de marcas, sin repeticiones, orden alfabetico */
  const marcasDisponibles = useMemo(() => {
    const marcas: string[] = [];
    datosIniciales.forEach((c) => {
      const marcaNormalizada = c.brand && c.brand.trim() ? c.brand.trim() : 'Marca General';
      if (
        !marcas.some((m) => m.toLowerCase() === marcaNormalizada.toLowerCase())
      ) {
        marcas.push(marcaNormalizada);
      }
    });
    return marcas.sort((a, b) => a.localeCompare(b));
  }, [datosIniciales]);

  /* Funcion de filtrado (fecha + marca) */
  const filtrarDatos = (fInicio: string, fFin: string, marca: string) => {
    const [yI, mI, dI] = fInicio.split('-').map(Number);
    const inicio = new Date(yI, mI - 1, dI);

    const [yF, mF, dF] = fFin.split('-').map(Number);
    const fin = new Date(yF, mF - 1, dF);

    if (inicio > fin) {
      setError("La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'");
      return;
    }
    setError('');

    const resultado = datosIniciales.filter((campana) => {
      const f = new Date(campana.dateStr.split('/').reverse().join('-'));
      const cumpleFecha = f >= inicio && f <= fin;

      const marcaCampana = campana.brand && campana.brand.trim()
        ? campana.brand.trim()
        : 'Marca General';

      const cumpleMarca =
        marca === 'todas' ||
        marcaCampana.toLowerCase() === marca.toLowerCase();

      return cumpleFecha && cumpleMarca;
    });
    setDatosFiltrados(resultado);
  };

  /* Handlers UI */
  const manejarFiltro = () => {
    filtrarDatos(fechaInicio, fechaFin, marcaSeleccionada);
  };

  const manejarCambioMarca = (marca: string) => {
    setMarcaSeleccionada(marca);
    filtrarDatos(fechaInicio, fechaFin, marca);
  };

  /* Exportar PDF con la impresion nativa cambiando temporalmente el titulo para definir el nombre del archivo */
  const exportarPDF = () => {
    const tituloOriginal = document.title;
    const fechaHoy = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
    document.title = `Reporte Brevo - ${fechaHoy}`;
    window.print();
    document.title = tituloOriginal;
  };

  /* Datos para el grafico de barras */
  const datosGrafico = datosFiltrados.map((c) => ({
    name: c.name,
    'Aperturas (%)': Number((c.openRate * 100).toFixed(2)),
    'Clics (%)': Number((c.clickRate * 100).toFixed(2)),
  }));

  /* Totales KPI */
  const totales = datosFiltrados.reduce(
    (acc, curr) => ({
      enviados: acc.enviados + curr.sent,
      aperturas: acc.aperturas + (curr.aperturasUnicas || 0),
      clics: acc.clics + (curr.clicsUnicos || 0),
      cancelaciones: acc.cancelaciones + (curr.unsubscribes || 0),
    }),
    { enviados: 0, aperturas: 0, clics: 0, cancelaciones: 0 }
  );

  const promApertura = totales.enviados > 0 ? (totales.aperturas / totales.enviados) * 100 : 0;
  const promClic = totales.enviados > 0 ? (totales.clics / totales.enviados) * 100 : 0;

  /* Render */
  return (
    <div className="p-4">

      {/* Seccion de filtros alineados y de mismo tamanio - se oculta al imprimir */}
      <div className="no-imprimir flex flex-wrap gap-4 mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-md">

        {/* Filtro de fecha inicio */}
        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Desde:</label>
          <input
            type="date"
            className="h-10 border border-gray-300 px-3 rounded-lg text-sm text-gray-700 w-full"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        {/* Filtro de fecha fin */}
        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hasta:</label>
          <input
            type="date"
            className="h-10 border border-gray-300 px-3 rounded-lg text-sm text-gray-700 w-full"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        {/* Selector dinamico de marca */}
        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Marca:</label>
          <select
            value={marcaSeleccionada}
            onChange={(e) => manejarCambioMarca(e.target.value)}
            className="h-10 border border-gray-300 px-3 rounded-lg bg-white text-sm text-gray-700 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent w-full"
          >
            <option value="todas">Todas las Marcas</option>
            {marcasDisponibles.map((marca, i) => (
              <option key={i} value={marca}>
                {marca}
              </option>
            ))}
          </select>
        </div>

        {/* Botones aplicar y exportar PDF */}
        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
          {/* Etiqueta invisible solo para alinear visualmente con los demas campos */}
          <label className="text-[10px] font-bold text-transparent uppercase tracking-widest select-none">
            Accion:
          </label>
          <div className="flex gap-2 h-10">
            <button
              onClick={manejarFiltro}
              className="flex-1 bg-[#6366f1] text-white rounded-lg font-bold hover:bg-[#4f46e5] transition-all shadow-sm hover:shadow-md text-sm"
            >
              Aplicar
            </button>
            <button
              onClick={exportarPDF}
              className="flex-1 bg-white text-[#6366f1] border-2 border-[#6366f1] rounded-lg font-bold hover:bg-[#6366f1] hover:text-white transition-all shadow-sm hover:shadow-md text-sm flex items-center justify-center gap-1"
            >
              <span>⬇</span> PDF
            </button>
          </div>
        </div>

        {/* Mensaje de error si fechas invalidas */}
        {error && (
          <div className="w-full flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md">
            <span className="text-lg">⚠️</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            Envios Totales
          </span>
          <span className="text-xl font-bold text-gray-800">{totales.enviados.toLocaleString()}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            Aperturas
          </span>
          <span className="text-xl font-bold text-blue-600">{totales.aperturas.toLocaleString()}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            % Apertura Prom.
          </span>
          <span className="text-xl font-bold text-blue-700">{promApertura.toFixed(2)}%</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            Clics Totales
          </span>
          <span className="text-xl font-bold text-emerald-600">{totales.clics.toLocaleString()}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            % Clic Prom.
          </span>
          <span className="text-xl font-bold text-emerald-700">{promClic.toFixed(2)}%</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            Bajas
          </span>
          <span className="text-xl font-bold text-red-500">{totales.cancelaciones.toLocaleString()}</span>
        </div>
      </div>

      {/* Grafico de barras */}
      <div className="mb-8 h-[500px] w-full bg-white p-4 rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <h2 className="text-lg font-bold mb-4 text-center text-gray-700 uppercase tracking-wide">
          Rendimiento: Aperturas vs Clics
        </h2>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={datosGrafico}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={false} />
            <YAxis tickFormatter={(tick) => `${tick}%`} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Bar dataKey="Aperturas (%)" fill="#3b82f6" name="% de Apertura" />
            <Bar dataKey="Clics (%)" fill="#10b981" name="% de Clics" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de campanas */}
      <div className="overflow-hidden border border-gray-200 rounded-xl shadow-md">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#6366f1] text-white">
            <tr>
              <th className="py-4 px-2">Marca</th>
              <th className="py-4 px-2">Nombre de Campana</th>
              <th className="py-4 px-2">Total Enviados</th>
              <th className="py-4 px-2">Total Entregados</th>
              <th className="py-4 px-2">Aperturas Unicas</th>
              <th className="py-4 px-2">% de Apertura</th>
              <th className="py-4 px-2">Total de Aperturas</th>
              <th className="py-4 px-2">Clics Unicos</th>
              <th className="py-4 px-2">% de Clics</th>
              <th className="py-4 px-2">Total de Clics</th>
              <th className="py-4 px-2">Bajas</th>
              <th className="py-4 px-2">Rebotes Suaves</th>
              <th className="py-4 px-2">Rebotes Duros</th>
              <th className="py-4 px-2">Fecha de Envio</th>
              <th className="py-4 px-2">Hora de Envio</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((c, i) => {
              const marcaTexto = c.brand && c.brand.trim()
                ? c.brand.trim()
                : 'Marca General';
              return (
                <tr
                  key={i}
                  className="border-b border-gray-100 even:bg-slate-50 hover:bg-indigo-50 transition-colors text-center text-gray-700"
                >
                  <td className="py-3 px-2">
                    <span
                      className={`whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-bold border ${obtenerEstiloMarca(
                        marcaTexto
                      )}`}
                    >
                      {marcaTexto}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-left font-medium">{c.name}</td>
                  <td className="py-3 px-2">{c.sent}</td>
                  <td className="py-3 px-2">{c.delivered}</td>
                  <td className="py-3 px-2">{c.aperturasUnicas}</td>
                  <td className="py-3 px-2">{(c.openRate * 100).toFixed(2)}%</td>
                  <td className="py-3 px-2">{c.totalAperturas}</td>
                  <td className="py-3 px-2">{c.clicsUnicos}</td>
                  <td className="py-3 px-2">{(c.clickRate * 100).toFixed(2)}%</td>
                  <td className="py-3 px-2">{c.totalClics}</td>
                  <td className="py-3 px-2">{c.unsubscribes}</td>
                  <td className="py-3 px-2">{c.softBounces}</td>
                  <td className="py-3 px-2">{c.hardBounces}</td>
                  <td className="py-3 px-2">{c.dateStr}</td>
                  <td className="py-3 px-2">{c.timeStr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}