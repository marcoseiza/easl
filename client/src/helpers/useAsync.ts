import { DependencyList, useEffect } from 'react';
import { useAsyncFn } from './useAsyncFn';
import { FunctionReturningPromise } from './asyncTypes';

export function useAsync<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = []
) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });

  useEffect(() => {
    callback();
  }, [callback]);

  return state;
}