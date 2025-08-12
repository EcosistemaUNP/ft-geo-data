import { PureComponent } from 'react';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const data = [
  { name: 'Individuales', value: Math.floor(Math.random() * (135 - 5 + 1)) + 5 },
  { name: 'Colectivas', value: Math.floor(Math.random() * (40 - 5 + 1)) + 5 },
  { name: 'Otros', value: Math.floor(Math.random() * (30 - 5 + 1)) + 5 },
];

const COLORS = ['#5ed4d0ff', '#e99c70ff', '#6aa3dcff'];

interface TipoSolicitudPieChartProps {
  fechaInicio?: string;
  fechaFin?: string;
}

class TipoSolicitudPieChart extends PureComponent<TipoSolicitudPieChartProps> {
  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50} // Le agrega un borde a la gráfica
            outerRadius={80}
          // paddingAngle={5}
          // label={false}
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            align="left"
            verticalAlign="bottom"
            layout="horizontal"
            iconType="circle"
            formatter={(value, entry: any) => `${value}: ${entry.payload.value}`}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

export { TipoSolicitudPieChart }