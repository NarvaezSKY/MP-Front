import { useMemo, useState } from 'react';
import { ErrorBox, Loader } from '@/shared/ui/Card';
import { useMetricas } from './hooks/use-model-data';
import { usePrograms } from './hooks/use-programs';
import { StatCards } from './components/StatCards';
import { ProbabilityBarChart } from './components/ProbabilityBarChart';
import { CentroBarChart, RedBarChart } from './components/DistributionCharts';
import { ProgramTable } from './components/ProgramTable';
import { PredictPanel } from './components/PredictPanel';
import { CentroFilter, uniqueCentros } from './components/CentroFilter';
import { ModelInfo } from './components/ModelInfo';

export function ModelExplorerPage() {
  const { programas, loading, error, reload } = usePrograms();
  const { data: metricas } = useMetricas();
  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const centros = useMemo(() => uniqueCentros(programas), [programas]);
  const filtrado = seleccion.length > 0;
  const filtrados = useMemo(
    () =>
      filtrado
        ? programas.filter((p) =>
            seleccion.includes(p.centro ?? 'Sin clasificar'),
          )
        : programas,
    [programas, seleccion, filtrado],
  );

  const PER_PAGE = 30;
  const totalPages = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageProgramas = filtrados.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE,
  );
  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const toggleCentro = (c: string) =>
    setSeleccion((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  if (loading) return <Loader label="Cargando datos del modelo..." />;
  if (error) return <ErrorBox message={error} />;

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

      <CentroFilter
        centros={centros}
        seleccion={seleccion}
        onToggle={toggleCentro}
        onClear={() => setSeleccion([])}
      />

      <StatCards metricas={metricas} programas={filtrados} filtrado={filtrado} />

      <div className="grid grid--2">
        <CentroBarChart programas={programas} />
        <RedBarChart programas={filtrados} />
      </div>

      <ProbabilityBarChart programas={filtrados} />
      <ProgramTable
        programas={pageProgramas}
        currentPage={safePage}
        totalPages={totalPages}
        total={filtrados.length}
        goToPage={goToPage}
      />
      <PredictPanel programas={programas} />
      <footer className="dashboard__footer">
        <ModelInfo />
      </footer>
    </div>
  );
}
