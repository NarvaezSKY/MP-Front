import { useState } from 'react';
import { modelRepository } from '../../infrastructure/composition-root';
import { predictProgramas } from '../../application/usecases';
import type { Programa } from '../../domain/entities';
import { errorMessage } from './use-model-data';

interface PredictState {
  resultados: Programa[];
  loading: boolean;
  error: string | null;
}

export function usePredict() {
  const [state, setState] = useState<PredictState>({
    resultados: [],
    loading: false,
    error: null,
  });

  const predict = (codigos: number[]) => {
    if (codigos.length === 0) return;
    setState({ resultados: [], loading: true, error: null });
    predictProgramas(modelRepository, { codigos })
      .then((resultados) => setState({ resultados, loading: false, error: null }))
      .catch((e: unknown) => setState({ resultados: [], loading: false, error: errorMessage(e) }));
  };

  return { ...state, predict };
}
