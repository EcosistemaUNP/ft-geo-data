import React, { memo, useRef } from "react";
import { Row, Col } from "react-bootstrap";

import { useElementVisibility, useFiltrosZonas } from "../hooks";
import { GraficosGestion, MapGestion, SelectGestion } from "../components";

import '../styles/gestionStyles.css'

const DataGestion: React.FC = () => {

    const containerRef = useRef<HTMLElement>(null!);
    const isVisible = useElementVisibility(containerRef);

    const { filtros, actualizarFiltro } = useFiltrosZonas();
    const { idZona, idDepartamento, idMunicipio } = filtros;

    return (
        <Row
            ref={containerRef}
            className="row-zonas-registro pt-2 mx-0"
        >
            <Col className="col-zonas-registro px-0 border rounded">
                <MapGestion
                    key={`${idZona}-${idDepartamento}-${idMunicipio}`}
                    idZona={idZona}
                    idDepartamento={idDepartamento}
                    idMunicipio={idMunicipio}
                />
            </Col>

            <Col className="col-zonas-registro px-0">
                <SelectGestion
                    onVigenciaChange={(id) => actualizarFiltro("idVigencia", id)}
                    onZonaChange={(id) => actualizarFiltro("idZona", id)}
                    onDptoChange={(id) => actualizarFiltro("idDepartamento", id)}
                    onMpioChange={(id) => actualizarFiltro("idMunicipio", id)}
                />
                <GraficosGestion
                    isVisible={isVisible}
                    idZona={idZona}
                    idDepartamento={idDepartamento}
                    idMunicipio={idMunicipio}
                />
            </Col>
        </Row>
    )
}

export default memo(DataGestion)
