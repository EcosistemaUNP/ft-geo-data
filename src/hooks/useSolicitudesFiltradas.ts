import { useEffect, useMemo, useState } from "react";
import { getSolicitudes, type PorDia, type ResumenParcial } from "../services";

interface SolicitudesState {
  data: PorDia[];
  resumenParcial: ResumenParcial | null;
  loading: boolean;
  error: string | null;
}

export function useSolicitudesFiltradas(
  fechaInicio: string,
  fechaFin: string
): SolicitudesState {
  const [data, setData] = useState<PorDia[]>([]);
  const [resumenParcialBack, setResumenParcialBack] = useState<ResumenParcial | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("[useSolicitudesFiltradas] Ejecutando con fechas:", fechaInicio, fechaFin);
        const { por_dia, resumen_parcial } = await getSolicitudes(fechaInicio, fechaFin);

        if (!isActive) return;

        setData(por_dia ?? []);
        setResumenParcialBack(resumen_parcial ?? null);
      } catch (e: any) {
        if (!isActive) return;
        setError(e?.message ?? "Error al cargar solicitudes");
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [fechaInicio, fechaFin]);

  // Recalcular en front (por si back no filtra bien)
  const resumenParcialFront = useMemo<ResumenParcial | null>(() => {
    if (!data.length) return null;
    const total_individual = data.reduce((acc, d) => acc + d.total_individual, 0);
    const total_colectivo = data.reduce((acc, d) => acc + d.total_colectivo, 0);
    const total_general = total_individual + total_colectivo;
    return {
      total_individual,
      total_colectivo,
      total_general,
      porcentaje_individual: total_general ? (total_individual / total_general) * 100 : 0,
      porcentaje_colectivo: total_general ? (total_colectivo / total_general) * 100 : 0,
    };
  }, [data]);

  // Usa el cálculo del front si existe; si no, el del back
  return {
    data,
    resumenParcial: resumenParcialFront ?? resumenParcialBack,
    loading,
    error,
  };
}