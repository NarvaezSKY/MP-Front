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
import {
  uniqueCentros,
  uniqueTipos,
  uniqueNiveles,
  uniqueRedes,
  uniqueMunicipios,
} from './lib/filter-options';
import { normalizeText } from './lib/strings';

type ModalState =
  | { tipo: 'programa'; codigo: number }
  | { tipo: 'municipio'; municipio: string };

export function ModelExplorerPage() {
  const { programas, loading, error, reload } = usePrograms();
  const ultimaOferta = useUltimaOferta();
  const detalle = useProgramaDetalle();
  const [seleccionCentros, setSeleccionCentros] = useState<string[]>([]);
  const [seleccionTipos, setSeleccionTipos] = useState<string[]>(['ABIERTA']);
  const [seleccionNiveles, setSeleccionNiveles] = useState<string[]>([]);
  const [seleccionRedes, setSeleccionRedes] = useState<string[]>([]);
  const [seleccionMunicipios, setSeleccionMunicipios] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<ModalState | null>(null);

  const centros = useMemo(() => uniqueCentros(programas), [programas]);
  const tipos = useMemo(() => uniqueTipos(programas), [programas]);
  const niveles = useMemo(() => uniqueNiveles(programas), [programas]);
  const redes = useMemo(() => uniqueRedes(programas), [programas]);
  const municipios = useMemo(() => uniqueMunicipios(programas), [programas]);

  const municipiosNorm = useMemo(
    () => new Set(seleccionMunicipios.map(normalizeText)),
    [seleccionMunicipios],
  );

  const filtrados = useMemo(
    () =>
      programas.filter(
        (p) =>
          (seleccionCentros.length === 0 ||
            seleccionCentros.includes(p.centro ?? 'Sin clasificar')) &&
          (seleccionTipos.length === 0 || seleccionTipos.includes(p.tipoRespuesta)) &&
          (seleccionNiveles.length === 0 ||
            (p.nivel !== null && seleccionNiveles.includes(p.nivel))) &&
          (seleccionRedes.length === 0 ||
            (p.redConocimiento !== null && seleccionRedes.includes(p.redConocimiento))) &&
          (seleccionMunicipios.length === 0 ||
            (p.municipio !== null && municipiosNorm.has(normalizeText(p.municipio)))),
      ),
    [programas, seleccionCentros, seleccionTipos, seleccionNiveles, seleccionRedes, municipiosNorm],
  );
  const filtrado = filtrados.length !== programas.length;

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
    setSeleccionCentros((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  const toggleTipo = (t: string) =>
    setSeleccionTipos((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  const toggleNivel = (n: string) =>
    setSeleccionNiveles((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n],
    );
  const toggleRed = (r: string) =>
    setSeleccionRedes((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
    );
  const toggleMunicipio = (m: string) =>
    setSeleccionMunicipios((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );

  const limpiarTodos = () => {
    setSeleccionCentros([]);
    setSeleccionTipos([]);
    setSeleccionNiveles([]);
    setSeleccionRedes([]);
    setSeleccionMunicipios([]);
  };

  const activos =
    seleccionCentros.length +
    seleccionTipos.length +
    seleccionNiveles.length +
    seleccionRedes.length +
    seleccionMunicipios.length;

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
  if (error) return <ErrorBox message={error} />;

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
              opciones: centros,
              seleccion: seleccionCentros,
              onToggle: toggleCentro,
              onClear: () => setSeleccionCentros([]),
            },
            {
              label: 'Tipo de respuesta',
              kind: 'dropdown',
              accent: true,
              opciones: tipos,
              seleccion: seleccionTipos,
              onToggle: toggleTipo,
              onClear: () => setSeleccionTipos([]),
            },
            {
              label: 'Nivel de formación',
              kind: 'dropdown',
              opciones: niveles,
              seleccion: seleccionNiveles,
              onToggle: toggleNivel,
              onClear: () => setSeleccionNiveles([]),
            },
            {
              label: 'Red de conocimiento',
              kind: 'modal',
              opciones: redes,
              seleccion: seleccionRedes,
              onToggle: toggleRed,
              onClear: () => setSeleccionRedes([]),
            },
            {
              label: 'Municipio',
              kind: 'modal',
              opciones: municipios,
              seleccion: seleccionMunicipios,
              onToggle: toggleMunicipio,
              onClear: () => setSeleccionMunicipios([]),
            },
          ]}
          activos={activos}
          onClearAll={limpiarTodos}
        />

        <div className="dashboard-main">
          <StatCards programas={filtrados} filtrado={filtrado} />

          <Section title="Probabilidad de demanda — Top 30">
            <ProbabilityBarChart programas={filtrados} />
          </Section>

          <Section title="Probabilidad promedio por Red de Conocimiento">
            <RedBarChart programas={filtrados} />
          </Section>

          <Section title="Catálogo detallado de programas">
            <ProgramTable
              programas={pageProgramas}
              currentPage={safePage}
              totalPages={totalPages}
              total={filtrados.length}
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
              onFiltrarMunicipio={detalle.filtrarMunicipio}
              onClose={cerrarModal}
            />
          )}
        </>
      )}
    </div>
  );
}