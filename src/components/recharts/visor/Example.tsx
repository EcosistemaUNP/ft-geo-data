import React, { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import type { PorDia } from "../../../services";

type Solicitud = "individual" | "colectiva" | null;

interface ExampleProps {
  rawData: PorDia[];          // datos crudos desde el hook
  solicitud?: Solicitud;      // filtro por tipo de solicitud
  fechaInicio?: string;       // formato YYYY-MM-DD
  fechaFin?: string;
}

const Example: React.FC<ExampleProps> = ({
  rawData,
  solicitud = null,
  fechaInicio,
  fechaFin
}) => {

  // Filtrado y mapeo en el propio componente
  const data = useMemo(() => {
    const start = fechaInicio || "0000-01-01";
    const end = fechaFin || "9999-12-31";

    return rawData
      .filter(d => d.dia >= start && d.dia <= end)
      .map(d => ({
        fecha: d.dia,
        individual: d.total_individual,
        colectivo: d.total_colectivo,
        total: d.total_general
      }));
  }, [rawData, fechaInicio, fechaFin]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" tickFormatter={formatDate} height={50} />
        <YAxis />
        <Tooltip labelFormatter={(v) => formatDate(String(v))} />
        <Legend />

        {(!solicitud || solicitud === "individual") && (
          <Line type="monotone" dataKey="individual" stroke="#82ca9d" name="Individual" />
        )}
        {(!solicitud || solicitud === "colectiva") && (
          <Line type="monotone" dataKey="colectivo" stroke="#8884d8" name="Colectiva" />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

export { Example };