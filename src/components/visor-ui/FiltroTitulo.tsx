import React, { memo } from "react";
import { FaEyeSlash, FaEye } from 'react-icons/fa';

interface Props {
    onToggle: () => void;
    filtrosVisibles?: boolean;
}

const FiltroTitulo: React.FC<Props> = memo(({
    onToggle,
    filtrosVisibles = true
}) => {
    return (
        <div className="titulo-filtro">
            <div className="icono-titulo">
                {/* <FaFilter className="icono-titulo-filtro" /> */}
                <h4>Filtros</h4>
            </div>
            <div className="icono-derecha" onClick={onToggle}>
                {filtrosVisibles ? (
                    <FaEyeSlash className="icono-titulo-derecha" />
                ) : (
                    <FaEye className="icono-titulo-derecha" />
                )}
            </div>
        </div>
    );
});

export { FiltroTitulo };