'use client';

import React, { useState, useMemo } from 'react';

// Importamos las herramientas de visualizacion de datos vectoriales de Recharts
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


// Estilos premium especificos para los badges de las marcas
const obtenerEstiloMarca = (marca: string) => {
    const m = (marca || '').trim().toLowerCase();

    // Estilo chocolate y arena premium personalizado para Casa Candela
    if (m === 'casa candela') return 'bg-[#451a03] text-[#fef3c7] border-[#451a03]';

    // Estilo negro premium personalizado para Ideal Plastic Surgery
    if (m === 'ideal plastic' || m === 'ideal plastic surgery') return 'bg-zinc-900 text-zinc-50 border-zinc-900';

    // Caso por defecto si agregamos mas marcas en el futuro
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
};


// Componentes premium personalizados para filtros (calendario y desplegable)

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
}

const CustomSelect = ({ value, onChange, options }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = value === 'todas' ? 'Todas las Marcas' : value;

    return (
        <div className="relative w-full text-left">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="h-11 w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all hover:bg-slate-100/50 focus:border-[#635bff] focus:bg-white focus:ring-4 focus:ring-[#635bff]/10 cursor-pointer"
            >
                <span className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z"></path>
                    </svg>
                    <span className="truncate">{selectedLabel}</span>
                </span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Overlay invisible para cerrar al hacer clic afuera */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-2xl z-50 outline-none animate-in fade-in slide-in-from-top-2 duration-200">
                        <button
                            type="button"
                            onClick={() => {
                                onChange('todas');
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition cursor-pointer flex items-center justify-between ${value === 'todas'
                                ? 'bg-[#635bff]/10 text-[#635bff]'
                                : 'text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <span>Todas las Marcas</span>
                            {value === 'todas' && (
                                <svg className="w-4 h-4 text-[#635bff]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                </svg>
                            )}
                        </button>

                        {options.map((option, i) => {
                            const isSelected = value.toLowerCase() === option.toLowerCase();
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition cursor-pointer flex items-center justify-between ${isSelected
                                        ? 'bg-[#635bff]/10 text-[#635bff]'
                                        : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className="truncate">{option}</span>
                                    {isSelected && (
                                        <svg className="w-4 h-4 text-[#635bff]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

interface CustomDatePickerProps {
    value: string;
    onChange: (value: string) => void;
}

const CustomDatePicker = ({ value, onChange }: CustomDatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Parsear la fecha actual
    const parsedDate = useMemo(() => {
        if (!value) return new Date();
        const [y, m, d] = value.split('-').map(Number);
        return new Date(y, m - 1, d);
    }, [value]);

    const [currentYear, setCurrentYear] = useState(parsedDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(parsedDate.getMonth());
    const [desplegableActivo, setDesplegableActivo] = useState<'ninguno' | 'mes' | 'anio'>('ninguno');

    // Actualizar mes y ano si cambia la fecha por fuera
    React.useEffect(() => {
        if (value) {
            const [y, m] = value.split('-').map(Number);
            setCurrentYear(y);
            setCurrentMonth(m - 1);
        }
    }, [value]);

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Calculo de anos dinamico: desde 2015 hasta el ano actual
    const anioActual = new Date().getFullYear();
    const aniosDisponibles = useMemo(() => {
        const minAnio = 2015;
        const array = [];
        for (let y = minAnio; y <= anioActual; y++) {
            array.push(y);
        }
        return array;
    }, [anioActual]);

    const diasSemana = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

    const dias = useMemo(() => {
        const primerDiaSemana = new Date(currentYear, currentMonth, 1).getDay();
        const totalDias = new Date(currentYear, currentMonth + 1, 0).getDate();

        const resultado = [];
        for (let i = 0; i < primerDiaSemana; i++) {
            resultado.push(null);
        }
        for (let i = 1; i <= totalDias; i++) {
            resultado.push(i);
        }
        return resultado;
    }, [currentYear, currentMonth]);

    const irMesAnterior = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const irMesSiguiente = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const seleccionarDia = (dia: number) => {
        const yyyy = currentYear;
        const mm = String(currentMonth + 1).padStart(2, '0');
        const dd = String(dia).padStart(2, '0');
        onChange(`${yyyy}-${mm}-${dd}`);
        setIsOpen(false);
    };

    const seleccionarHoy = () => {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        onChange(`${yyyy}-${mm}-${dd}`);
        setIsOpen(false);
    };

    const formatearFechaVista = (fechaStr: string) => {
        if (!fechaStr) return '';
        const [y, m, d] = fechaStr.split('-');
        return `${d}/${m}/${y}`;
    };

    return (
        <div className="relative w-full text-left">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="h-11 w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all hover:bg-slate-100/50 focus:border-[#635bff] focus:bg-white focus:ring-4 focus:ring-[#635bff]/10 cursor-pointer select-none"
            >
                <span className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{formatearFechaVista(value)}</span>
                </span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Overlay invisible para cerrar al hacer clic afuera */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 p-4 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 select-none">

                        {/* Header: Mes y Ano Premium con Selectores Propios */}
                        <div className="flex justify-between items-center mb-3">
                            <button
                                type="button"
                                onClick={irMesAnterior}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer flex items-center justify-center"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>

                            <div className="flex gap-1">
                                {/* Selector de Mes */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setDesplegableActivo(desplegableActivo === 'mes' ? 'ninguno' : 'mes')}
                                        className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-2 py-1 rounded-lg cursor-pointer transition select-none"
                                    >
                                        <span>{meses[currentMonth]}</span>
                                        <svg className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${desplegableActivo === 'mes' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>

                                    {desplegableActivo === 'mes' && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setDesplegableActivo('ninguno')} />
                                            <div className="absolute top-full left-0 mt-1 w-32 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 scrollbar-thin">
                                                {meses.map((m, idx) => {
                                                    const isSelected = currentMonth === idx;
                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => {
                                                                setCurrentMonth(idx);
                                                                setDesplegableActivo('ninguno');
                                                            }}
                                                            className={`w-full text-left px-3 py-1.5 text-xs font-semibold transition cursor-pointer flex items-center justify-between ${isSelected
                                                                ? 'bg-[#635bff]/10 text-[#635bff]'
                                                                : 'text-slate-600 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            <span>{m}</span>
                                                            {isSelected && (
                                                                <svg className="w-3.5 h-3.5 text-[#635bff]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Selector de Ano */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setDesplegableActivo(desplegableActivo === 'anio' ? 'ninguno' : 'anio')}
                                        className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-2 py-1 rounded-lg cursor-pointer transition select-none"
                                    >
                                        <span>{currentYear}</span>
                                        <svg className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${desplegableActivo === 'anio' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>

                                    {desplegableActivo === 'anio' && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setDesplegableActivo('ninguno')} />
                                            <div className="absolute top-full right-0 mt-1 w-24 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 scrollbar-thin">
                                                {aniosDisponibles.map((y) => {
                                                    const isSelected = currentYear === y;
                                                    return (
                                                        <button
                                                            key={y}
                                                            type="button"
                                                            onClick={() => {
                                                                setCurrentYear(y);
                                                                setDesplegableActivo('ninguno');
                                                            }}
                                                            className={`w-full text-left px-3 py-1.5 text-xs font-semibold transition cursor-pointer flex items-center justify-between ${isSelected
                                                                ? 'bg-[#635bff]/10 text-[#635bff]'
                                                                : 'text-slate-600 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            <span>{y}</span>
                                                            {isSelected && (
                                                                <svg className="w-3.5 h-3.5 text-[#635bff]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={irMesSiguiente}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer flex items-center justify-center"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Dias de la semana */}
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase mb-2">
                            {diasSemana.map((d, i) => (
                                <div key={i}>{d}</div>
                            ))}
                        </div>

                        {/* Cuadricula de dias */}
                        <div className="grid grid-cols-7 gap-1">
                            {dias.map((dia, idx) => {
                                if (dia === null) {
                                    return <div key={idx} />;
                                }

                                const isSelected =
                                    parsedDate.getFullYear() === currentYear &&
                                    parsedDate.getMonth() === currentMonth &&
                                    parsedDate.getDate() === dia;

                                const hoy = new Date();
                                const isToday =
                                    hoy.getFullYear() === currentYear &&
                                    hoy.getMonth() === currentMonth &&
                                    hoy.getDate() === dia;

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => seleccionarDia(dia)}
                                        className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${isSelected
                                            ? 'bg-[#635bff] text-white font-bold shadow-md'
                                            : isToday
                                                ? 'border border-[#635bff] text-[#635bff] font-bold'
                                                : 'text-slate-700 hover:bg-slate-100'
                                            }`}
                                    >
                                        {dia}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer con atajos */}
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={seleccionarHoy}
                                className="text-xs font-bold text-[#635bff] hover:underline cursor-pointer"
                            >
                                Hoy
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-xs font-bold text-slate-500 hover:underline cursor-pointer"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};



interface DashboardSmsClientProps {
    datosIniciales: any[];
}


const itemsPorPagina = 20;

export default function DashboardSmsClient({ datosIniciales }: DashboardSmsClientProps) {

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

    // Estado local de la pagina actual
    const [paginaActual, setPaginaActual] = useState(1);

    /* Datos filtrados inicialmente (mes anterior) y ordenados por fecha descendente */
    const [datosFiltrados, setDatosFiltrados] = useState(() => {
        const filtrados = datosIniciales.filter((c) => {
            const f = new Date(c.dateStr.split('/').reverse().join('-'));
            return f >= fechaInicioAuto && f <= fechaFinAuto;
        });

        return filtrados.sort((a, b) => {
            const fechaA = new Date(a.dateStr.split('/').reverse().join('-'));
            const fechaB = new Date(b.dateStr.split('/').reverse().join('-'));
            return fechaB.getTime() - fechaA.getTime();
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

        // Ordenar de fecha mas nueva a mas antigua
        resultado.sort((a, b) => {
            const fechaA = new Date(a.dateStr.split('/').reverse().join('-'));
            const fechaB = new Date(b.dateStr.split('/').reverse().join('-'));
            return fechaB.getTime() - fechaA.getTime();
        });

        setDatosFiltrados(resultado);
        setPaginaActual(1);
    };

    /* Handlers UI */
    const manejarFiltro = () => {
        filtrarDatos(fechaInicio, fechaFin, marcaSeleccionada);
    };

    const manejarCambioMarca = (marca: string) => {
        setMarcaSeleccionada(marca);
        filtrarDatos(fechaInicio, fechaFin, marca);
    };

    /* Exportar PDF con la impresion nativa cambiando temporalmente el titulo */
    const exportarPDF = () => {
        const tituloOriginal = document.title;
        const fechaHoy = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
        document.title = `Reporte-SMS - ${fechaHoy}`;

        // Agregamos la clase de impresion exclusiva al body
        document.body.classList.add('imprimir-solo-sms');

        // Llamamos a la impresion nativa
        window.print();

        // Removemos la clase para volver al estado normal en la web
        document.body.classList.remove('imprimir-solo-sms');
        document.title = tituloOriginal;
    };


    // Datos para el grafico de barras de SMS calculando las tasas porcentuales individuales
    const datosGrafico = useMemo(() => {
        return datosFiltrados.map((c) => {
            const tasaEntrega = c.sent > 0 ? (c.delivered / c.sent) * 100 : 0;
            const tasaClic = c.delivered > 0 ? ((c.clicks || 0) / c.delivered) * 100 : 0;
            return {
                name: c.name,
                'Entregados (%)': Number(tasaEntrega.toFixed(2)),
                'Clics en Link (%)': Number(tasaClic.toFixed(2)),
            };
        });
    }, [datosFiltrados]);

    /* Totales KPI */
    const totales = useMemo(() => {
        return datosFiltrados.reduce(
            (acc, curr) => ({
                enviados: acc.enviados + curr.sent,
                entregados: acc.entregados + curr.delivered,
                rechazados: acc.rechazados + (curr.rejected || 0),
                clicks: acc.clicks + (curr.clicks || 0),
            }),
            { enviados: 0, entregados: 0, rechazados: 0, clicks: 0 }
        );
    }, [datosFiltrados]);

    // Constantes de promedio de entrega y clics restauradas para evitar errores
    const promEntrega = totales.enviados > 0 ? (totales.entregados / totales.enviados) * 100 : 0;
    const promClic = totales.entregados > 0 ? (totales.clicks / totales.entregados) * 100 : 0;



    return (
        <div className="p-4">

            {/* Seccion de filtros interactivos con el mismo diseno exacto */}
            <div className="no-imprimir grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-8">

                {/* Filtro de fecha inicio */}
                <div className="flex flex-col gap-2 min-w-0">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em]">Desde:</label>
                    <CustomDatePicker value={fechaInicio} onChange={setFechaInicio} />
                </div>

                {/* Filtro de fecha fin */}
                <div className="flex flex-col gap-2 min-w-0">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em]">Hasta:</label>
                    <CustomDatePicker value={fechaFin} onChange={setFechaFin} />
                </div>

                {/* Selector dinamico de marca */}
                <div className="flex flex-col gap-2 min-w-0">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em]">Marca:</label>
                    <CustomSelect
                        value={marcaSeleccionada}
                        onChange={manejarCambioMarca}
                        options={marcasDisponibles}
                    />
                </div>

                {/* Botones aplicar y exportar PDF */}
                <div className="flex flex-col gap-2 min-w-[180px]">
                    <label className="text-[10px] font-bold text-transparent uppercase tracking-[0.18em] select-none">
                        Accion:
                    </label>
                    <div className="flex gap-2 h-11">
                        <button
                            onClick={manejarFiltro}
                            className="flex-1 rounded-xl bg-[#635bff] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#5146f0] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 cursor-pointer"
                        >
                            Aplicar
                        </button>
                        <button
                            onClick={exportarPDF}
                            className="flex-1 rounded-xl border border-[#635bff] bg-white px-5 text-sm font-bold text-[#635bff] shadow-sm transition hover:bg-[#635bff] hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 flex items-center justify-center gap-1 cursor-pointer"
                        >
                            <span>⬇</span> PDF
                        </button>
                    </div>
                </div>

                {/* Mensaje de error si fechas invalidas */}
                {error && (
                    <div className="w-full flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl mt-2 col-span-full">
                        <span className="text-lg">⚠️</span>
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}
            </div>


            {/*             {/* Tarjetas KPI para reportes de SMS con el mismo estilo del Mailing */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        Total Enviados
                    </span>
                    <span className="text-xl font-bold text-gray-800" suppressHydrationWarning>
                        {totales.enviados.toLocaleString()}
                    </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        Total Entregados
                    </span>
                    <span className="text-xl font-bold text-blue-600" suppressHydrationWarning>
                        {totales.entregados.toLocaleString()}
                    </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        % Entrega
                    </span>
                    <span className="text-xl font-bold text-indigo-600" suppressHydrationWarning>
                        {promEntrega.toFixed(2)}%
                    </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        Clics en Link
                    </span>
                    <span className="text-xl font-bold text-emerald-600" suppressHydrationWarning>
                        {totales.clicks.toLocaleString()}
                    </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        % Clic
                    </span>
                    <span className="text-xl font-bold text-emerald-700" suppressHydrationWarning>
                        {promClic.toFixed(2)}%
                    </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                        Rechazados
                    </span>
                    <span className="text-xl font-bold text-red-500" suppressHydrationWarning>
                        {totales.rechazados.toLocaleString()}
                    </span>
                </div>
            </div>


            {/* Grafico de rendimiento: Entregados vs Clics en Link */}
            <div className="my-8 h-[500px] w-full bg-white p-4 rounded-xl border border-gray-200 shadow-md overflow-hidden">
                <h2 className="text-lg font-bold mb-4 text-center text-gray-700 uppercase tracking-wide">
                    Rendimiento SMS: Entregados vs Clics en Link
                </h2>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart
                        data={datosGrafico}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={false} />
                        <YAxis tickFormatter={(tick) => `${tick}%`} />
                        <Tooltip formatter={(value) => `${value}%`} itemSorter={(item) => (item.dataKey === 'Entregados (%)' ? 1 : 2)} />
                        <Legend />
                        <Bar dataKey="Entregados (%)" fill="#3b82f6" name="% Entregados" />
                        <Bar dataKey="Clics en Link (%)" fill="#10b981" name="% Clics en Link" />
                    </BarChart>
                </ResponsiveContainer>
            </div>


            {/* Contenedor de la tabla con diseno premium de bordes y sombras */}
            <div className="overflow-hidden border border-gray-200 rounded-xl shadow-md bg-white">
                <table className="w-full border-collapse text-sm text-left">

                    {/* Cabecera estilizada de la tabla en color Indigo */}
                    <thead className="bg-[#6366f1] text-white font-bold text-center">
                        <tr>
                            <th className="py-4 px-4">Marca</th>
                            <th className="py-4 px-4 text-left">Nombre de Campana</th>
                            <th className="py-4 px-4">Total Enviados</th>
                            <th className="py-4 px-4">Total Entregados</th>
                            <th className="py-4 px-4">% de Entrega</th>
                            <th className="py-4 px-4 text-center">Clics en Link</th>
                            <th className="py-4 px-4">% de Clics</th>
                            <th className="py-4 px-4">Rechazados</th>
                            <th className="py-4 px-4">Fecha de Envio</th>
                            <th className="py-4 px-4">Hora de Envio</th>
                        </tr>
                    </thead>

                    {/* Cuerpo de la tabla con efectos hover e interlineado limpio */}
                    <tbody>
                        {datosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="py-8 text-center text-gray-500 font-semibold">
                                    No se encontraron campanas de SMS para los filtros seleccionados.
                                </td>
                            </tr>
                        ) : (
                            datosFiltrados.map((c, i) => {
                                const marcaTexto = c.brand && c.brand.trim() ? c.brand.trim() : 'Marca General';
                                const pctEntrega = c.sent > 0 ? (c.delivered / c.sent) * 100 : 0;
                                const pctClic = c.delivered > 0 ? ((c.clicks || 0) / c.delivered) * 100 : 0;

                                // Paginacion: identifica que filas quedan ocultas en la vista web actual
                                const indiceInicio = (paginaActual - 1) * itemsPorPagina;
                                const indiceFin = indiceInicio + itemsPorPagina;
                                const estaFueraDePagina = i < indiceInicio || i >= indiceFin;

                                return (
                                    <tr
                                        key={i}
                                        className={`border-b border-gray-100 even:bg-slate-50 hover:bg-indigo-50 transition-colors text-center text-gray-700 ${estaFueraDePagina ? 'fila-oculta-pantalla' : ''}`}
                                    >
                                        {/* Columna: Marca con su Badge correspondiente */}
                                        <td className="py-3.5 px-4 font-semibold">
                                            <span
                                                className={`marca-badge whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-bold border ${obtenerEstiloMarca(
                                                    marcaTexto
                                                )}`}
                                            >
                                                {marcaTexto}
                                            </span>
                                        </td>

                                        {/* Columna: Nombre de Campana */}
                                        <td className="py-3.5 px-4 text-left font-medium text-slate-900">
                                            {c.name}
                                        </td>

                                        {/* Columna: Total Enviados */}
                                        <td className="py-3.5 px-4 font-medium" suppressHydrationWarning>
                                            {c.sent.toLocaleString()}
                                        </td>

                                        {/* Columna: Total Entregados */}
                                        <td className="py-3.5 px-4 font-medium text-slate-600" suppressHydrationWarning>
                                            {c.delivered.toLocaleString()}
                                        </td>

                                        {/* Columna: % de Entrega */}
                                        <td className="py-3.5 px-4 font-medium text-slate-600" suppressHydrationWarning>
                                            {pctEntrega.toFixed(2)}%
                                        </td>

                                        {/* Columna: Clics en Link */}
                                        <td className="py-3.5 px-4 font-bold text-indigo-600" suppressHydrationWarning>
                                            {c.clicks.toLocaleString()}
                                        </td>

                                        {/* Columna: % de Clics */}
                                        <td className="py-3.5 px-4 font-medium text-slate-600" suppressHydrationWarning>
                                            {pctClic.toFixed(2)}%
                                        </td>

                                        {/* Columna: Rechazados */}
                                        <td className="py-3.5 px-4 font-medium text-slate-600" suppressHydrationWarning>
                                            {(c.rejected || 0).toLocaleString()}
                                        </td>

                                        {/* Columna: Fecha de Envio */}
                                        <td className="py-3.5 px-4 text-slate-500">
                                            {c.dateStr}
                                        </td>

                                        {/* Columna: Hora de Envio */}
                                        <td className="py-3.5 px-4 text-slate-500">
                                            {c.timeStr}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>


            {/* Controles de Paginacion Premium - Se ocultan automaticamente al imprimir en PDF */}
            {datosFiltrados.length > itemsPorPagina && (
                <div className="no-imprimir flex items-center justify-between mt-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <span className="text-xs text-slate-500 font-semibold select-none">
                        Mostrando del <span className="font-bold text-slate-700">{Math.min((paginaActual - 1) * itemsPorPagina + 1, datosFiltrados.length)}</span> al <span className="font-bold text-slate-700">{Math.min(paginaActual * itemsPorPagina, datosFiltrados.length)}</span> de <span className="font-bold text-slate-700">{datosFiltrados.length}</span> campanas
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                            disabled={paginaActual === 1}
                            className="h-9 px-4 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 select-none"
                        >
                            ◀ Anterior
                        </button>
                        <div className="flex items-center gap-1.5 px-3 h-9 text-xs font-bold text-slate-600 bg-slate-50 rounded-xl border border-slate-100 select-none">
                            Pagina {paginaActual} de {Math.ceil(datosFiltrados.length / itemsPorPagina)}
                        </div>
                        <button
                            onClick={() => setPaginaActual(prev => Math.min(prev + 1, Math.ceil(datosFiltrados.length / itemsPorPagina)))}
                            disabled={paginaActual === Math.ceil(datosFiltrados.length / itemsPorPagina)}
                            className="h-9 px-4 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 select-none"
                        >
                            Siguiente ▶
                        </button>
                    </div>
                </div>
            )}

            {/* Ocultamiento dinamico: solo aplica en navegacion web (pantalla), no afecta al PDF de impresion */}
            <style>{`
                @media screen {
                    .fila-oculta-pantalla {
                        display: none !important;
                    }
                }
            `}</style>

        </div>
    );
}
