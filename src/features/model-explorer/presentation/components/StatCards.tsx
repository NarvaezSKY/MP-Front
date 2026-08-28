import { Card } from '@/shared/ui/Card';
import type { Metricas, Top30Response } from '../../domain/entities';

interface Props {
  metricas: Metricas | null;
  top30: Top30Response | null;
}

export function StatCards({ metricas, top30 }: Props) {
  const items = [
    { label: 'Programas en entregable', value: top30?.total ?? '—', hint: 'Top 30 (10 x centro)' },
    { label: 'Centros', value: top30?.centros ?? '—', hint: 'Regional Cauca' },
    {
      label: 'Prob. promedio (top30)',
      value: metricas ? `${(metricas.probabilidadPromedio * 100).toFixed(1)}%` : '—',
      hint: 'Modelo calibrado',
    },
    {
      label: 'Prob. base (mayoria)',
      value: metricas ? `${(metricas.probabilidadBase * 100).toFixed(1)}%` : '—',
      hint: 'Linea base trivial',
    },
  ];

  return (
    <div className="stat-cards">
      {items.map((it) => (
        <Card key={it.label}>
          <div className="stat-cards__value">{it.value}</div>
          <div className="stat-cards__label">{it.label}</div>
          <div className="stat-cards__hint">{it.hint}</div>
        </Card>
      ))}
    </div>
  );
}
