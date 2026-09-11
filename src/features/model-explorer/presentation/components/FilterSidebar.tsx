interface GrupoFiltro {
  label: string;
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

function FiltroGrupo({ grupo }: { grupo: GrupoFiltro }) {
  const chipClass = grupo.accent ? 'tipo-chip' : 'centro-chip';
  const chipClassActive = grupo.accent ? 'tipo-chip--active' : 'centro-chip--active';
  return (
    <section className="filter-sidebar__group">
      <label className="filter-sidebar__label">{grupo.label}</label>
      <div className="filter-bar__chips">
        {grupo.opciones.map((o) => {
          const activo = grupo.seleccion.includes(o);
          return (
            <button
              key={o}
              type="button"
              className={`${chipClass}${activo ? ` ${chipClassActive}` : ''}`}
              onClick={() => grupo.onToggle(o)}
              aria-pressed={activo}
            >
              {o}
            </button>
          );
        })}
      </div>
      {grupo.seleccion.length > 0 && (
        <button type="button" className="filter-sidebar__clear" onClick={grupo.onClear}>
          Limpiar ({grupo.seleccion.length})
        </button>
      )}
    </section>
  );
}

export function FilterSidebar({ grupos, activos, onClearAll }: Props) {
  return (
    <aside className="filter-sidebar">
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
          <FiltroGrupo key={g.label} grupo={g} />
        ))}
      </div>
    </aside>
  );
}