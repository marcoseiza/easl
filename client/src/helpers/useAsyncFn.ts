import { DependencyList, useCallback, useRef, useState } from 'react';
import { useMountedState } from './useMountedState';
import { FunctionReturningPromise, PromiseType } from './asyncTypes';

export type AsyncState<T> =
  | {
    loading: boolean;
    error?: undefined;
    value?: undefined;
  }
  | {
    loading: true;
    error?: Error | undefined;
    value?: T;
  }
  | {
    loading: false;
    error: Error;
    value?: undefined;
  }
  | {
    loading: false;
    error?: undefined;
    value: T;
  };

type StateFromFunctionReturningPromise<T extends FunctionReturningPromise> = AsyncState<
  PromiseType<ReturnType<T>>
>;

export type AsyncFnReturn<T extends FunctionReturningPromise = FunctionReturningPromise> = [
  StateFromFunctionReturningPromise<T>,
  T
];

export function useAsyncFn<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = [],
  initialState: StateFromFunctionReturningPromise<T> = { loading: false }
): AsyncFnReturn<T> {
  const lastCallId = useRef(0);
  const isMounted = useMountedState();
  const [state, set] = useState<StateFromFunctionReturningPromise<T>>(initialState);

  /* eslint-disable react-hooks/exhaustive-deps */
  const callback = useCallback((...args: Parameters<T>): ReturnType<T> => {
    const callId = ++lastCallId.current;

    if (!state.loading) {
      set((prevState) => ({ ...prevState, loading: true }));
    }

    return fn(...args).then(
      (value) => {
        isMounted() && callId === lastCallId.current && set({ value, loading: false });

        return value;
      },
      (error) => {
        isMounted() && callId === lastCallId.current && set({ error, loading: false });

        return error;
      }
    ) as ReturnType<T>;
  }, deps);
  /* eslint-enable react-hooks/exhaustive-deps */

  return [state, callback as unknown as T];
}