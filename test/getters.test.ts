import { create } from 'zustand';
import { computed, compute } from '../src';
import { describe, test, expect, beforeEach, vi as jest } from 'vitest';

type Store = {
  count: number;
  x: number;
  y: number;
  inc: () => void;
  dec: () => void;
  countSq: number;
};

describe('with getters', () => {
  const makeStore = () =>
    create<Store>(
      computed(set =>
        compute({
          count: 1,
          x: 1,
          y: 1,
          inc: () => set(state => ({ count: state.count + 1 })),
          dec: () => set(state => ({ count: state.count - 1 })),
          get countSq() {
            return this.count ** 2;
          },
        } as Store)
      )
    );

  let useStore: ReturnType<typeof makeStore>;
  beforeEach(() => {
    jest.clearAllMocks();
    useStore = makeStore();
  });

  const listener = jest.fn();

  test('computed works on simple counter example', () => {
    useStore.subscribe(listener);
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
    expect(listener).toHaveBeenCalledTimes(3);
  });
});
