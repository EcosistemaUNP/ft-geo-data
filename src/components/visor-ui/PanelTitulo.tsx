import React, { memo } from "react";
import { MdSpaceDashboard, MdMap, MdDescription } from "react-icons/md";

interface PanelTituloProps {
  vistaActual: string;
  onVistaChange: (vista: 'datos' | 'geografico' | 'informe') => void;
}

const PanelTitulo: React.FC<PanelTituloProps> = memo(({ vistaActual, onVistaChange }) => {
  return (
    <div className="titulo-filtro">
      <div className="icono-titulo">
        <MdSpaceDashboard className="icono-titulo-filtro" />

        <div className="panel-selector">
          <select
            value={vistaActual}
            onChange={(e) => onVistaChange(e.target.value as 'datos' | 'geografico' | 'informe')}
            className="vista-selector"
          >
            <option value="datos">
              <MdSpaceDashboard /> Visor de datos
            </option>
            <option value="geografico">
              <MdMap /> Visor geográfico
            </option>
            <option value="informe">
              <MdDescription /> Generación de informe
            </option>
            <option value="aeris">
              <MdDescription /> Aeris (IA)
            </option>
          </select>

          <div className="selector-arrow">
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>

      <div className="icono-derecha"></div>
    </div>
  );
});

export { PanelTitulo };