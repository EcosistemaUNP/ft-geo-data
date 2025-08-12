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

          <div className="selector-arrow" style={{paddingBottom: '0.25rem'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>

        </div>
      </div>

      <div className="icono-derecha"></div>
    </div>
  );
});

export { PanelTitulo };