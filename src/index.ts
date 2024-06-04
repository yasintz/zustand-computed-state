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
        const newState = {
          ...state,
          ...updated,
        };

        const computedSt = state[prefix]?.(newState);

        return {
          ...newState,
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

export function compute<StoreType, T extends Partial<StoreType>>(
  // @ts-ignore
  get: () => StoreType,
  fn: (store: StoreType) => T
): T {
  return {
    [prefix]: fn,
  } as any;
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
