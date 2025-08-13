// services/solicitudes.ts
export interface PorDia {
  dia: string;
  total_individual: number;
  total_colectivo: number;
  total_general: number;
  porcentaje_individual: number;
  porcentaje_colectivo: number;
}

export interface ResumenParcial {
  total_individual: number;
  total_colectivo: number;
  total_general: number;
  porcentaje_individual: number;
  porcentaje_colectivo: number;
}

export interface SolicitudesApiResponse {
  status: string;
  agrupado_por: string[];
  por_dia: PorDia[];
  resumen_parcial: ResumenParcial;
}

const BASE_URL = "http://172.16.194.64:8000/geo-data/formularios";

export const getSolicitudes = async (
  fechaInicio?: string,
  fechaFin?: string
): Promise<SolicitudesApiResponse> => {
  const params = new URLSearchParams();
  if (fechaInicio) params.append("fecha_inicio", fechaInicio);
  if (fechaFin) params.append("fecha_fin", fechaFin);
  params.append("_t", Date.now().toString()); // Evita caché

  const url = `${BASE_URL}/solicitudes?${params.toString()}`;
  console.log("[getSolicitudes] URL solicitada:", url);

  const res = await fetch(url, { cache: "no-store" }); // Forzar no cache
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

  const json: SolicitudesApiResponse = await res.json();
  console.log("[getSolicitudes] Respuesta cruda:", json);
  return json;
};