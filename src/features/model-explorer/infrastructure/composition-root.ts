import type { ModelRepository } from '../domain/ports';
import { ModelApiAdapter } from './api/model-api.adapter';

/**
 * Composition Root del vertical slice.
 * Es el unico punto que instancia el adaptador concreto; el resto del
 * codigo (hooks, componentes, casos de uso) solo conoce el puerto.
 */
export const modelRepository: ModelRepository = new ModelApiAdapter();
