import React, { PureComponent, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const COLORS = ['#5ed4d0ff', '#e99c70ff', '#6aa3dcff'];

// Datos de ejemplo con fechas reales
function generarDatosGenero(fechaInicio: string, fechaFin: string) {
  const datos = [];
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
    const masculino = Math.floor(Math.random() * 1000);
    const femenino = Math.floor(Math.random() * 1000);
    const noBinario = Math.floor(Math.random() * 200);

    datos.push({
      fecha: d.toISOString().split('T')[0], // formato YYYY-MM-DD
      masculino,
      femenino,
      noBinario,
    });
  }

  return datos;
}

// Tipo para cada entrada de datos por fecha
interface GeneroPorFecha {
  fecha: string;
  masculino: number;
  femenino: number;
  noBinario: number;
}

// Tipo para la salida agrupada por género
interface GeneroAgrupado {
  genero: 'Masculino' | 'Femenino' | 'No Binario';
  cantidad: number;
}

// Agrupación de datos por género
function agruparPorGenero(data: GeneroPorFecha[]): GeneroAgrupado[] {
  return [
    {
      genero: 'Masculino',
      cantidad: data.reduce((acc, cur) => acc + cur.masculino, 0),
    },
    {
      genero: 'Femenino',
      cantidad: data.reduce((acc, cur) => acc + cur.femenino, 0),
    },
    {
      genero: 'No Binario',
      cantidad: data.reduce((acc, cur) => acc + cur.noBinario, 0),
    },
  ];
}

interface GeneroBarChartProps {
  selectedGeneros: string[];  // Géneros seleccionados
  fechaInicio?: string;
  fechaFin?: string;
}

class GeneroBarChart extends PureComponent<GeneroBarChartProps> {
  // Filtrar datos basado en las fechas seleccionadas
  getFilteredData() {
    const { fechaInicio, fechaFin, selectedGeneros } = this.props;

    const data = generarDatosGenero(fechaInicio ?? Date(), fechaFin ?? Date());

    // Filtrar solo los géneros seleccionados
    const filteredData = data.map(item => {
      const filteredItem: any = { fecha: item.fecha };

      if (selectedGeneros.includes('masculino')) filteredItem.masculino = item.masculino;
      if (selectedGeneros.includes('femenino')) filteredItem.femenino = item.femenino;
      if (selectedGeneros.includes('no-binario')) filteredItem.noBinario = item.noBinario;

      return filteredItem;
    });

    return filteredData;
  }

  render() {
    const filteredData = this.getFilteredData();

    // const [showTotal, setShowTotal] = useState(true);

    return (
      <>
        {/* {!showTotal ? ( */}
        {/* <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
              <XAxis dataKey="fecha" tick={<CustomizedAxisTick />} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                type="monotone"
                dataKey="masculino"
                // stackId="a"
                fill="#8884d8"
                name="Masculino"
              />
              <Bar
                type="monotone"
                dataKey="femenino"
                // stackId="a"
                fill="#82ca9d"
                name="Femenino"
              />
              <Bar
                type="monotone"
                dataKey="noBinario"
                // stackId="a"
                fill="#ffc658"
                name="No Binario"
              />
            </BarChart>
          </ResponsiveContainer> */}
        {/* ) : ( */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={agruparPorGenero(filteredData)}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="genero" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#8884d8" name="Total">
              {agruparPorGenero(filteredData).map((entry: any, index: number) => (
                <>
                  {this.props.selectedGeneros.includes('masculino') && (
                    <Cell key={`cell-${index}`} fill={COLORS[0]} name="Masculino" />
                  )}
                  {this.props.selectedGeneros.includes('femenino') && (
                    <Cell key={`cell-${index}`} fill={COLORS[1]} name="Femenino" />
                  )}
                  {this.props.selectedGeneros.includes('no-binario') && (
                    <Cell key={`cell-${index}`} fill={COLORS[2]} name="No Binario" />
                  )}
                  {/* <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> */}
                </>
              ))}
            </Bar>
            {/* {this.props.selectedGeneros.includes('masculino') && (
            <Bar dataKey="cantidad" fill={COLORS[0]} name="Masculino" />
          )}
          {this.props.selectedGeneros.includes('femenino') && (
            <Bar dataKey="cantidad" fill={COLORS[1]} name="Femenino" />
          )}
          {this.props.selectedGeneros.includes('no-binario') && (
            <Bar dataKey="cantidad" fill={COLORS[2]} name="No Binario" />
          )} */}
          </BarChart>
        </ResponsiveContainer>
        {/* )} */}
      </>
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

export { GeneroBarChart };