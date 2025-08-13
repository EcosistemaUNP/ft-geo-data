import React, { useMemo } from "react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import type { PorDia } from "../../../../services";

const COLORS = ['#B5B3E6', '#e99c70ff'];

interface TipoSolicitudPieChartProps {
  rawData: PorDia[];
  fechaInicio?: string;
  fechaFin?: string;
}

export const TipoSolicitudPieChart: React.FC<TipoSolicitudPieChartProps> = ({
  rawData,
  fechaInicio,
  fechaFin
}) => {

  // Calcula resumen a partir de rawData y rango de fechas
  const resumenParcial = useMemo(() => {
    if (!rawData?.length) {
      return {
        total_individual: 0,
        total_colectivo: 0,
        total_general: 0,
        porcentaje_individual: 0,
        porcentaje_colectivo: 0,
      };
    }

    const start = fechaInicio || "0000-01-01";
    const end = fechaFin || "9999-12-31";

    const filtrados = rawData.filter(d => d.dia >= start && d.dia <= end);

    const total_individual = filtrados.reduce((acc, d) => acc + d.total_individual, 0);
    const total_colectivo = filtrados.reduce((acc, d) => acc + d.total_colectivo, 0);
    const total_general = total_individual + total_colectivo;

    return {
      total_individual,
      total_colectivo,
      total_general,
      porcentaje_individual: total_general ? (total_individual / total_general) * 100 : 0,
      porcentaje_colectivo: total_general ? (total_colectivo / total_general) * 100 : 0,
    };
  }, [rawData, fechaInicio, fechaFin]);

  const data = [
    { name: 'Individuales', value: resumenParcial.total_individual },
    { name: 'Colectivas', value: resumenParcial.total_colectivo },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={90}
          outerRadius={140}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value}`, name]}
          labelFormatter={() =>
            fechaInicio && fechaFin
              ? `Rango: ${fechaInicio} → ${fechaFin}`
              : undefined
          }
        />
        <Legend
          align="center"
          verticalAlign="bottom"
          layout="horizontal"
          iconType="circle"
          formatter={(value, entry: any) =>
            `${value}: ${entry.payload.value}`
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
};