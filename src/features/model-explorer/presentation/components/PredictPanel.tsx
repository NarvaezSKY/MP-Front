import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { usePredict } from '../hooks/use-predict';
import { probColor } from '../lib/probability-color';
import type { Programa } from '../../domain/entities';

interface Props {
  programas: Programa[];
  onVerPrograma: (codigo: number) => void;
}

function tipoSection(tipo: string): string {
  if (tipo.toLowerCase().includes('abiert')) return 'abierta';
  if (tipo.toLowerCase().includes('cerrad')) return 'cerrada';
  return tipo.toLowerCase();
}

export function PredictPanel({ programas, onVerPrograma }: Props) {
  const opciones = useMemo(() => {
    const seen = new Set<number>();
    return [...programas]
      .filter((p) => p.prfDenominacion)
      .filter((p) => {
        if (seen.has(p.codigoPrograma)) return false;
        seen.add(p.codigoPrograma);
        return true;
      })
      .sort((a, b) =>
        (a.prfDenominacion ?? '').localeCompare(b.prfDenominacion ?? ''),
      );
  }, [programas]);

  const centrosPorCodigo = useMemo(() => {
    const m = new Map<number, number>();
    for (const p of programas) m.set(p.codigoPrograma, (m.get(p.codigoPrograma) ?? 0) + 1);
    return m;
  }, [programas]);

  const [query, setQuery] = useState('');
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [abierto, setAbierto] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const { resultados, loading, error, predict } = usePredict();

  useEffect(() => {
    if (!abierto) return;

    const onClickOutside = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [abierto]);

  const sugerencias = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opciones
      .filter((p) => !seleccionados.includes(p.codigoPrograma))
      .filter((p) => (q ? (p.prfDenominacion ?? '').toLowerCase().includes(q) : true))
      .slice(0, 12);
  }, [opciones, query, seleccionados]);

  const agregar = (codigo: number) => {
    setSeleccionados((prev) => [...prev, codigo]);
    setQuery('');
    setAbierto(false);
  };

  const quitar = (codigo: number) => {
    setSeleccionados((prev) => prev.filter((c) => c !== codigo));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seleccionados.length === 0) return;
    predict(seleccionados);
  };

  const nombre = (codigo: number) =>
    opciones.find((p) => p.codigoPrograma === codigo)?.prfDenominacion ?? `Código ${codigo}`;

  return (
    <Card title="Predecir probabilidad de éxito por programa">
      <form className="predict-form" onSubmit={onSubmit}>
        <div className="combobox" ref={comboboxRef}>
          <input
            className="combobox__input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setAbierto(true);
            }}
            onFocus={() => setAbierto(true)}
            placeholder="Busca un programa por nombre (ejemplo: Técnico en Cocina)"
            aria-label="Buscar programa"
          />
          {abierto && sugerencias.length > 0 && (
            <ul className="combobox__list">
              {sugerencias.map((p) => (
                <li key={p.codigoPrograma}>
                  <button
                    type="button"
                    className="combobox__option"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      agregar(p.codigoPrograma);
                    }}
                  >
                    <span>{p.prfDenominacion}</span>
                    <span className="combobox__codigo">
                      Código {p.codigoPrograma} · {centrosPorCodigo.get(p.codigoPrograma) ?? 1}{' '}
                      {centrosPorCodigo.get(p.codigoPrograma) === 1 ? 'centro' : 'centros'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="btn" type="submit" disabled={loading || seleccionados.length === 0}>
          {loading ? 'Prediciendo...' : 'Predecir'}
        </button>
      </form>

      {seleccionados.length > 0 && (
        <div className="combobox__chips">
          {seleccionados.map((c) => (
            <span key={c} className="chip">
              {nombre(c)}
              <button type="button" className="chip__x" onClick={() => quitar(c)} aria-label="Quitar">
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <div className="error-box">Error: {error}</div>}
      {resultados.length > 0 && (
        <PredictResultTable resultados={resultados} onVerPrograma={onVerPrograma} />
      )}
    </Card>
  );
}

function PredictResultTable({
  resultados,
  onVerPrograma,
}: {
  resultados: Programa[];
  onVerPrograma: (codigo: number) => void;
}) {
  const mejorPorTipoCodigo = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of resultados) {
      const key = `${tipoSection(p.tipoRespuesta)}-${p.codigoPrograma}`;
      const actual = m.get(key);
      if (actual === undefined || p.probabilidadExito > actual) {
        m.set(key, p.probabilidadExito);
      }
    }
    return m;
  }, [resultados]);

  const grupos = useMemo(() => {
    const order: Record<string, number> = {
      abierta: 0,
      cerrada: 1,
    };
    const byTipo = new Map<string, Programa[]>();
    for (const p of resultados) {
      const sec = tipoSection(p.tipoRespuesta);
      const arr = byTipo.get(sec) ?? [];
      arr.push(p);
      byTipo.set(sec, arr);
    }
    const keys = Array.from(byTipo.keys()).sort(
      (a, b) => (order[a] ?? 9) - (order[b] ?? 9) || a.localeCompare(b),
    );
    return keys.map((k) => ({
      tipo: k,
      rows: (byTipo.get(k) ?? []).sort((a, b) => b.probabilidadExito - a.probabilidadExito),
    }));
  }, [resultados]);

  if (grupos.length === 0) return null;

  return (
    <div>
      {grupos.map((grupo) => (
        <div key={grupo.tipo} className="predict-grupo">
          <h4 className="predict-grupo__titulo">
            Oferta <strong>{grupo.tipo}</strong>
          </h4>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Programa</th>
                  <th>Centro</th>
                  <th>Probabilidad de éxito</th>
                </tr>
              </thead>
              <tbody>
                {grupo.rows.map((p) => {
                  const key = `${tipoSection(p.tipoRespuesta)}-${p.codigoPrograma}`;
                  const mejor = mejorPorTipoCodigo.get(key) === p.probabilidadExito;
                  return (
                    <tr
                      key={`${p.codigoPrograma}-${p.centro}-${p.tipoRespuesta}`}
                      className="row-clickable"
                      onClick={() => onVerPrograma(p.codigoPrograma)}
                    >
                      <td>{p.codigoPrograma}</td>
                      <td>{p.prfDenominacion ?? '—'}</td>
                      <td>
                        {p.centro ?? '—'}
                        {mejor && <span className="tag tag--mejor">mejor proyección</span>}
                      </td>
                      <td>
                        <span className={`badge badge--${probColor(p.probabilidadExito)}`}>
                          {(p.probabilidadExito * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <p className="chart-note">
        Para cada oferta (abierta y cerrada) se muestran de mayor a menor probabilidad calculada por
        el modelo. La etiqueta "mejor proyección" marca la sede con mayor probabilidad dentro de cada
        tipo de oferta.
      </p>
    </div>
  );
}