import { useMemo, useState } from 'react';
import { ErrorBox, Loader } from '@/shared/ui/Card';
import { useMetricas, useTop30 } from './hooks/use-model-data';
import { StatCards } from './components/StatCards';
import { ProbabilityBarChart } from './components/ProbabilityBarChart';
import { CentroBarChart, RedBarChart } from './components/DistributionCharts';
import { FuentePieChart } from './components/FuentePieChart';
import { Top30Table } from './components/Top30Table';
import { PredictPanel } from './components/PredictPanel';
import { CentroFilter, uniqueCentros } from './components/CentroFilter';
import { ModelInfo } from './components/ModelInfo';

export function ModelExplorerPage() {
  const { data: top30, loading, error, reload } = useTop30();
  const { data: metricas } = useMetricas();
  const [centro, setCentro] = useState<string>('all');

  const programas = top30?.programas ?? [];
  const centros = useMemo(() => uniqueCentros(programas), [programas]);
  const filtrado = centro !== 'all';
  const filtrados = useMemo(
    () => (filtrado ? programas.filter((p) => (p.centro ?? 'Sin clasificar') === centro) : programas),
    [programas, centro, filtrado],
  );

  if (loading) return <Loader label="Cargando datos del modelo..." />;
  if (error) return <ErrorBox message={error} />;
  if (!top30) return <ErrorBox message="No se recibieron datos del modelo" />;

  return (
    <div className="dashboard">
      <div className="topbar">
        <img className="topbar__logo" src="/sena-logo-white.png" alt="SENA" />
        <div className="topbar__titles">
          <h1>Modelo Predictivo SENA</h1>
          <p>Regional Cauca — exploración de la probabilidad de éxito (ejecución vs cancelación) de la oferta formativa</p>
        </div>
        <img className="topbar__logo topbar__logo--cmr" src="/logo-cmr.png" alt="CMR" />
        <button className="btn btn--ghost" onClick={reload}>
          Actualizar
        </button>
      </div>

      <CentroFilter centros={centros} value={centro} onChange={setCentro} />

      <StatCards metricas={metricas} programas={filtrados} filtrado={filtrado} />

      <div className="grid grid--2">
        <CentroBarChart programas={programas} />
        <FuentePieChart programas={filtrados} />
      </div>

      <RedBarChart programas={filtrados} />
      <ProbabilityBarChart programas={filtrados} />
      <Top30Table programas={filtrados} />
      <PredictPanel programas={programas} />
      <footer className="dashboard__footer">
        <ModelInfo />
      </footer>
    </div>
  );
}
