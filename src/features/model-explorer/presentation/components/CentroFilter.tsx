import type { Programa } from '../../domain/entities';

interface Props {
  centros: string[];
  seleccion: string[];
  onToggle: (centro: string) => void;
  onClear: () => void;
}

export function CentroFilter({ centros, seleccion, onToggle, onClear }: Props) {
  return (
    <div className="filter-bar">
      <label className="filter-bar__label">Centro de formación</label>
      <div className="filter-bar__chips">
        {centros.map((c) => {
          const activo = seleccion.includes(c);
          return (
            <button
              key={c}
              type="button"
              className={`centro-chip${activo ? ' centro-chip--active' : ''}`}
              onClick={() => onToggle(c)}
              aria-pressed={activo}
            >
              {c}
            </button>
          );
        })}
      </div>
      {seleccion.length > 0 && (
        <button type="button" className="filter-bar__clear" onClick={onClear}>
          Limpiar ({seleccion.length})
        </button>
      )}
    </div>
  );
}

export function uniqueCentros(programas: Programa[]): string[] {
  return Array.from(
    new Set(programas.map((p) => p.centro ?? 'Sin clasificar').filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));
}
