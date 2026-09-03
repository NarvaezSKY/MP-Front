import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/shared/ui/Card';
import type { FichaOferta } from '../../domain/entities';

const PER_PAGE = 10;

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

interface Props {
  data: {
    archivo: string;
    totalFichas: number;
    publicadas: number;
    canceladas: number;
    conProbabilidad: number;
    ocupacionPromedio: number;
    fichas: FichaOferta[];
  } | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

type SortKey = 'ocupacion' | 'probabilidad' | 'nombre';

function ocupacionColor(o: number): string {
  if (o <= 0) return 'critico';
  if (o < 0.2) return 'bajo';
  if (o >= 0.8) return 'alto';
  return 'medio';
}

function pct(x: number | null): string {
  return x === null ? '—' : `${Math.round(x * 100)}%`;
}

function probColor(p: number | null): string {
  if (p === null) return 'sin-dato';
  if (p < 0.55) return 'bajo';
  if (p < 0.7) return 'medio';
  return 'alto';
}

export function UltimaOfertaPanel({ data, loading, error, reload }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('ocupacion');
  const [page, setPage] = useState(1);

  const publicadas = useMemo(
    () => (data?.fichas ?? []).filter((f) => f.estado === 'Publicada'),
    [data],
  );
  const canceladas = useMemo(
    () => (data?.fichas ?? []).filter((f) => f.estado === 'Cancelada'),
    [data],
  );

  const ordenadas = useMemo(() => {
    const arr = [...publicadas];
    switch (sortKey) {
      case 'ocupacion':
        arr.sort((a, b) => a.ocupacion - b.ocupacion);
        break;
      case 'probabilidad':
        arr.sort(
          (a, b) => (a.probabilidadExito ?? -1) - (b.probabilidadExito ?? -1),
        );
        break;
      case 'nombre':
        arr.sort((a, b) => a.denominacion.localeCompare(b.denominacion));
        break;
    }
    return arr;
  }, [publicadas, sortKey]);

  const enRiesgo = useMemo(
    () =>
      publicadas.filter(
        (f) =>
          f.probabilidadExito !== null &&
          f.probabilidadExito < 0.55 &&
          f.ocupacion < 0.2,
      ).length,
    [publicadas],
  );

  const totalPages = Math.max(1, Math.ceil(ordenadas.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageRows = ordenadas.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const goToPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  useEffect(() => {
    setPage(1);
  }, [sortKey, publicadas.length]);

  if (loading) return <Card title="Predicción de la última oferta"><p className="loader-light">Cargando inscripciones…</p></Card>;
  if (error) return <Card title="Predicción de la última oferta"><div className="error-box">{error} <button className="btn" onClick={reload}>Reintentar</button></div></Card>;
  if (!data) return null;

  return (
    <Card title="Predicción de la última oferta (inscripciones)">
      <div className="ultima-oferta__meta">
        <span>Archivo: <strong>{data.archivo}</strong></span>
        <span>Fichas: <strong>{data.totalFichas}</strong> (publ. {data.publicadas} / canc. {data.canceladas})</span>
        <span>Con prob. del modelo: <strong>{data.conProbabilidad}</strong></span>
        <span>Ocupación promedio: <strong>{Math.round(data.ocupacionPromedio * 100)}%</strong></span>
        <span className="ultima-oferta__riesgo">En riesgo (prob &lt;55% y ocup &lt;20%): <strong>{enRiesgo}</strong></span>
      </div>

      <p className="chart-note">
        Probabilidad calculada para oferta <strong>ABIERTA</strong> (la última oferta es de demanda libre):
        el modelo usa únicamente el historial de ofertas abiertas de cada programa.
      </p>

      {canceladas.length > 0 && (
        <p className="chart-note">
          {canceladas.length} ficha(s) ya fueron canceladas (0 inscritos). Señal de que la baja ocupación anticipa la cancelación.
        </p>
      )}

      <div className="ultima-oferta__toolbar">
        <label className="ultima-oferta__label" htmlFor="uo-sort">Ordenar por</label>
        <select
          id="uo-sort"
          className="filter-bar__select"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="ocupacion">Ocupación (menor primero)</option>
          <option value="probabilidad">Prob. modelo (menor primero)</option>
          <option value="nombre">Programa (A-Z)</option>
        </select>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Programa</th>
              <th>Centro</th>
              <th>Municipio</th>
              <th>Cupo</th>
              <th>Inscritos</th>
              <th>Ocupación</th>
              <th>Prob. modelo</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((f) => (
              <tr key={f.codFicha}>
                <td>{f.denominacion}</td>
                <td>{f.centro}</td>
                <td>{f.municipio}</td>
                <td>{f.cupo}</td>
                <td>{f.inscritos}</td>
                <td>
                  <div className="ocup">
                    <span className={`ocup__bar`}>
                      <span
                        className={`ocup__fill ocup__fill--${ocupacionColor(f.ocupacion)}`}
                        style={{ width: `${Math.min(100, f.ocupacion * 100)}%` }}
                      />
                    </span>
                    <span className="ocup__val">{Math.round(f.ocupacion * 100)}%</span>
                  </div>
                </td>
                <td>
                  <span className={`badge badge--${probColor(f.probabilidadExito)}`}>
                    {pct(f.probabilidadExito)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="pagination__btn"
          onClick={() => goToPage(safePage - 1)}
          disabled={safePage <= 1}
          aria-label="Página anterior"
        >
          ‹
        </button>
        {pageNumbers(safePage, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`dots-${i}`} className="pagination__dots">
              …
            </span>
          ) : (
            <button
              key={p}
              className={`pagination__btn${p === safePage ? ' pagination__btn--active' : ''}`}
              onClick={() => goToPage(p)}
              aria-current={p === safePage ? 'page' : undefined}
            >
              {p}
            </button>
          ),
        )}
        <button
          className="pagination__btn"
          onClick={() => goToPage(safePage + 1)}
          disabled={safePage >= totalPages}
          aria-label="Página siguiente"
        >
          ›
        </button>
        <span className="pagination__info">
          Mostrando {pageRows.length ? `${(safePage - 1) * PER_PAGE + 1}–${(safePage - 1) * PER_PAGE + pageRows.length}` : '0'} de{' '}
          {ordenadas.length} programas publicados
        </span>
      </div>

      <p className="chart-note">
        Verde esquema: el contraste entre <strong>probabilidad del modelo</strong> y{' '}
        <strong>ocupación actual</strong> anticipa el resultado: prob. baja + ocupación baja ⇒ alta
        probabilidad de cancelación.
      </p>
    </Card>
  );
}
