import React from "react";

import { OrdenesTrabajo, Solicitud, TipoRuta } from "../../components";

import '../../styles/gestionStyles.css'

interface Props {
    isVisible?: boolean;
    idZona?: number | null;
    idDepartamento?: number | null;
    idMunicipio?: number | null;
}

const GraficosGestion: React.FC<Props> = ({ isVisible = false }) => {
    return (
        <div className="table-zonas-registro border rounded">
            <OrdenesTrabajo isVisible={isVisible} />
            <TipoRuta  isVisible={isVisible} />
            <Solicitud isVisible={isVisible} />
        </div>
    );
};

export { GraficosGestion };