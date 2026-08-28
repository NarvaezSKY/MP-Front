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

const COLOR = '#39a900';

export function ProbabilityBarChart({ programas }: Props) {
  const data = [...programas]
    .sort((a, b) => b.probabilidadExito - a.probabilidadExito)
    .map((p) => ({
      name: p.prfDenominacion ?? `Código ${p.codigoPrograma}`,
      prob: +(p.probabilidadExito * 100).toFixed(1),
      fuente: p.fuente,
    }));

  return (
    <Card title="Probabilidad de éxito por programa (Top 30)">
      <ResponsiveContainer width="100%" height={Math.max(360, data.length * 22)}>
        <BarChart layout="vertical" data={data} margin={{ left: 140, right: 24, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} unit="%" />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fontSize: 11 }}
          />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Bar dataKey="prob" radius={[0, 4, 4, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.fuente === 'estimacion_similitud' ? '#f99c00' : COLOR} />
            ))}
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
      <p className="chart-note">
        Verde = predicción con historia · Amarillo = estimación por similitud
      </p>
    </Card>
  );
}
