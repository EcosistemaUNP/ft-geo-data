export interface PorDia {
  dia: string;
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
}

const BASE_URL = "http://172.16.194.64:8000/geo-data/formularios";

export const getSolicitudes = async (): Promise<PorDia[]> => {
  const res = await fetch(`${BASE_URL}/solicitudes`);
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  const json: SolicitudesApiResponse = await res.json();

  return json.por_dia ?? [];
};