import type { Programa } from '../../domain/entities';

interface Props {
  centros: string[];
  value: string;
  onChange: (centro: string) => void;
}

export function CentroFilter({ centros, value, onChange }: Props) {
  return (
    <div className="filter-bar">
      <label className="filter-bar__label" htmlFor="centro-filter">
        Centro de formación
      </label>
      <select
        id="centro-filter"
        className="filter-bar__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">Todos los centros</option>
        {centros.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {value !== 'all' && (
        <button
          type="button"
          className="filter-bar__clear"
          onClick={() => onChange('all')}
        >
          Limpiar
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
