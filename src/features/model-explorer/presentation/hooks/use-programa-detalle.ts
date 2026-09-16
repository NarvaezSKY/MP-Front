import { useCallback, useRef, useState } from 'react';
import { modelRepository } from '../../infrastructure/composition-root';
import { getProgramaDetalle } from '../../application/usecases';
import type { ProgramaDetalle } from '../../domain/entities';
import { errorMessage } from './use-model-data';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

export function useProgramaDetalle() {
  const [state, setState] = useState<AsyncState<ProgramaDetalle>>({
    data: null,
    loading: false,
    refreshing: false,
    error: null,
  });
  const [codigoActivo, setCodigoActivo] = useState<number | null>(null);
  const requestRef = useRef(0);

  const cargar = useCallback(
    (codigo: number, municipio?: string, centro?: string) => {
      const id = ++requestRef.current;
      getProgramaDetalle(modelRepository, codigo, municipio, centro)
        .then((data) => {
          if (requestRef.current !== id) return;
          setState({ data, loading: false, refreshing: false, error: null });
        })
        .catch((e: unknown) => {
          if (requestRef.current !== id) return;
          setState((prev) => ({
            ...prev,
            loading: false,
            refreshing: false,
            error: prev.data ? prev.error : errorMessage(e),
          }));
        });
    },
    [],
  );

  const open = useCallback(
    (codigo: number) => {
      setCodigoActivo(codigo);
      setState({ data: null, loading: true, refreshing: false, error: null });
      cargar(codigo);
    },
    [cargar],
  );

  const filtrar = useCallback(
    (municipio: string | null, centro: string | null) => {
      if (codigoActivo === null) return;
      setState((prev) => ({ ...prev, refreshing: true, error: null }));
      cargar(codigoActivo, municipio ?? undefined, centro ?? undefined);
    },
    [codigoActivo, cargar],
  );

  const close = useCallback(() => {
    requestRef.current += 1;
    setCodigoActivo(null);
    setState({ data: null, loading: false, refreshing: false, error: null });
  }, []);

  return { ...state, codigoActivo, open, close, filtrar };
}