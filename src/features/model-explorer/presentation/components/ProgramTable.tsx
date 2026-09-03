import { Card } from '@/shared/ui/Card';
import type { Programa } from '../../domain/entities';

export const PROGRAMS_PER_PAGE = 30;

interface Props {
  programas: Programa[];
  currentPage: number;
  totalPages: number;
  total: number;
  goToPage: (page: number) => void;
}

function pageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('…');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('…');
  pages.push(total);
  return pages;
}

export function ProgramTable({ programas, currentPage, totalPages, total, goToPage }: Props) {
  const from = programas.length === 0 ? 0 : (currentPage - 1) * PROGRAMS_PER_PAGE + 1;
  const to = from + programas.length - 1;

  return (
    <Card title="Tabla detallada - programas del catálogo">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Código</th>
              <th>Programa</th>
              <th>Centro</th>
              <th>Tipo respuesta</th>
              <th>Nivel</th>
              <th>Red</th>
              <th>Prob. éxito</th>
            </tr>
          </thead>
          <tbody>
            {programas.map((p, i) => (
              <tr key={`${p.codigoPrograma}-${p.centro}-${p.tipoRespuesta}`}>
                <td>{from + i}</td>
                <td>{p.codigoPrograma}</td>
                <td>{p.prfDenominacion ?? '—'}</td>
                <td>{p.centro ?? '—'}</td>
                <td>{p.tipoRespuesta}</td>
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

      <div className="pagination">
        <button
          className="pagination__btn"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
        >
          ‹
        </button>
        {pageNumbers(currentPage, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`dots-${i}`} className="pagination__dots">
              …
            </span>
          ) : (
            <button
              key={p}
              className={`pagination__btn${p === currentPage ? ' pagination__btn--active' : ''}`}
              onClick={() => goToPage(p)}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          ),
        )}
        <button
          className="pagination__btn"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Página siguiente"
        >
          ›
        </button>
        <span className="pagination__info">
          Mostrando {programas.length ? `${from}–${to}` : '0'} de {total} programas
        </span>
      </div>
    </Card>
  );
}