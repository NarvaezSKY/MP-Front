import type {
  HealthStatus,
  Metricas,
  PredictionRequest,
  Programa,
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
}
