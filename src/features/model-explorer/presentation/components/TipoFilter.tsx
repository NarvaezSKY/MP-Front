import type { Programa } from '../../domain/entities';

interface Props {
  tipos: string[];
  seleccion: string[];
  onToggle: (tipo: string) => void;
  onClear: () => void;
}

export function TipoFilter({ tipos, seleccion, onToggle, onClear }: Props) {
  return (
    <div className="filter-bar">
      <label className="filter-bar__label">Tipo de respuesta</label>
      <div className="filter-bar__chips">
        {tipos.map((t) => {
          const activo = seleccion.includes(t);
          return (
            <button
              key={t}
              type="button"
              className={`tipo-chip${activo ? ' tipo-chip--active' : ''}`}
              onClick={() => onToggle(t)}
              aria-pressed={activo}
            >
              {t}
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

export function uniqueTipos(programas: Programa[]): string[] {
  return Array.from(
    new Set(programas.map((p) => p.tipoRespuesta).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));
}
