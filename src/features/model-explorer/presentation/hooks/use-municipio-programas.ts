import { useEffect, useState } from 'react';
import { modelRepository } from '../../infrastructure/composition-root';
import { getMunicipioProgramas } from '../../application/usecases';
import type { ProgramaMunicipio } from '../../domain/entities';
import { errorMessage } from './use-model-data';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useMunicipioProgramas(municipio: string) {
  const [state, setState] = useState<AsyncState<ProgramaMunicipio[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    getMunicipioProgramas(modelRepository, municipio)
      .then((res) => {
        if (!cancelled) setState({ data: res.programas, loading: false, error: null });
      })
      .catch((e: unknown) => {
        if (!cancelled) setState({ data: null, loading: false, error: errorMessage(e) });
      });
    return () => {
      cancelled = true;
    };
  }, [municipio]);

  return state;
}