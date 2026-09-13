import type {
  HealthStatus,
  MapaResponse,
  Metricas,
  MunicipioProgramasResponse,
  PredictionRequest,
  Programa,
  ProgramaDetalle,
  ProgramasResponse,
  Top30Response,
  UltimaOfertaResponse,
} from './entities';

/**
 * Puerto de salida (driven port) del modelo predictivo.
 * La capa de aplicacion depende de esta interfaz, no de axios ni de la API.
 */
export interface ModelRepository {
  getHealth(): Promise<HealthStatus>;
  getTop30(): Promise<Top30Response>;
  getPrograms(): Promise<ProgramasResponse>;
  getMetricas(): Promise<Metricas>;
  predict(request: PredictionRequest): Promise<Programa[]>;
  getUltimaOferta(): Promise<UltimaOfertaResponse>;
  getMapa(): Promise<MapaResponse>;
  getProgramaDetalle(codigo: number): Promise<ProgramaDetalle>;
  getMunicipioProgramas(municipio: string): Promise<MunicipioProgramasResponse>;
}
