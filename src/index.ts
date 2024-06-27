import { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { getAllGetters } from './utils';

const prefix = '$$_computed_';
type ComputeFunctionType<StoreType, T> = (store: StoreType) => T;

function injectComputedMiddleware(f: StateCreator<any>): StateCreator<any> {
  return (set, get, api) => {
    function getComputedState(state: any) {
      const computedFunctions = Object.entries(state)
        .filter(([key]) => key.startsWith(prefix))
        .map(s => s[1] as ComputeFunctionType<any, any>);

      const computedSt = computedFunctions.reduce(
        (acc, cur) => ({
          ...acc,
          ...cur(state),
        }),
        {}
      );

      return computedSt;
    }
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

        return {
          ...newState,
          ...getComputedState(newState),
        };
      }, replace);
    };

    api.setState = setWithComputed;
    const st = f(setWithComputed, get, api);

    return Object.assign({}, st, getComputedState(st));
  };
}

function withGetters(initialState: any) {
  const getters = getAllGetters(initialState);
  return (newState: any) => {
    const result: any = {};

    Object.keys(getters).forEach(key => {
      result[key] = getters[key].bind(newState)();
    });

    return result;
  };
}

export function compute<StoreType>(
  store: StoreType,
  get?: never,
  compute?: never
): StoreType;

export function compute<StoreType, T extends Partial<StoreType>>(
  id: string,
  get: () => StoreType,
  compute: ComputeFunctionType<StoreType, T>
): T;

export function compute<StoreType, T extends Partial<StoreType>>(
  get: () => StoreType,
  compute: ComputeFunctionType<StoreType, T>,
  id?: never
): T;
export function compute(
  // @ts-ignore
  getOrId: any,
  getOrCompute: any,
  computeOrUndefined: any
) {
  if (typeof getOrId === 'string') {
    return {
      [`${prefix}_${getOrId}`]: computeOrUndefined,
    };
  }

  if (typeof getOrId === 'object') {
    return {
      ...getOrId,
      [prefix]: withGetters(getOrId),
    };
  }

  return {
    [prefix]: getOrCompute,
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
