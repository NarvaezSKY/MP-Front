import { useEffect } from 'react';
import { CircleMarker, GeoJSON as LeafletGeoJSON, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import caucaMunicipios from '../../infrastructure/geo/cauca-municipios.json';
import type { MunicipioMapa } from '../../domain/entities';
import { probColorCss } from '../lib/map-color';

interface Props {
  municipios: MunicipioMapa[];
  onMunicipioClick?: (municipio: string) => void;
}

const CAUCA_BOUNDS: [[number, number], [number, number]] = [
  [3.4, -78.0],
  [0.9, -76.0],
];

function FitRegion() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(CAUCA_BOUNDS);
  }, [map]);
  return null;
}

function radiusFor(nFichas: number): number {
  if (nFichas <= 0) return 7;
  return 8 + Math.sqrt(nFichas) * 1.3;
}

export function CaucaLeafletMap({ municipios, onMunicipioClick }: Props) {
  return (
    <div className="mapa-leaflet">
      <MapContainer
        center={[2.6, -76.5]}
        zoom={8}
        scrollWheelZoom={true}
        style={{ height: '480px', width: '100%', borderRadius: 8 }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LeafletGeoJSON
          data={caucaMunicipios as never}
          style={() => ({
            color: '#4a6a54',
            weight: 1.2,
            fillColor: '#ffffff',
            fillOpacity: 0.25,
          })}
        />
        {municipios.map((m) => {
          const color = probColorCss(m.probPromedio);
          return (
            <CircleMarker
              key={m.code}
              center={[m.lat, m.lon]}
              radius={radiusFor(m.nFichas)}
              pathOptions={{ color: '#ffffff', weight: 1.5, fillColor: color, fillOpacity: 0.85 }}
              eventHandlers={{
                click: () => onMunicipioClick?.(m.municipio.trim()),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <span>
                  <strong>{m.municipio}</strong>
                  <br />
                  Prob. éxito: {(m.probPromedio * 100).toFixed(1)}%
                  <br />
                  Fichas: {m.nFichas} · Programas: {m.nProgramas}
                  <br />
                  <em>Clic para ver programas del municipio</em>
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}
        <FitRegion />
      </MapContainer>
      <div className="mapa-leyenda">
        <span className="mapa-leyenda__item">
          <span className="mapa-leyenda__dot" style={{ background: probColorCss(1) }} />
          Mayor probabilidad
        </span>
        <span className="mapa-leyenda__item">
          <span className="mapa-leyenda__dot" style={{ background: probColorCss(0.5) }} />
          Media
        </span>
        <span className="mapa-leyenda__item">
          <span className="mapa-leyenda__dot" style={{ background: probColorCss(0) }} />
          Menor probabilidad
        </span>
        <span className="mapa-leyenda__item">
          <span className="mapa-leyenda__bar" style={{ height: 20, width: 20 }} />
          Radio = nº de fichas históricas
        </span>
      </div>
    </div>
  );
}