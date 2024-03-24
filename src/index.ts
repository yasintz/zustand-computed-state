import { StateCreator, StoreMutatorIdentifier } from 'zustand';

const prefix = '$$_computed_';

function injectComputedMiddleware(f: StateCreator<any>): StateCreator<any> {
  return (set, get, api) => {
    const setWithComputed = (
      update: any | ((state: any) => any),
      replace?: boolean
    ) => {
      set((state: any) => {
        const updated = typeof update === 'object' ? update : update(state);

        const computedSt = state[prefix]?.(updated);

        return {
          ...state,
          ...updated,
          ...computedSt,
        };
      }, replace);
    };

    api.setState = setWithComputed;
    const st = f(setWithComputed, get, api);
    const computedSt = st[prefix]?.(st);

    return Object.assign({}, st, computedSt);
  };
}

type ComputeCallback<StoreType, T> = (store: StoreType) => T;
export function compute<StoreType>(
  fn?: never
): <T extends Partial<StoreType>>(fn: ComputeCallback<StoreType, T>) => T;
export function compute<StoreType, T>(fn: ComputeCallback<StoreType, T>): T;
export function compute(fn1?: ComputeCallback<any, any>) {
  function handler(fn: ComputeCallback<any, any>) {
    return { [prefix]: fn };
  }

  return fn1 ? { [prefix]: fn1 } : handler;
}

type ComputedState = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, Mcs>;

export const computed = (((f: any) =>
  injectComputedMiddleware(f as any) as any) as unknown) as ComputedState;
