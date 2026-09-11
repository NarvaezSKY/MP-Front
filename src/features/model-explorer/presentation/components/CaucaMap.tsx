import { Card } from '@/shared/ui/Card';
import { useMapa } from '../hooks/use-mapa';
import { CaucaLeafletMap } from './CaucaLeafletMap';

interface Props {
  onMunicipioClick: (municipio: string) => void;
}

export function CaucaMap({ onMunicipioClick }: Props) {
  const { data, loading, error, reload } = useMapa();

  return (
    <Card title="Mapa de probabilidad de éxito por municipio">
      <p className="chart-note">
        Cada burbuja es un municipio: el tamaño indica el número de fichas históricas y el color, la
        probabilidad promedio de éxito que predice el modelo (verde = mayor, rojo = menor). Haz clic
        en un municipio o en una fila de las tablas para ver el detalle del programa.
      </p>
      {loading && <p className="loader-light">Cargando mapa…</p>}
      {error && (
        <div className="error-box">
          Error: {error}{' '}
          <button className="btn" onClick={reload}>
            Reintentar
          </button>
        </div>
      )}
      {data && (
        <CaucaLeafletMap municipios={data.municipios} onMunicipioClick={onMunicipioClick} />
      )}
    </Card>
  );
}