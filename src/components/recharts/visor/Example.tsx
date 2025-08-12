import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Datos de ejemplo con fechas reales
const data = [
  { fecha: '2025-06-17', name: 'Ene 01', uv: 4000, pv: 2400, amt: 2400 },
  { fecha: '2025-06-15', name: 'Ene 02', uv: 3000, pv: 1398, amt: 2210 },
  { fecha: '2025-06-16', name: 'Ene 03', uv: 2000, pv: 9800, amt: 2290 },
  { fecha: '2025-06-17', name: 'Ene 04', uv: 2780, pv: 3908, amt: 2000 },
  { fecha: '2025-06-18', name: 'Ene 05', uv: 1890, pv: 4800, amt: 2181 },
  { fecha: '2025-06-19', name: 'Ene 06', uv: 2390, pv: 3800, amt: 2500 },
  { fecha: '2025-06-20', name: 'Ene 07', uv: 3490, pv: 4300, amt: 2100 },
  { fecha: '2025-06-21', name: 'Ene 08', uv: 3200, pv: 4100, amt: 2200 },
  { fecha: '2025-06-22', name: 'Ene 09', uv: 2800, pv: 3700, amt: 2300 },
  { fecha: '2025-06-23', name: 'Ene 10', uv: 3100, pv: 4000, amt: 2400 },
];

interface ExampleProps {
  fechaInicio?: string;
  fechaFin?: string;
}

class Example extends PureComponent<ExampleProps> {
  // Filtrar datos basado en las fechas seleccionadas
  getFilteredData() {
    const { fechaInicio, fechaFin } = this.props;
    
    if (!fechaInicio && !fechaFin) {
      return data;
    }
    
    return data.filter(item => {
      const itemDate = new Date(item.fecha);
      const startDate = fechaInicio ? new Date(fechaInicio) : new Date(-8640000000000000);
      const endDate = fechaFin ? new Date(fechaFin) : new Date(8640000000000000);
      
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  render() {
    const filteredData = this.getFilteredData();
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={filteredData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="pv" 
            stroke="#8884d8" 
            label={<CustomizedLabel />} 
            name="Visitas" 
          />
          <Line 
            type="monotone" 
            dataKey="uv" 
            stroke="#82ca9d" 
            name="Usuarios" 
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

// Componente personalizado para los ticks del eje X
const CustomizedAxisTick: React.FC<any> = (props) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
        {payload.value}
      </text>
    </g>
  );
};

// Componente personalizado para las etiquetas de los puntos de la línea
const CustomizedLabel: React.FC<any> = (props) => {
  const { x, y, stroke, value } = props;
  return (
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
      {value}
    </text>
  );
};

export { Example };