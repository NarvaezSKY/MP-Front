import { useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { usePredict } from '../hooks/use-predict';
import type { Programa } from '../../domain/entities';

function parseCodigos(text: string): number[] {
  return text
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

export function PredictPanel() {
  const [input, setInput] = useState('228118, 761301, 123456');
  const { resultados, loading, error, predict } = usePredict();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    predict(parseCodigos(input));
  };

  return (
    <Card title="Predecir probabilidad de éxito por código de programa">
      <form className="predict-form" onSubmit={onSubmit}>
        <textarea
          className="predict-form__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="Códigos separados por coma (ej. 228118, 761301)"
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Prediciendo...' : 'Predecir'}
        </button>
      </form>
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
