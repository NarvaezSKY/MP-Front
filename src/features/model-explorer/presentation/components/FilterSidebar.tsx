import { useEffect, useRef, useState } from 'react';
import { FiltroModal } from './FiltroModal';

export type FiltroKind = 'dropdown' | 'modal';

export interface GrupoFiltro {
  label: string;
  kind: FiltroKind;
  accent?: boolean;
  opciones: string[];
  seleccion: string[];
  onToggle: (opcion: string) => void;
  onClear: () => void;
}

interface Props {
  grupos: GrupoFiltro[];
  activos: number;
  onClearAll: () => void;
}

function summary(opciones: string[], seleccion: string[]): string {
  if (seleccion.length === 0) return 'Todas';
  if (seleccion.length === 1) return seleccion[0];
  return `${seleccion.length} de ${opciones.length}`;
}

export function FilterSidebar({ grupos, activos, onClearAll }: Props) {
  const [dropAbierto, setDropAbierto] = useState<string | null>(null);
  const [modalAbierto, setModalAbierto] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!dropAbierto) return;
    const onMousedown = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setDropAbierto(null);
      }
    };
    document.addEventListener('mousedown', onMousedown);
    return () => document.removeEventListener('mousedown', onMousedown);
  }, [dropAbierto]);

  const grupoModal = grupos.find((g) => g.label === modalAbierto) ?? null;

  return (
    <>
      <aside className="filter-sidebar" ref={sidebarRef}>
        <div className="filter-sidebar__head">
          <h3 className="filter-sidebar__title">Filtros</h3>
          {activos > 0 && (
            <button type="button" className="filter-sidebar__clear" onClick={onClearAll}>
              Limpiar todo ({activos})
            </button>
          )}
        </div>
        <div className="filter-sidebar__scroll">
          {grupos.map((g) => (
            <section className="filter-sidebar__group" key={g.label}>
              <div className="filter-sidebar__trigger-row">
                <button
                  type="button"
                  className={`filter-sidebar__trigger${dropAbierto === g.label ? ' filter-sidebar__trigger--open' : ''}`}
                  aria-expanded={g.kind === 'dropdown' ? dropAbierto === g.label : undefined}
                  onClick={() => {
                    if (g.kind === 'modal') {
                      setDropAbierto(null);
                      setModalAbierto(g.label);
                    } else {
                      setModalAbierto(null);
                      setDropAbierto((cur) => (cur === g.label ? null : g.label));
                    }
                  }}
                >
                  <span className="filter-sidebar__trigger-label">{g.label}</span>
                  <span className="filter-sidebar__trigger-value">
                    {summary(g.opciones, g.seleccion)}
                  </span>
                </button>
                {g.seleccion.length > 0 && (
                  <button
                    type="button"
                    className="filter-sidebar__trigger-clear"
                    onClick={g.onClear}
                    aria-label={`Quitar filtro ${g.label}`}
                    title="Quitar filtro"
                  >
                    ×
                  </button>
                )}
              </div>

              {g.kind === 'dropdown' && dropAbierto === g.label && (
                <div className="filter-sidebar__dropdown">
                  <div className="filter-bar__chips">
                    {g.opciones.map((o) => {
                      const activo = g.seleccion.includes(o);
                      const chipClass = g.accent ? 'tipo-chip' : 'centro-chip';
                      const chipActive = g.accent ? 'tipo-chip--active' : 'centro-chip--active';
                      return (
                        <button
                          key={o}
                          type="button"
                          className={`${chipClass}${activo ? ` ${chipActive}` : ''}`}
                          onClick={() => g.onToggle(o)}
                          aria-pressed={activo}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {g.kind === 'modal' && (
                <button
                  type="button"
                  className="filter-sidebar__editar"
                  onClick={() => {
                    setDropAbierto(null);
                    setModalAbierto(g.label);
                  }}
                >
                  {g.seleccion.length > 0 ? 'Editar selección' : 'Elegir opciones'}
                </button>
              )}
            </section>
          ))}
        </div>
      </aside>

      {grupoModal && (
        <FiltroModal
          grupo={grupoModal}
          onClose={() => {
            setModalAbierto(null);
            setDropAbierto(null);
          }}
        />
      )}
    </>
  );
}