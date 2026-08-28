import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card } from '@/shared/ui/Card';
import type { Programa } from '../../domain/entities';

interface Props {
  programas: Programa[];
}

const COLORS: Record<string, string> = {
  prediccion_historica: '#39a900',
  estimacion_similitud: '#f99c00',
};

export function FuentePieChart({ programas }: Props) {
  const hist = programas.filter((p) => p.fuente === 'prediccion_historica').length;
  const sim = programas.length - hist;
  const data = [
    { name: 'Con historia', value: hist },
    { name: 'Por similitud', value: sim },
  ];

  return (
    <Card title="Origen de la predicción">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={90}
            label={(e: { name?: string; percent?: number }) =>
              `${e.name}: ${((e.percent ?? 0) * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={COLORS[d.name === 'Con historia' ? 'prediccion_historica' : 'estimacion_similitud']} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
