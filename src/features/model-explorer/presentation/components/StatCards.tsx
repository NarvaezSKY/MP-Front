import { Card } from '@/shared/ui/Card';
import type { Metricas, Programa } from '../../domain/entities';

interface Props {
  metricas: Metricas | null;
  programas: Programa[];
  filtrado: boolean;
}

export function StatCards({ metricas, programas, filtrado }: Props) {
  const total = programas.length;
  const centros = new Set(programas.map((p) => p.centro ?? 'Sin clasificar')).size;
  const promedio =
    total > 0
      ? programas.reduce((acc, p) => acc + p.probabilidadExito, 0) / total
      : null;

  const items = [
    {
      label: 'Programas en vista',
      value: total,
      hint: filtrado ? 'Filtrado por centro' : 'Catálogo TITULADA (244)',
    },
    { label: 'Centros', value: centros, hint: 'Regional Cauca' },
    {
      label: 'Prob. promedio',
      value: promedio !== null ? `${(promedio * 100).toFixed(1)}%` : '—',
      hint: filtrado ? 'Sobre selección' : 'Modelo calibrado',
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
