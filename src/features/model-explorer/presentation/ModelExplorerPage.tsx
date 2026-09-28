import { useMemo, useState } from 'react';
import { ErrorBox, Loader, Section } from '@/shared/ui/Card';
import { usePrograms } from './hooks/use-programs';
import { useUltimaOferta } from './hooks/use-ultima-oferta';
import { useProgramaDetalle } from './hooks/use-programa-detalle';
import { StatCards } from './components/StatCards';
import { ProbabilityBarChart } from './components/ProbabilityBarChart';
import { RedBarChart } from './components/DistributionCharts';
import { ProgramTable } from './components/ProgramTable';
import { PredictPanel } from './components/PredictPanel';
import { UltimaOfertaPanel } from './components/UltimaOfertaPanel';
import { CaucaMap } from './components/CaucaMap';
import { ProgramaModal, MunicipioModal } from './components/ProgramaModal';
import { FilterSidebar } from './components/FilterSidebar';
import { ModelInfo } from './components/ModelInfo';

type ModalState =
  | { tipo: 'programa'; codigo: number }
  | { tipo: 'municipio'; municipio: string };

export function ModelExplorerPage() {
  const [seleccionCentros, setSeleccionCentros] = useState<string[]>([]);
  const [seleccionTipos, setSeleccionTipos] = useState<string[]>(['ABIERTA']);
  const [seleccionNiveles, setSeleccionNiveles] = useState<string[]>([]);
  const [seleccionRedes, setSeleccionRedes] = useState<string[]>([]);
  const [seleccionMunicipios, setSeleccionMunicipios] = useState<string[]>([]);
  const [seleccionModalidad, setSeleccionModalidad] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<ModalState | null>(null);

  // Los filtros se aplican en el backend: solo pasan los programas que tienen
  // fichas historicas reales (utilizables por el modelo) en los valores
  // seleccionados. Las opciones del sidebar vienen del catalogo del backend,
  // para que no se colapsen al filtrar.
  const filtros = useMemo(
    () => ({
      centro: seleccionCentros.length ? seleccionCentros : undefined,
      tipo: seleccionTipos.length ? seleccionTipos : undefined,
      nivel: seleccionNiveles.length ? seleccionNiveles : undefined,
      red: seleccionRedes.length ? seleccionRedes : undefined,
      municipio: seleccionMunicipios.length ? seleccionMunicipios : undefined,
      modalidad: seleccionModalidad.length ? seleccionModalidad : undefined,
    }),
    [
      seleccionCentros,
      seleccionTipos,
      seleccionNiveles,
      seleccionRedes,
      seleccionMunicipios,
      seleccionModalidad,
    ],
  );

  const { programas, filtros: catalogo, loading, refreshing, error, reload } =
    usePrograms(filtros);
  const ultimaOferta = useUltimaOferta();
  const detalle = useProgramaDetalle();

  const filtrado =
    seleccionCentros.length > 0 ||
    seleccionTipos.length > 0 ||
    seleccionNiveles.length > 0 ||
    seleccionRedes.length > 0 ||
    seleccionMunicipios.length > 0 ||
    seleccionModalidad.length > 0;

  const PER_PAGE = 30;
  const totalPages = Math.max(1, Math.ceil(programas.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageProgramas = programas.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE,
  );
  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const toggleCentro = (c: string) => {
    setCurrentPage(1);
    setSeleccionCentros((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };
  const toggleTipo = (t: string) => {
    setCurrentPage(1);
    setSeleccionTipos((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };
  const toggleNivel = (n: string) => {
    setCurrentPage(1);
    setSeleccionNiveles((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n],
    );
  };
  const toggleRed = (r: string) => {
    setCurrentPage(1);
    setSeleccionRedes((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
    );
  };
  const toggleMunicipio = (m: string) => {
    setCurrentPage(1);
    setSeleccionMunicipios((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  };
  const toggleModalidad = (m: string) => {
    setCurrentPage(1);
    setSeleccionModalidad((prev) => (prev.includes(m) ? [] : [m]));
  };

  const limpiarTodos = () => {
    setCurrentPage(1);
    setSeleccionCentros([]);
    setSeleccionTipos([]);
    setSeleccionNiveles([]);
    setSeleccionRedes([]);
    setSeleccionMunicipios([]);
    setSeleccionModalidad([]);
  };

  const activos =
    seleccionCentros.length +
    seleccionTipos.length +
    seleccionNiveles.length +
    seleccionRedes.length +
    seleccionMunicipios.length +
    seleccionModalidad.length;

  const verPrograma = (codigo: number) => {
    setModal({ tipo: 'programa', codigo });
    detalle.open(codigo);
  };
  const verMunicipio = (municipio: string) => setModal({ tipo: 'municipio', municipio });
  const cerrarModal = () => {
    setModal(null);
    detalle.close();
  };

  if (loading) return <Loader label="Cargando datos del modelo..." />;
  if (error && programas.length === 0) return <ErrorBox message={error} />;

  return (
    <div className="dashboard">
      <div className="topbar">
        <img className="topbar__logo" src="/sena-logo-white.png" alt="SENA" />
        <div className="topbar__titles">
          <h1>Modelo Predictivo SENA</h1>
          <p>Regional Cauca — exploración de la probabilidad de demanda (ejecución vs cancelación) de la oferta formativa</p>
        </div>
        <img className="topbar__logo topbar__logo--cmr" src="/logo-cmr.png" alt="CMR" />
        <button className="btn btn--ghost" onClick={reload}>
          Actualizar
        </button>
      </div>

      <div className="dashboard-layout">
        <FilterSidebar
          grupos={[
            {
              label: 'Centro de formación',
              kind: 'dropdown',
              opciones: catalogo.centros,
              seleccion: seleccionCentros,
              onToggle: toggleCentro,
              onClear: () => setSeleccionCentros([]),
            },
            {
              label: 'Tipo de respuesta',
              kind: 'dropdown',
              accent: true,
              opciones: catalogo.tipos,
              seleccion: seleccionTipos,
              onToggle: toggleTipo,
              onClear: () => setSeleccionTipos([]),
            },
            {
              label: 'Nivel de formación',
              kind: 'dropdown',
              opciones: catalogo.niveles,
              seleccion: seleccionNiveles,
              onToggle: toggleNivel,
              onClear: () => setSeleccionNiveles([]),
            },
            {
              label: 'Red de conocimiento',
              kind: 'modal',
              opciones: catalogo.redes,
              seleccion: seleccionRedes,
              onToggle: toggleRed,
              onClear: () => setSeleccionRedes([]),
            },
            {
              label: 'Modalidad',
              kind: catalogo.modalidades.length <= 15 ? 'dropdown' : 'modal',
              opciones: catalogo.modalidades,
              seleccion: seleccionModalidad,
              onToggle: toggleModalidad,
              onClear: () => setSeleccionModalidad([]),
            },
            {
              label: 'Municipio',
              kind: 'modal',
              opciones: catalogo.municipios,
              seleccion: seleccionMunicipios,
              onToggle: toggleMunicipio,
              onClear: () => setSeleccionMunicipios([]),
            },
          ]}
          activos={activos}
          onClearAll={limpiarTodos}
        />

        <div className="dashboard-main">
          {seleccionModalidad.length > 0 && (
            <p className="dashboard-note">
              Mostrando programas ofertados en la modalidad «
              {seleccionModalidad.join(', ')}» con su probabilidad condicionada a
              esa modalidad
              {refreshing && '… actualizando'}
            </p>
          )}
          {seleccionModalidad.length === 0 && filtrado && (
            <p className="dashboard-note">
              Mostrando solo programas con fichas históricas reales en los
              filtros seleccionados{refreshing && '… actualizando'}
            </p>
          )}

          <StatCards programas={programas} filtrado={filtrado} />

          <Section title="Probabilidad de demanda — Top 30">
            <ProbabilityBarChart programas={programas} />
          </Section>

          <Section title="Probabilidad promedio por Red de Conocimiento">
            <RedBarChart programas={programas} />
          </Section>

          <Section title="Catálogo detallado de programas">
            <ProgramTable
              programas={pageProgramas}
              currentPage={safePage}
              totalPages={totalPages}
              total={programas.length}
              goToPage={goToPage}
              onVerPrograma={verPrograma}
            />
          </Section>

          <Section title="Buscador de probabilidad de demanda">
            <PredictPanel programas={programas} onVerPrograma={verPrograma} />
          </Section>

          <Section title="Mapa de probabilidad de demanda">
            <CaucaMap onMunicipioClick={verMunicipio} />
          </Section>

          <Section title="Última oferta publicada">
            <UltimaOfertaPanel
              data={ultimaOferta.data}
              loading={ultimaOferta.loading}
              error={ultimaOferta.error}
              reload={ultimaOferta.reload}
              onVerPrograma={verPrograma}
            />
          </Section>

          <footer className="dashboard__footer">
            <ModelInfo />
          </footer>
        </div>
      </div>

      {modal?.tipo === 'municipio' && (
        <MunicipioModal
          municipio={modal.municipio}
          onClose={cerrarModal}
          onVerPrograma={verPrograma}
        />
      )}

      {modal?.tipo === 'programa' && (
        <>
          {detalle.loading && (
            <div className="modal-backdrop" onClick={cerrarModal}>
              <div className="modal modal--programa">
                <p className="loader-light">Cargando detalle del programa…</p>
              </div>
            </div>
          )}
          {detalle.error && (
            <div className="modal-backdrop" onClick={cerrarModal}>
              <div className="modal modal--programa">
                <div className="error-box">
                  Error: {detalle.error}{' '}
                  <button className="btn" onClick={() => verPrograma(modal.codigo)}>
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          )}
          {detalle.data && (
            <ProgramaModal
              detalle={detalle.data}
              refreshing={detalle.refreshing}
              onFiltrar={detalle.filtrar}
              onClose={cerrarModal}
            />
          )}
        </>
      )}
    </div>
  );
}