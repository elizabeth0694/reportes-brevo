'use client'; // Esto indica que el componente tiene interaccion con el usuario

import React, { useState } from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Función personalizada para crear saltos de línea en los nombres de las camp
const EtiquetaMultilinea = ({ x, y, payload }: any) => {
    const texto = payload.value;
    const palabras = texto.split(' ');
    const lineas = [];
    let lineaActual = '';

    // Agrupamos palabras. Si pasan de 25 letras, hace un salto de línea.
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
            {/* Dibujamos el texto anclado a su barra, inclinado a -35 grados */}
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


export default function DashboardClient({ datosIniciales }: { datosIniciales: any[] }) {

    // Se obtiene la fecha actual para empezar los calculos
    const ahora = new Date();

    // Se calcula el primer dia del mes pasado
    const fechaInicioAuto = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    // Se calcula el ultimo dia del mes pasado (poniendo dia 0 del mes actual)
    const fechaFinAuto = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

    // Se convierten las fechas al formato YYYY-MM-DD que entiende el cuadro de texto
    const inicioFormateado = fechaInicioAuto.toISOString().split('T')[0];
    const finFormateado = fechaFinAuto.toISOString().split('T')[0];

    // Aqui se guardan las fechas, iniciando ahora con el mes pasado por defecto
    const [fechaInicio, setFechaInicio] = useState(inicioFormateado);
    const [fechaFin, setFechaFin] = useState(finFormateado);

    // Se crea una caja para guardar los datos filtrados, iniciando con el filtro del mes pasado
    const [datosFiltrados, setDatosFiltrados] = useState(() => {
        return datosIniciales.filter((c) => {
            const f = new Date(c.dateStr.split('/').reverse().join('-'));
            return f >= fechaInicioAuto && f <= fechaFinAuto;
        });
    });


    // Aqui se guarda el mensaje de error si las fechas estan mal
    const [error, setError] = useState('');


    // Esta funcion solo se ejecuta cuando se presiona el boton de aplicar
    const manejarFiltro = () => {
        // 1. Creamos las fechas de inicio y fin como objetos puros (Medianoche Local)
        const [yI, mI, dI] = fechaInicio.split('-').map(Number);
        const inicio = new Date(yI, mI - 1, dI);

        const [yF, mF, dF] = fechaFin.split('-').map(Number);
        const fin = new Date(yF, mF - 1, dF);

        if (inicio > fin) {
            setError("La fecha “Desde” no puede ser mayor que la fecha “Hasta”");
            return;
        }
        setError('');

        // 2. Filtramos usando la MISMA lógica que el sistema usa al cargar
        const resultado = datosIniciales.filter((campaña) => {
            // Convertimos el dateStr (ej: 28/04/2026) a un formato que JS entienda
            const f = new Date(campaña.dateStr.split('/').reverse().join('-'));

            // Comparamos: Mayor o igual al inicio Y menor o igual al fin
            return f >= inicio && f <= fin;
        });

        setDatosFiltrados(resultado);
    };

    // Preparamos los datos para que la gráfica los entienda como porcentajes (0 a 100)
    const datosGrafico = datosFiltrados.map(c => ({
        name: c.name,
        "Aperturas (%)": Number((c.openRate * 100).toFixed(2)),
        "Clics (%)": Number((c.clickRate * 100).toFixed(2))
    }));

    // Calculamos los totales sumando cada campaña de la lista filtrada
    const totales = datosFiltrados.reduce((acc, curr) => ({
        enviados: acc.enviados + curr.sent,
        aperturas: acc.aperturas + (curr.aperturasUnicas || 0),
        clics: acc.clics + (curr.clicsUnicos || 0),
        cancelaciones: acc.cancelaciones + (curr.unsubscribes || 0)
    }), { enviados: 0, aperturas: 0, clics: 0, cancelaciones: 0 });

    // Calculamos los porcentajes promedio globales
    const promApertura = totales.enviados > 0 ? (totales.aperturas / totales.enviados) * 100 : 0;
    const promClic = totales.enviados > 0 ? (totales.clics / totales.enviados) * 100 : 0;

    return (
        <div className="p-4">

            {/* Seccion para elegir las fechas del reporte */}
            <div className="flex gap-6 mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-md items-end">

                {/* Grupo para la fecha de inicio */}
                <div>
                    <label className="block text-[10px] font-bold mb-1 text-gray-500 uppercase tracking-widest">Desde:</label>
                    <input
                        type="date"
                        className="border p-2 rounded"
                        value={fechaInicio} // Se conecta con la fecha de inicio calculada
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </div>

                {/* Grupo para la fecha de fin */}
                <div>
                    <label className="block text-[10px] font-bold mb-1 text-gray-500 uppercase tracking-widest">Hasta:</label>
                    <input
                        type="date"
                        className="border p-2 rounded"
                        value={fechaFin} // Se conecta con la fecha de fin calculada
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </div>

                {/* Grupo que une al Boton y al Mensaje de Error */}
                <div className="flex items-end gap-4">
                    <button
                        onClick={manejarFiltro}
                        className="bg-[#6366f1] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#4f46e5] transition-all shadow-sm hover:shadow-md h-fit"
                    >
                        Aplicar
                    </button>

                    {/* Alerta de error corregida */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md h-fit animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="text-lg">⚠️</span>
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}
                </div>

            </div>

            {/* Sección de Tarjetas de Resumen (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">

                {/* Tarjeta 1: Envíos */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Envíos Totales</span>
                    <span className="text-xl font-bold text-gray-800">{totales.enviados.toLocaleString()}</span>
                </div>

                {/* Tarjeta 2: Aperturas */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Aperturas</span>
                    <span className="text-xl font-bold text-blue-600">{totales.aperturas.toLocaleString()}</span>
                </div>

                {/* Tarjeta 3: % Apertura Promedio */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">% Apertura Prom.</span>
                    <span className="text-xl font-bold text-blue-700">{promApertura.toFixed(2)}%</span>
                </div>

                {/* Tarjeta 4: Clics Totales */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Clics Totales</span>
                    <span className="text-xl font-bold text-emerald-600">{totales.clics.toLocaleString()}</span>
                </div>

                {/* Tarjeta 5: % Clic Promedio */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">% Clic Prom.</span>
                    <span className="text-xl font-bold text-emerald-700">{promClic.toFixed(2)}%</span>
                </div>

                {/* Tarjeta 6: Cancelaciones */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Bajas</span>
                    <span className="text-xl font-bold text-red-500">{totales.cancelaciones.toLocaleString()}</span>
                </div>

            </div>


            {/* Sección del Gráfico Visual */}
            <div className="mb-8 h-[500px] w-full bg-white p-4 rounded-xl border border-gray-200 shadow-md overflow-hidden">
                <h2 className="text-lg font-bold mb-4 text-center text-gray-700 uppercase tracking-wide">Rendimiento: Aperturas vs Clics</h2>
                {/* ResponsiveContainer hace que la gráfica se adapte al tamaño de la pantalla */}
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />

                        {/* Agregamos height={120} para reservar el espacio de los nombres largos y empujar la leyenda abajo */}
                        <XAxis dataKey="name" tick={false} />
                        <YAxis tickFormatter={(tick) => `${tick}%`} />
                        <Tooltip formatter={(value) => `${value}%`} />

                        <Legend />

                        {/* Aquí definimos las dos barras de colores */}
                        <Bar dataKey="Aperturas (%)" fill="#3b82f6" name="% de Apertura" />
                        <Bar dataKey="Clics (%)" fill="#10b981" name="% de Clics" />
                    </BarChart>
                </ResponsiveContainer>
            </div>


            {/* Tabla donde se dibujan los datos ya filtrados con las 14 columnas */}
            <div className="overflow-hidden border border-gray-200 rounded-xl shadow-md">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-[#6366f1] text-white">
                        <tr>
                            <th className="py-4 px-2">Nombre de Campaña</th>
                            <th className="py-4 px-2">Total Enviados</th>
                            <th className="py-4 px-2">Total Entregados</th>
                            <th className="py-4 px-2">Aperturas Unicas</th>
                            <th className="py-4 px-2">% de Apertura</th>
                            <th className="py-4 px-2">Total de Aperturas</th>
                            <th className="py-4 px-2">Clics Unicos</th>
                            <th className="py-4 px-2">% de Clics</th>
                            <th className="py-4 px-2">Total de Clics</th>
                            <th className="py-4 px-2">Cancelaciones</th>
                            <th className="py-4 px-2">Rebotes Suaves</th>
                            <th className="py-4 px-2">Rebotes Duros</th>
                            <th className="py-4 px-2">Fecha de Envio</th>
                            <th className="py-4 px-2">Hora de Envio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datosFiltrados.map((c, i) => (
                            <tr key={i} className="border-b border-gray-100 even:bg-slate-50 hover:bg-indigo-50 transition-colors text-center text-gray-700">
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
