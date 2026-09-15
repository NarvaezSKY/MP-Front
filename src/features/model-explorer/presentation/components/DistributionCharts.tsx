import {
  Bar,
  BarChart,
  CartesianGrid,
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

function aggregate(programas: Programa[]) {
  const map = new Map<string, { sum: number; n: number }>();
  for (const p of programas) {
    const k = (p.redConocimiento ?? 'Sin clasificar').toString();
    const cur = map.get(k) ?? { sum: 0, n: 0 };
    cur.sum += p.probabilidadExito;
    cur.n += 1;
    map.set(k, cur);
  }
  return Array.from(map.entries())
    .map(([name, v]) => ({ name, prob: +((v.sum / v.n) * 100).toFixed(1), n: v.n }))
    .sort((a, b) => b.prob - a.prob);
}

const RED_ROW_H = 34;
const RED_SCROLL_MAX_H = 380;

export function RedBarChart({ programas }: Props) {
  const data = aggregate(programas).slice(0, 10);
  return (
    <Card title="Probabilidad promedio por Red de Conocimiento (Top 10)">
      <div className="chart-scroll" style={{ maxHeight: RED_SCROLL_MAX_H }}>
        <ResponsiveContainer width="100%" height={Math.max(RED_SCROLL_MAX_H, data.length * RED_ROW_H)}>
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
              width={230}
              tick={{ fontSize: 10 }}
              interval={0}
            />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Bar name="Probabilidad promedio" dataKey="prob" radius={[0, 4, 4, 0]} barSize={20} fill="#39a900">
              <LabelList
                dataKey="prob"
                position="right"
                formatter={(v: number) => `${v}%`}
                fontSize={10}
                fill="#16321f"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
