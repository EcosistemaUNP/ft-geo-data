import { useEffect, useState, useMemo } from "react";
import { getSolicitudes, type PorDia } from "../services";

interface ChartPoint {
  fecha: string;
  individual: number;
  colectivo: number;
  total: number;
}

export function useSolicitudesFiltradas(fechaInicio: string, fechaFin: string) {
  const [raw, setRaw] = useState<PorDia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSolicitudes();
        setRaw(data);
      } catch (e: any) {
        setError(e.message ?? "Error al cargar solicitudes");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = useMemo<ChartPoint[]>(() => {
    const start = fechaInicio || "0000-01-01";
    const end = fechaFin || "9999-12-31";
    return raw
      .filter(d => d.dia >= start && d.dia <= end)
      .map(d => ({
        fecha: d.dia,
        individual: d.total_individual,
        colectivo: d.total_colectivo,
        total: d.total_general,
      }));
  }, [raw, fechaInicio, fechaFin]);

  return { data: filtered, loading, error };
}