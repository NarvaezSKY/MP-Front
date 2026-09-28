import { useEffect, useRef, useState } from 'react';
import { modelRepository } from '../../infrastructure/composition-root';
import { getPrograms } from '../../application/usecases';
import type { FiltrosCatalogo, ProgramasFiltros, ProgramasResponse } from '../../domain/entities';
import { errorMessage } from './use-model-data';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

const FILTROS_VACIOS: FiltrosCatalogo = {
  centros: [],
  tipos: [],
  niveles: [],
  redes: [],
  municipios: [],
  modalidades: [],
};

export function usePrograms(filtros?: ProgramasFiltros) {
  const [state, setState] = useState<AsyncState<ProgramasResponse>>({
    data: null,
    loading: true,
    refreshing: false,
    error: null,
  });
  const requestRef = useRef(0);

  const key = filtros ? JSON.stringify(filtros) : '';

  const load = () => {
    const id = ++requestRef.current;
    setState((s) => ({
      ...s,
      loading: s.data === null,
      refreshing: s.data !== null,
      error: null,
    }));
    getPrograms(modelRepository, filtros ? { ...filtros } : undefined)
      .then((data) => {
        if (requestRef.current !== id) return;
        setState({ data, loading: false, refreshing: false, error: null });
      })
      .catch((e: unknown) => {
        if (requestRef.current !== id) return;
        setState((s) => ({
          ...s,
          loading: false,
          refreshing: false,
          error: errorMessage(e),
        }));
      });
  };

  useEffect(load, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    programas: state.data?.programas ?? [],
    filtros: state.data?.filtros ?? FILTROS_VACIOS,
    total: state.data?.total ?? 0,
    loading: state.loading,
    refreshing: state.refreshing,
    error: state.error,
    reload: load,
  };
}
