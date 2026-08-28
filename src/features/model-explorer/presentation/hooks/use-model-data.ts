import { useEffect, useState } from 'react';
import { modelRepository } from '../../infrastructure/composition-root';
import { getMetricas, getTop30 } from '../../application/usecases';
import type { Metricas, Top30Response } from '../../domain/entities';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useTop30() {
  const [state, setState] = useState<AsyncState<Top30Response>>({
    data: null,
    loading: true,
    error: null,
  });

  const load = () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    getTop30(modelRepository)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e: unknown) =>
        setState({ data: null, loading: false, error: errorMessage(e) }),
      );
  };

  useEffect(load, []);

  return { ...state, reload: load };
}

export function useMetricas() {
  const [state, setState] = useState<AsyncState<Metricas>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    getMetricas(modelRepository)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e: unknown) => setState({ data: null, loading: false, error: errorMessage(e) }));
  }, []);

  return state;
}

export function errorMessage(e: unknown): string {
  if (e && typeof e === 'object' && 'message' in e) {
    return String((e as { message: unknown }).message);
  }
  return 'Error desconocido';
}
