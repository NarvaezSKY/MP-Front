import { useEffect, useState } from 'react';
import { modelRepository } from '../../infrastructure/composition-root';
import { getPrograms } from '../../application/usecases';
import type { ProgramasResponse } from '../../domain/entities';
import { errorMessage } from './use-model-data';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function usePrograms() {
  const [state, setState] = useState<AsyncState<ProgramasResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  const load = () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    getPrograms(modelRepository)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e: unknown) =>
        setState({ data: null, loading: false, error: errorMessage(e) }),
      );
  };

  useEffect(load, []);

  return {
    programas: state.data?.programas ?? [],
    total: state.data?.total ?? 0,
    loading: state.loading,
    error: state.error,
    reload: load,
  };
}
