import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

type Solicitud = 'individual' | 'colectiva' | null;

interface ExampleProps {
  data: { fecha: string; individual: number; colectivo: number; total: number }[];
  solicitud?: Solicitud;
}

const Example: React.FC<ExampleProps> = ({ data, solicitud = null }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" tickFormatter={formatDate} height={50} />
        <YAxis />
        <Tooltip labelFormatter={(v) => formatDate(String(v))} />
        <Legend />

        {(!solicitud || solicitud === 'individual') && (
          <Line type="monotone" dataKey="individual" stroke="#82ca9d" name="Individual" />
        )}
        {(!solicitud || solicitud === 'colectiva') && (
          <Line type="monotone" dataKey="colectivo" stroke="#8884d8" name="Colectiva" />
        )}

        {/* Si quieres mantener el total siempre visible, deja descomentado:
        <Line type="monotone" dataKey="total" stroke="#ff7300" name="Total" />
        */}
      </LineChart>
    </ResponsiveContainer>
  );
};

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

export { Example };