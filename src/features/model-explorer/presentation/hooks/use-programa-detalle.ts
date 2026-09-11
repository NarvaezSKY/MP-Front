import { useCallback, useState } from 'react';
import { modelRepository } from '../../infrastructure/composition-root';
import { getProgramaDetalle } from '../../application/usecases';
import type { ProgramaDetalle } from '../../domain/entities';
import { errorMessage } from './use-model-data';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useProgramaDetalle() {
  const [state, setState] = useState<AsyncState<ProgramaDetalle>>({
    data: null,
    loading: false,
    error: null,
  });
  const [codigoActivo, setCodigoActivo] = useState<number | null>(null);

  const open = useCallback((codigo: number) => {
    setCodigoActivo(codigo);
    setState({ data: null, loading: true, error: null });
    getProgramaDetalle(modelRepository, codigo)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e: unknown) =>
        setState({ data: null, loading: false, error: errorMessage(e) }),
      );
  }, []);

  const close = useCallback(() => {
    setCodigoActivo(null);
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, codigoActivo, open, close };
}