import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/shared/ui/Card';
import type { Programa } from '../../domain/entities';

interface Props {
  programas: Programa[];
}

const PALETTE = ['#39a900', '#003876', '#f99c00', '#2f7d00', '#6db36b', '#7fb3ff'];

function aggregate(programas: Programa[], key: 'centro' | 'redConocimiento') {
  const map = new Map<string, { sum: number; n: number }>();
  for (const p of programas) {
    const k = (p[key] ?? 'Sin clasificar').toString();
    const cur = map.get(k) ?? { sum: 0, n: 0 };
    cur.sum += p.probabilidadExito;
    cur.n += 1;
    map.set(k, cur);
  }
  return Array.from(map.entries())
    .map(([name, v]) => ({ name, avg: +( (v.sum / v.n) * 100).toFixed(1), n: v.n }))
    .sort((a, b) => b.avg - a.avg);
}

export function CentroBarChart({ programas }: Props) {
  const data = aggregate(programas, 'centro');
  return (
    <Card title="Probabilidad promedio por Centro">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: 24, right: 32, top: 16, bottom: 56 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            angle={-25}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis domain={[0, 100]} unit="%" />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
            <LabelList
              dataKey="avg"
              position="top"
              formatter={(v: number) => `${v}%`}
              fontSize={10}
              fill="#16321f"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function RedBarChart({ programas }: Props) {
  const data = aggregate(programas, 'redConocimiento').slice(0, 10);
  return (
    <Card title="Probabilidad promedio por Red de Conocimiento (Top 10)">
      <ResponsiveContainer width="100%" height={Math.max(340, data.length * 34)}>
        <BarChart
          data={data}
          margin={{ left: 8, right: 40, top: 8, bottom: 16 }}
          layout="vertical"
          barCategoryGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} unit="%" />
          <YAxis
            type="category"
            dataKey="name"
            width={190}
            tick={{ fontSize: 10 }}
            interval={0}
          />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Bar dataKey="avg" radius={[0, 4, 4, 0]} fill="#39a900">
            <LabelList
              dataKey="avg"
              position="right"
              formatter={(v: number) => `${v}%`}
              fontSize={10}
              fill="#16321f"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
