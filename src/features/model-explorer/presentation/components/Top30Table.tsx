import { Card } from '@/shared/ui/Card';
import type { Programa } from '../../domain/entities';

interface Props {
  programas: Programa[];
}

export function Top30Table({ programas }: Props) {
  return (
    <Card title="Tabla detallada - Top 30 programas">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Código</th>
              <th>Programa</th>
              <th>Centro</th>
              <th>Nivel</th>
              <th>Red</th>
              <th>Prob. éxito</th>
            </tr>
          </thead>
          <tbody>
            {programas.map((p, i) => (
              <tr key={p.codigoPrograma}>
                <td>{i + 1}</td>
                <td>{p.codigoPrograma}</td>
                <td>{p.prfDenominacion ?? '—'}</td>
                <td>{p.centro ?? '—'}</td>
                <td>{p.nivel ?? '—'}</td>
                <td>{p.redConocimiento ?? '—'}</td>
                <td>
                <span className="badge">{(p.probabilidadExito * 100).toFixed(1)}%</span>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
