import { useMemo, useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { usePredict } from '../hooks/use-predict';
import type { Programa } from '../../domain/entities';

interface Props {
  programas: Programa[];
}

export function PredictPanel({ programas }: Props) {
  const opciones = useMemo(
    () =>
      [...programas]
        .filter((p) => p.prfDenominacion)
        .sort((a, b) =>
          (a.prfDenominacion ?? '').localeCompare(b.prfDenominacion ?? ''),
        ),
    [programas],
  );

  const [query, setQuery] = useState('');
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [abierto, setAbierto] = useState(false);
  const { resultados, loading, error, predict } = usePredict();

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
        <div className="combobox">
          <input
            className="combobox__input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setAbierto(true);
            }}
            onFocus={() => setAbierto(true)}
            placeholder="Busca un programa por nombre (ej. Técnico en Cocina)"
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
                    <span className="combobox__codigo">#{p.codigoPrograma}</span>
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
      {resultados.length > 0 && <PredictResultTable resultados={resultados} />}
    </Card>
  );
}

function PredictResultTable({ resultados }: { resultados: Programa[] }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Programa</th>
            <th>Centro</th>
            <th>Prob. éxito</th>
            <th>Origen</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((p) => (
            <tr key={p.codigoPrograma}>
              <td>{p.codigoPrograma}</td>
              <td>{p.prfDenominacion ?? '—'}</td>
              <td>{p.centro ?? '—'}</td>
              <td>
                <span className="badge">{(p.probabilidadExito * 100).toFixed(1)}%</span>
              </td>
              <td>
                <span className={`tag tag--${p.fuente}`}>
                  {p.fuente === 'prediccion_historica' ? 'Historia' : 'Similitud'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
