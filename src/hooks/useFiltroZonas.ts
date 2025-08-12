import { useState, useCallback } from "react";

interface FiltrosState {
  idVigencia: number | null;
  idZona: number | null;
  idDepartamento: number | null;
  idMunicipio: number | null;
}

export const useFiltrosZonas = (initialState: FiltrosState = {
  idVigencia: null,
  idZona: null,
  idDepartamento: null,
  idMunicipio: null
}) => {
  const [filtros, setFiltros] = useState<FiltrosState>(initialState);
  
  const actualizarFiltro = useCallback((campo: keyof FiltrosState, valor: number | null) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  }, []);

  return { filtros, actualizarFiltro };
};