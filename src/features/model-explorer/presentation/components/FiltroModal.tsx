import { useEffect, useMemo, useState } from 'react';
import type { GrupoFiltro } from './FilterSidebar';

interface Props {
  grupo: GrupoFiltro;
  onClose: () => void;
}

export function FiltroModal({ grupo, onClose }: Props) {
  const [q, setQ] = useState('');

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

  const filtradas = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return grupo.opciones;
    return grupo.opciones.filter((o) => o.toLowerCase().includes(query));
  }, [grupo.opciones, q]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--filtro" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div>
            <p className="modal__kicker">Filtro</p>
            <h3 className="modal__title">{grupo.label}</h3>
            <p className="modal__meta">
              {grupo.seleccion.length} de {grupo.opciones.length} seleccionadas
            </p>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="modal__body">
          <input
            type="search"
            className="filtro-modal__search"
            placeholder="Buscar entre las opciones…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          <div className="filtro-modal__list">
            {filtradas.map((o) => {
              const activo = grupo.seleccion.includes(o);
              return (
                <label
                  key={o}
                  className={`filtro-modal__item${activo ? ' filtro-modal__item--active' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={() => grupo.onToggle(o)}
                  />
                  <span>{o}</span>
                </label>
              );
            })}
            {filtradas.length === 0 && (
              <p className="chart-note">Sin coincidencias para «{q}».</p>
            )}
          </div>
          <div className="filtro-modal__actions">
            <button type="button" className="btn btn--ghost" onClick={grupo.onClear}>
              Limpiar ({grupo.seleccion.length})
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}