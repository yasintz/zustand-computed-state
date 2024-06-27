import { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { getAllGetters } from './utils';

const prefix = '$$_computed_';

function injectComputedMiddleware(f: StateCreator<any>): StateCreator<any> {
  let getters: any;
  return (set, get, api) => {
    function getComputedState(state: any) {
      if (!state[prefix]) {
        getters = getAllGetters(state);
        state[prefix] = compute;
      }

      return state[prefix](state, getters);
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

function compute(newState: any, getters: any) {
  const result: any = {};

  Object.keys(getters).forEach(key => {
    result[key] = getters[key].bind(newState)();
  });

  return result;
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
