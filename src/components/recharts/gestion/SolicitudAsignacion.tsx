import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaCalendar, FaChartBar } from 'react-icons/fa6';

const Solicitud: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
    const [showLineChart, setShowLineChart] = useState(false);
    const [forceRender, setForceRender] = useState(0);
    const [containerHeight, setContainerHeight] = useState(400);

    // Forzar rerender cuando la pestaña se hace visible
    useEffect(() => {
        if (isVisible) {
            setForceRender(prev => prev + 1);
            const timer = setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
                const container = document.querySelector('.container-pay');
                if (container) {
                    const width = container.clientWidth;
                    setContainerHeight(width * 0.8); // Aumentamos la relación de aspecto
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    // Datos para el gráfico de barras
    const barData = [
        { name: 'Asignadas', value: 10 },
        { name: 'Devolución', value: 15 },
        { name: 'Traslado', value: 13 },
        { name: 'Inactivas', value: 17 },
        { name: 'Calidad', value: 20 },
        { name: 'Premesa', value: 12 },
        { name: 'Subcomisión', value: 15 },
        { name: 'Unificación', value: 9 },
    ];

    // Datos para el gráfico de líneas
    const lineData = useMemo(() => {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        return meses.map((mes, index) => {
            return {
                name: mes,
                Asignadas: [10, 15, 13, 17, 12, 10, 17, 11, 13, 16, 9, 14][index],
                Devueltas: [16, 5, 11, 9, 10, 7, 20, 12, 10, 8, 13, 10][index],
                Trasladadas: [14, 7, 13, 11, 8, 9, 18, 14, 12, 10, 15, 12][index],
                Inactivadas: [2, 5, 3, 4, 3, 6, 8, 6, 7, 6, 3, 4][index],
                'En Calidad': [0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 5, 2][index],
                'En Premsa': [0, 0, 0, 0, 0, 0, 0, 6, 4, 5, 2, 3][index],
                'En Subcomisión': [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 6][index],
                Unificadas: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0][index]
            };
        });
    }, []);

    // Colores para las series
    const lineColors = [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
        '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'
    ];

    const toggleView = () => {
        setShowLineChart(!showLineChart);
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{
                    backgroundColor: '#d1dae6',
                    padding: '10px',
                    border: '1px solid #eaeef4',
                    borderRadius: '5px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '14px',
                    color: '#1e2633'
                }}>
                    <p className="label" style={{ marginBottom: '5px', fontWeight: 'bold' }}>{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{
                            color: entry.color,
                            margin: '3px 0',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <span style={{
                                display: 'inline-block',
                                width: '12px',
                                height: '12px',
                                backgroundColor: entry.color,
                                marginRight: '8px',
                                borderRadius: '2px'
                            }}></span>
                            {entry.name}: <strong>{entry.value}</strong>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // CustomBarLabel para mostrar valores dentro de las barras
    const CustomBarLabel = (props: any) => {
        const { x, y, width, height, value } = props;
        return (
            <text
                x={x + width / 2}
                y={y + height / 2}
                fill="#FFF"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fontWeight="bold"
            >
                {value}
            </text>
        );
    };

    return (
        <div
            className='container-pay'
            style={{
                width: '100%',
                height: containerHeight,
                backgroundColor: '#F8F9FA',
                padding: '15px',
                borderRadius: '5px',
                display: 'flex',
                flexDirection: 'column'
            }}
            key={forceRender}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                flexShrink: 0
            }}>
                <h3 style={{
                    color: '#303D50',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: 0
                }}>
                    {showLineChart ? "Solicitudes por mes" : "Solicitudes"}
                </h3>

                <button
                    className='boton-grafico'
                    onClick={toggleView}
                    style={{
                        position: 'absolute',
                        top: 455,
                        right: 10,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '5px',
                        borderRadius: '50%',
                        width: '34px',
                        height: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#e9ecef',
                        transition: 'background-color 0.2s'
                    }}
                >
                    {showLineChart ? (
                        <FaChartBar style={{ color: '#303D50', fontSize: '18px' }} />
                    ) : (
                        <FaCalendar style={{ color: '#303D50', fontSize: '18px' }} />
                    )}
                </button>
            </div>

            <div style={{ flex: 1, width: '100%', minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    {showLineChart ? (
                        <LineChart
                            data={lineData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="name" stroke="#303D50" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#303D50" tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                wrapperStyle={{ paddingBottom: '10px' }}
                                formatter={(value) => (
                                    <span style={{ color: '#303D50', fontSize: 12 }}>{value}</span>
                                )}
                            />
                            {Object.keys(lineData[0] || {}).filter(key => key !== 'name').map((key, index) => (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={lineColors[index % lineColors.length]}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            ))}
                        </LineChart>
                    ) : (
                        <BarChart
                            data={barData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            barCategoryGap={10} // Menos espacio entre barras
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                                dataKey="name"
                                stroke="#303D50"
                                tick={{ fontSize: 10 }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={70}
                            />
                            <YAxis stroke="#303D50" tick={{ fontSize: 12 }} />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            />
                            <Bar
                                dataKey="value"
                                name="Solicitudes"
                                fill="#59789E"
                                barSize={50} // Barras más anchas
                                label={<CustomBarLabel />}
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export { Solicitud };