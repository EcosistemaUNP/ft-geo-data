import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const OrdenesTrabajo: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
    
    const [forceRender, setForceRender] = useState(0);
    const [containerHeight, setContainerHeight] = useState(300);

    useEffect(() => {
        if (isVisible) {
            setForceRender(prev => prev + 1);
            const timer = setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
                const container = document.querySelector('.container-pay');
                if (container) {
                    const width = container.clientWidth;
                    setContainerHeight(width * 1.2); // Aumentamos la altura para acomodar la leyenda
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const data = [
        { name: 'Activas', value: 50 },
        { name: 'Finalizadas', value: 30 },
        { name: 'Remitidas', value: 25 },
        { name: 'Novedades', value: 10 },
    ];

    const COLORS = ['#394e6b', '#466083', '#59789e', '#32435a'];
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const entry = payload[0].payload;
            const percent = (entry.value / total) * 100;

            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: '#d1dae6',
                        padding: '5px',
                        border: '1px solid #eaeef4',
                        borderRadius: '5px',
                        fontFamily: 'Arial, sans-serif'
                    }}
                >
                    <p style={{ margin: 0, color: '#1e2633', fontSize: '16px' }}>
                        <b>{entry.name}</b>: {percent.toFixed(1)}% ({entry.value})
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div
            className='container-pay'
            key={forceRender}
            style={{
                width: '49%',
                height: containerHeight,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#F8F9FA',
                padding: '10px',
                borderRadius: '5px',
                position: 'relative'
            }}
        >
            <h3
                style={{
                    textAlign: 'center',
                    color: '#303D50',
                    fontSize: '16px',
                    fontWeight: '500'
                }}
            >
                Órdenes de trabajo
            </h3>

            <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius="50%"
                                outerRadius="90%"
                                paddingAngle={0}
                                dataKey="value"
                                labelLine={false}
                            >
                                {data.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Leyenda en la parte inferior */}
                <div style={{ width: '100%', padding: '10px 0' }}>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '15px',
                        marginTop: '10px'
                    }}>
                        {data.map((entry, index) => (
                            <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: COLORS[index],
                                    borderRadius: '3px',
                                    marginRight: '5px'
                                }}></div>
                                <span style={{
                                    color: '#303D50',
                                    fontSize: '14px',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {entry.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { OrdenesTrabajo };