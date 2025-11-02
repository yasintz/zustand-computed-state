import { create } from 'zustand';
import { computed, compute } from '../src';
import { describe, test, expect, beforeEach, vi } from 'vitest';
type Store = {
  count: number;
  x: number;
  y: number;
  inc: () => void;
  dec: () => void;
  countSq: number;
  nestedResult: {
    stringified: string;
  };
};

function computeState(state: Store) {
  const nestedResult = {
    stringified: JSON.stringify(state.count),
  };

  return {
    countSq: state.count ** 2,
    nestedResult,
  };
}

describe('without second callback', () => {
  const computeStateMock = vi.fn(computeState);
  const makeStore = () =>
    create<Store>(
      computed((set, get) => ({
        count: 1,
        x: 1,
        y: 1,
        inc: () => set(state => ({ count: state.count + 1 })),
        dec: () => set(state => ({ count: state.count - 1 })),
        ...compute(get, computeStateMock),
      }))
    );

  let useStore: ReturnType<typeof makeStore>;
  beforeEach(() => {
    vi.clearAllMocks();
    useStore = makeStore();
  });

  test('computed works on simple counter example', () => {
    // note: this function should have been called once on store creation
    expect(computeStateMock).toHaveBeenCalledTimes(1);
    expect(useStore.getState().count).toEqual(1);
    expect(useStore.getState().countSq).toEqual(1);
    useStore.getState().inc();
    expect(useStore.getState().count).toEqual(2);
    expect(useStore.getState().countSq).toEqual(4);
    useStore.getState().dec();
    expect(useStore.getState().count).toEqual(1);
    expect(useStore.getState().countSq).toEqual(1);
    useStore.setState({ count: 4 });
    expect(useStore.getState().countSq).toEqual(16);
    expect(computeStateMock).toHaveBeenCalledTimes(4);
  });

  test('computed does not modify object ref even after change', () => {
    useStore.setState({ count: 4 });
    expect(useStore.getState().count).toEqual(4);
    const obj = useStore.getState().nestedResult;
    useStore.setState({ count: 4 });
    const toCompare = useStore.getState().nestedResult;
    expect(obj).toEqual(toCompare);
  });
});

describe('default config', () => {
  const computeStateMock = vi.fn(computeState);
  const makeStore = () =>
    create<Store>(
      computed((set, get) => ({
        count: 1,
        x: 1,
        y: 1,
        inc: () => set(state => ({ count: state.count + 1 })),
        dec: () => set(state => ({ count: state.count - 1 })),
        ...compute(get, computeStateMock),
      }))
    );

  let useStore: ReturnType<typeof makeStore>;
  beforeEach(() => {
    vi.clearAllMocks();
    useStore = makeStore();
  });

  test('computed works on simple counter example', () => {
    // note: this function should have been called once on store creation
    expect(computeStateMock).toHaveBeenCalledTimes(1);
    expect(useStore.getState().count).toEqual(1);
    expect(useStore.getState().countSq).toEqual(1);
    useStore.getState().inc();
    expect(useStore.getState().count).toEqual(2);
    expect(useStore.getState().countSq).toEqual(4);
    useStore.getState().dec();
    expect(useStore.getState().count).toEqual(1);
    expect(useStore.getState().countSq).toEqual(1);
    useStore.setState({ count: 4 });
    expect(useStore.getState().countSq).toEqual(16);
    expect(computeStateMock).toHaveBeenCalledTimes(4);
  });

  test('computed does not modify object ref even after change', () => {
    useStore.setState({ count: 4 });
    expect(useStore.getState().count).toEqual(4);
    const obj = useStore.getState().nestedResult;
    useStore.setState({ count: 4 });
    const toCompare = useStore.getState().nestedResult;
    expect(obj).toEqual(toCompare);
  });
});
