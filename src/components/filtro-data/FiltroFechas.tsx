import React, { useState } from "react";
import { Col } from "react-bootstrap";
import FiltroCard from '../visor-ui/FiltroCard';

interface FiltroFechasProps {
    forceRecalculate?: boolean;
    onFechaChange: (inicio: string, fin: string) => void; // Nuevo prop
}



const FiltroFechas: React.FC<FiltroFechasProps> = ({
    forceRecalculate,
    onFechaChange
}) => {
    const [fechaInicioLocal, setFechaInicioLocal] = useState<string>('');
    const [fechaFinLocal, setFechaFinLocal] = useState<string>('');

    // Manejar cambios en los inputs
    const handleInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inicio = e.target.value;
        setFechaInicioLocal(inicio);
        onFechaChange(inicio, fechaFinLocal);
    };

    const handleFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fin = e.target.value;
        setFechaFinLocal(fin);
        onFechaChange(fechaInicioLocal, fin);
    };

    return (
        <FiltroCard title="Periodo" forceRecalculate={forceRecalculate}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '5px', height: 'auto' }}>
                <Col xs={12} md={6}>
                    <label className="card-label">Fecha de inicio</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaInicioLocal}
                        onChange={handleInicioChange}
                    />
                </Col>
                <Col xs={12} md={6} lg={6}>
                    <label className="card-label">Fecha de fin</label>
                    <input
                        type="date"
                        className="form-control"
                        style={{ width: '96.6%' }}
                        value={fechaFinLocal}
                        onChange={handleFinChange}
                    />
                </Col>
            </div>
        </FiltroCard>
    );
};

export { FiltroFechas }