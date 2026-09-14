import { Card } from '@/shared/ui/Card';
import { useMapa } from '../hooks/use-mapa';
import { CaucaLeafletMap } from './CaucaLeafletMap';

interface Props {
  onMunicipioClick: (municipio: string) => void;
}

export function CaucaMap({ onMunicipioClick }: Props) {
  const { data, loading, error, reload } = useMapa();

  return (
    <Card title="Mapa de probabilidad de demanda por municipio">
      <p className="chart-note">
        Cada burbuja es un municipio: el color indica la probabilidad promedio de demanda que predice
        el modelo (rojo = menor, amarillo = media, verde = mayor). El número de fichas y programas
        se muestra al pasar el cursor. Haz clic en un municipio o en una fila de las tablas para ver
        el detalle del programa.
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