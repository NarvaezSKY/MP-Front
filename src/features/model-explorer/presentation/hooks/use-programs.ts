import { useEffect, useMemo, useState } from 'react';
import { modelRepository } from '../../infrastructure/composition-root';
import { getPrograms } from '../../application/usecases';
import type { Programa, ProgramasResponse } from '../../domain/entities';
import { errorMessage } from './use-model-data';

const PER_PAGE = 30;

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
  const [currentPage, setCurrentPage] = useState(1);

  const load = () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    getPrograms(modelRepository)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e: unknown) =>
        setState({ data: null, loading: false, error: errorMessage(e) }),
      );
  };

  useEffect(load, []);

  const allProgramas: Programa[] = state.data?.programas ?? [];
  const total = state.data?.total ?? allProgramas.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const safePage = Math.min(currentPage, totalPages);
  const pageProgramas: Programa[] = useMemo(
    () => allProgramas.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE),
    [allProgramas, safePage],
  );

  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return {
    allProgramas,
    pageProgramas,
    total,
    totalPages,
    currentPage: safePage,
    goToPage,
    loading: state.loading,
    error: state.error,
    reload: load,
  };
}
