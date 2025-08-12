import React, { useState, useRef, useEffect, useMemo, memo, useCallback } from "react";
import { FaPeopleLine, FaEye, FaBoxesPacking, FaFileLines, FaFileShield, FaUserShield, FaUsersViewfinder, FaBuildingShield, FaChartLine } from 'react-icons/fa6';
import { TbForms } from "react-icons/tb";

import { PreubaStackedAreaChart, Example, PanelTitulo, FiltroTitulo, FiltroDiscapacidad, FiltroSolicitud } from "../components";
import { FiltroUbicacion, FiltroFechas, FiltroGenero, FiltroRangoEtario, FiltroGrupoEtnico } from "../components";

import '../styles/visorStyles.css';
import { TipoSolicitudPieChart } from "../components/recharts/visor/pie-charts/TipoSolicitudPieChart";
import { GeneroBarChart } from "../components/recharts/visor/bar-charts/GeneroBarChart";

const DataVisor: React.FC = () => {

    const [filtrosVisibles, setFiltrosVisibles] = useState(true);
    const [categoriaActiva, setCategoriaActiva] = useState<'demograficos' | 'operativos'>('demograficos');
    const [vistaActual, setVistaActual] = useState<'datos' | 'geografico' | 'informe' | 'aeris'>('datos');
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [fechaInicio, setFechaInicio] = useState<string>('');
    const [fechaFin, setFechaFin] = useState<string>('');

    const handleFechaChange = useCallback((inicio: string, fin: string) => {
        setFechaInicio(inicio);
        setFechaFin(fin);
    }, []);

    const handleVistaChange = useCallback((vista: 'datos' | 'geografico' | 'informe') => {
        setVistaActual(vista);
    }, []);


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const visible = entry.isIntersecting;
                setIsVisible(visible);
                if (visible) {
                    requestAnimationFrame(() => {
                        window.dispatchEvent(new Event('resize'));
                    });
                }
            },
            { threshold: 0.5 }
        );

        const currentRef = containerRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    useEffect(() => {
        if (filtrosVisibles) {
            requestAnimationFrame(() => {
                window.dispatchEvent(new Event('resize'));
            });
        }
    }, [filtrosVisibles]);

    const toggleFiltros = useCallback(() => {
        setFiltrosVisibles(prev => !prev);
    }, []);

    // Filtros demográficos
    const filtrosDemograficos = useMemo(() => [
        <FiltroSolicitud key="solicitud" forceRecalculate={isVisible} />,
        <FiltroFechas key="fechas" forceRecalculate={isVisible} onFechaChange={handleFechaChange} />,
        <FiltroUbicacion key="ubicacion" forceRecalculate={isVisible} />,
        <FiltroGenero key="genero" forceRecalculate={isVisible} />,
        <FiltroRangoEtario key="rango-etario" forceRecalculate={isVisible} />,
        <FiltroGrupoEtnico key="grupo-etnico" forceRecalculate={isVisible} />,
        <FiltroDiscapacidad key="discapacidad" forceRecalculate={isVisible} />
    ], [isVisible, handleFechaChange]);

    // Filtros operativos
    const filtrosOperativos = useMemo(() => [
        <FiltroFechas key="fechas" forceRecalculate={isVisible} onFechaChange={handleFechaChange} />,
    ], [isVisible, handleFechaChange]);

    // Determinar qué filtros mostrar según la categoría activa
    const filtrosAMostrar = categoriaActiva === 'demograficos'
        ? filtrosDemograficos
        : filtrosOperativos;

    // Determinar qué componente mostrar según la vista seleccionada
    const renderVista = () => {
        switch (vistaActual) {
            case 'datos':
                return (
                    <div className="panel-body">
                        <div className="panel-row">
                            <div className="panel-row-item" style={{ minHeight: '90px' }}>
                                <div className="item-card">
                                    <div className="item-card-title">
                                        <FaFileLines color="#CC5159" />
                                        <h5>Ordenes de trabajo</h5>
                                    </div>
                                    <h2>12306</h2>
                                </div>
                            </div>
                            <div className="panel-row-item" style={{ minHeight: '90px' }}>
                                <div className="item-card">
                                    <div className="item-card-title">
                                        <FaFileShield color="#CC5159" />
                                        <h5>Trámites de emergencia</h5>
                                    </div>
                                    <h2>2508</h2>
                                </div>
                            </div>
                            <div className="panel-row-item" style={{ minHeight: '90px' }}>
                                <div className="item-card">
                                    <div className="item-card-title">
                                        <FaUserShield color="#CC5159" />
                                        <h5>Evaluaciones individuales</h5>
                                    </div>
                                    <h2>9478</h2>
                                </div>
                            </div>
                            <div className="panel-row-item" style={{ minHeight: '90px' }}>
                                <div className="item-card">
                                    <div className="item-card-title">
                                        <FaUsersViewfinder color="#CC5159" />
                                        <h5>Evaluaciones colectivas</h5>
                                    </div>
                                    <h2>2828</h2>
                                </div>
                            </div>
                            <div className="panel-row-item" style={{ minHeight: '90px' }}>
                                <div className="item-card">
                                    <div className="item-card-title">
                                        <FaBuildingShield color="#CC5159" />
                                        <h5>Sedes y residencias</h5>
                                    </div>
                                    <h2>623</h2>
                                </div>
                            </div>
                            <div className="panel-row-item" style={{ minHeight: '90px' }}>
                                <div className="item-card">
                                    <div className="item-card-title">
                                        <FaChartLine color="#CC5159" />
                                        <h5>Total de solicitudes</h5>
                                    </div>
                                    <h2>17265</h2>
                                </div>
                            </div>
                            <div className="panel-row-item-ia" style={{ minHeight: '90px' }}>
                                <div className="item-card-ia">
                                    <TbForms className="icon" />
                                    <h5>Aeris</h5>
                                </div>
                            </div>
                        </div>
                        <div className="panel-row">
                            <div className="panel-row-item" style={{ minWidth: '33%', minHeight: '400px' }}>
                                <TipoSolicitudPieChart />
                                {/* <PreubaStackedAreaChart /> */}
                            </div>
                            <div className="panel-row-item" style={{ minWidth: '54%', minHeight: '400px' }}>
                                <Example fechaInicio={fechaInicio} fechaFin={fechaFin} />
                            </div>
                        </div>
                        <div className="panel-row" style={{ marginBottom: '5px' }}>
                            <div className="panel-row-item" style={{ minWidth: '66%', minHeight: '370px' }}>
                                <GeneroBarChart fechaInicio={fechaInicio} fechaFin={fechaFin} />
                                {/* <Example fechaInicio={fechaInicio} fechaFin={fechaFin} /> */}
                            </div>
                            <div className="panel-row-item" style={{ minWidth: '66%', minHeight: '370px' }}>
                                <PreubaStackedAreaChart />
                            </div>
                        </div>
                    </div>
                );
            case 'geografico':
                return <></>;
            case 'informe':
                return <></>;
            case 'aeris':
                return <></>
            default:
                return <></>;
        }
    };

    return (
        <div className="contenedor-reportes" ref={containerRef}>
            <div className={`contenedor-panel ${!filtrosVisibles ? 'contenedor-panel-full' : ''}`}>
                {!filtrosVisibles && (
                    <div className="boton-mostrar-filtros" onClick={toggleFiltros}>
                        <FaEye className="icono-mostrar-filtros" />
                    </div>
                )}

                <PanelTitulo
                    vistaActual={vistaActual}
                    onVistaChange={handleVistaChange}
                />

                {renderVista()}
            </div>

            {filtrosVisibles && (
                <div className="contenedor-filtro">
                    <FiltroTitulo onToggle={toggleFiltros} />

                    <div className="filtros-categorias">
                        <div
                            className={`categoria ${categoriaActiva === 'demograficos' ? 'categoria-activa' : ''}`}
                            onClick={() => setCategoriaActiva('demograficos')}
                        >
                            <FaPeopleLine className="icono-categoria" />
                            <h6>Demográficos</h6>
                        </div>
                        <div
                            className={`categoria ${categoriaActiva === 'operativos' ? 'categoria-activa' : ''}`}
                            onClick={() => setCategoriaActiva('operativos')}
                        >
                            <FaBoxesPacking className="icono-categoria" />
                            <h6>Operativos</h6>
                        </div>
                    </div>

                    <div className="filtros-scroll-container">
                        {filtrosAMostrar}
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(DataVisor);