import { useEffect, useState } from 'react';
import { probColor } from '../lib/probability-color';
import { CaucaLeafletMap } from './CaucaLeafletMap';
import { useMunicipioProgramas } from '../hooks/use-municipio-programas';
import type { ProgramaDetalle } from '../../domain/entities';

interface Props {
  detalle: ProgramaDetalle;
  onClose: () => void;
}

function numPCT(x: number | null): string {
  return x === null ? '—' : `${Math.round(x * 100)}%`;
}

export function ProgramaModal({ detalle, onClose }: Props) {
  const [municipioSel, setMunicipioSel] = useState<string>('');
  useEffect(() => setMunicipioSel(''), [detalle.codigo]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const mejor = detalle.mejorJornada;
  const municipiosOfertados = detalle.porMunicipio;
  const sel = municipiosOfertados.find((m) => m.municipio === municipioSel) ?? null;
  const probMunicipioSel =
    sel && sel.probModelo !== null
      ? sel.probModelo
      : sel && sel.probPromedio !== null
        ? sel.probPromedio
        : null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--programa" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div>
            <p className="modal__kicker">Programa {detalle.codigo}</p>
            <h3 className="modal__title">{detalle.denominacion}</h3>
            <p className="modal__meta">
              {[detalle.nivel, detalle.redConocimiento].filter(Boolean).join(' · ') || '—'}
            </p>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="modal__body">
          <div className="modal__grid modal__grid--stats">
            <div className="stat-cell stat-cell--accent">
              <span className="stat-cell__label">Probabilidad en general</span>
              <span className="stat-cell__value stat-cell__value--big">
                {detalle.probabilidadGeneral === null ? (
                  '—'
                ) : (
                  <span className={`badge badge--${probColor(detalle.probabilidadGeneral)}`}>
                    {(detalle.probabilidadGeneral * 100).toFixed(1)}%
                  </span>
                )}
              </span>
              <span className="stat-cell__hint">
                Modelo (todas las ofertas ABIERTA)
              </span>
            </div>
            <div className="stat-cell">
              <span className="stat-cell__label">Fichas históricas</span>
              <span className="stat-cell__value">{detalle.nFichasTotal}</span>
            </div>
            <div className="stat-cell">
              <span className="stat-cell__label">Centros</span>
              <span className="stat-cell__value">{detalle.filas.length}</span>
            </div>
            <div className="stat-cell">
              <span className="stat-cell__label">Municipios</span>
              <span className="stat-cell__value">{detalle.porMunicipio.length}</span>
            </div>
            <div className="stat-cell">
              <span className="stat-cell__label">Mejor jornada</span>
              <span className="stat-cell__value">
                {mejor ? (
                  <>
                    {mejor.jornada}{' '}
                    <span className={`badge badge--${probColor(mejor.tasaExito)}`}>
                      {numPCT(mejor.tasaExito)}
                    </span>
                  </>
                ) : (
                  '—'
                )}
              </span>
            </div>
          </div>

          {municipiosOfertados.length > 0 && (
            <div className="modal__section">
              <h4>Probabilidad por municipio de oferta</h4>

              <label className="modal__filtro">
                <span className="modal__filtro-label">Filtrar por municipio</span>
                <select
                  className="filter-bar__select"
                  value={municipioSel}
                  onChange={(e) => setMunicipioSel(e.target.value)}
                >
                  <option value="">Todos los municipios (general)</option>
                  {municipiosOfertados.map((m) => (
                    <option key={m.municipio} value={m.municipio}>
                      {m.municipio}
                    </option>
                  ))}
                </select>
              </label>

              {sel && (
                <div className="modal__sel-info">
                  <span className="modal__sel-info-label">
                    Probabilidad del programa en {sel.municipio}:
                  </span>
                  <span
                    className={`badge badge--${probColor(probMunicipioSel ?? 0)}`}
                  >
                    {numPCT(probMunicipioSel)}
                  </span>
                  <span className="modal__sel-info-detail">
                    {sel.nFichas} fichas · tasa de demanda {numPCT(sel.tasaExito)}
                  </span>
                </div>
              )}

              <div className="table-scroll">
                <table className="data-table data-table--compact">
                  <thead>
                    <tr>
                      <th>Municipio</th>
                      <th>Fichas</th>
                      <th>Tasa de demanda</th>
                      <th>Probabilidad del modelo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(municipioSel ? [sel!] : municipiosOfertados).map((m) => (
                      <tr
                        key={m.municipio}
                        className={
                          m.municipio === municipioSel ? 'row-selected row-clickable' : 'row-clickable'
                        }
                        onClick={() => setMunicipioSel(m.municipio)}
                      >
                        <td>{m.municipio}</td>
                        <td>{m.nFichas}</td>
                        <td>
                          <span className={`badge badge--${probColor(m.tasaExito)}`}>
                            {numPCT(m.tasaExito)}
                          </span>
                        </td>
                        <td>
                          {m.probModelo !== null ? (
                            <span className={`badge badge--${probColor(m.probModelo)}`}>
                              {(m.probModelo * 100).toFixed(1)}%
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {municipiosOfertados.length > 0 && (
                <div className="modal__mapa">
                  <CaucaLeafletMap
                    municipios={
                      municipioSel && sel
                        ? [
                            {
                              municipio: sel.municipio,
                              lat: sel.lat,
                              lon: sel.lon,
                              code: sel.code,
                              nFichas: sel.nFichas,
                              nProgramas: 1,
                              probPromedio: probMunicipioSel ?? 0,
                              tasaExito: sel.tasaExito,
                            },
                          ]
                        : municipiosOfertados.map((m) => ({
                            municipio: m.municipio,
                            lat: m.lat,
                            lon: m.lon,
                            code: m.code,
                            nFichas: m.nFichas,
                            nProgramas: 1,
                            probPromedio: (m.probModelo ?? m.probPromedio) ?? m.tasaExito ?? 0,
                            tasaExito: m.tasaExito,
                          }))
                    }
                    onMunicipioClick={undefined}
                  />
                </div>
              )}
            </div>
          )}

          {detalle.filas.length > 0 && (
            <div className="modal__section">
              <h4>Probabilidad por centro</h4>
              <div className="table-scroll">
                <table className="data-table data-table--compact">
                  <thead>
                    <tr>
                      <th>Centro</th>
                      <th>Tipo respuesta</th>
                      <th>Jornada</th>
                      <th>Probabilidad de demanda</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalle.filas.map((f, i) => (
                      <tr key={`${f.centro}-${f.tipoRespuesta}-${i}`}>
                        <td>{f.centro}</td>
                        <td>{f.tipoRespuesta}</td>
                        <td>{f.jornada}</td>
                        <td>
                          <span className={`badge badge--${probColor(f.probabilidadExito)}`}>
                            {(f.probabilidadExito * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="modal__grid modal__grid--2col">
            {detalle.porJornada.length > 0 && (
              <div className="modal__section">
                <h4>Desempeño por jornada</h4>
                <table className="data-table data-table--compact">
                  <thead>
                    <tr>
                      <th>Jornada</th>
                      <th>Fichas</th>
                      <th>Tasa de demanda</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalle.porJornada.map((j) => (
                      <tr key={j.jornada}>
                        <td>{j.jornada}</td>
                        <td>{j.nFichas}</td>
                        <td>
                          <span className={`badge badge--${probColor(j.tasaExito)}`}>
                            {numPCT(j.tasaExito)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {detalle.porAnio.length > 0 && (
              <div className="modal__section">
                <h4>Historial por año</h4>
                <table className="data-table data-table--compact">
                  <thead>
                    <tr>
                      <th>Año</th>
                      <th>Fichas</th>
                      <th>Ejecutadas</th>
                      <th>Canceladas</th>
                      <th>Tasa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalle.porAnio.map((a) => (
                      <tr key={a.anio}>
                        <td>{a.anio}</td>
                        <td>{a.nFichas}</td>
                        <td>{a.ejecutadas}</td>
                        <td>{a.canceladas}</td>
                        <td>
                          <span className={`badge badge--${probColor(a.tasaExito)}`}>
                            {numPCT(a.tasaExito)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MunicipioModalProps {
  municipio: string;
  onClose: () => void;
  onVerPrograma: (codigo: number) => void;
}

export function MunicipioModal({ municipio, onClose, onVerPrograma }: MunicipioModalProps) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const { data: rows, loading, error } = useMunicipioProgramas(municipio);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--municipio" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div>
            <p className="modal__kicker">Municipio</p>
            <h3 className="modal__title">{municipio}</h3>
            <p className="modal__meta">Programas con fichas y probabilidad del modelo en este municipio</p>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="modal__body">
          {loading && <p className="loader-light">Cargando programas del municipio…</p>}
          {!loading && error && (
            <div className="error-box">
              Error: {error}{' '}
              <button className="btn" onClick={onClose}>
                Cerrar
              </button>
            </div>
          )}
          {!loading && !error && rows !== null && rows.length === 0 && (
            <p className="chart-note">
              Sin programas con fichas utilizables por el modelo en este municipio.
            </p>
          )}
          {!loading && !error && rows !== null && rows.length > 0 && (
            <div className="table-scroll">
              <table className="data-table data-table--compact">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Programa</th>
                    <th>Centro</th>
                    <th>Tipo</th>
                    <th>Jornada</th>
                    <th>Fichas</th>
                    <th>Probabilidad</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr
                      key={`${p.codigoPrograma}-${p.centro}-${p.tipoRespuesta}`}
                      className="row-clickable"
                      onClick={() => onVerPrograma(p.codigoPrograma)}
                    >
                      <td>{p.codigoPrograma}</td>
                      <td>{p.prfDenominacion ?? '—'}</td>
                      <td>{p.centro ?? '—'}</td>
                      <td>{p.tipoRespuesta}</td>
                      <td>{p.jornada ?? '—'}</td>
                      <td>{p.nFichas}</td>
                      <td>
                        <span className={`badge badge--${probColor(p.probModelo)}`}>
                          {(p.probModelo * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}