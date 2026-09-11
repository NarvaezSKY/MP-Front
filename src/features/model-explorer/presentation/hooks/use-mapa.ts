import { useEffect, useState } from 'react';
import { modelRepository } from '../../infrastructure/composition-root';
import { getMapa } from '../../application/usecases';
import type { MapaResponse } from '../../domain/entities';
import { errorMessage } from './use-model-data';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useMapa() {
  const [state, setState] = useState<AsyncState<MapaResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  const load = () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    getMapa(modelRepository)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e: unknown) =>
        setState({ data: null, loading: false, error: errorMessage(e) }),
      );
  };

  useEffect(load, []);

  return { ...state, reload: load };
}