import { create, StateCreator } from 'zustand';
import { computed, compute } from '../src';
import { describe, test, expect, beforeEach, vi } from 'vitest';
type XSlice = {
  x: number;
  xSq: number;
  incX: () => void;
};

type YSlice = {
  y: number;
  ySq: number;
  incY: () => void;
};

type Store = YSlice & XSlice;

function computeYSlice(state: Store) {
  return {
    ySq: state.y ** 2,
  };
}
function computeXSlice(state: Store) {
  return {
    xSq: state.x ** 2,
  };
}

describe('slices pattern', () => {
  const computeYSliceMock = vi.fn(computeYSlice);
  const computeXSliceMock = vi.fn(computeXSlice);

  const makeStore = () => {
    const createCountSlice: StateCreator<Store, [], [], YSlice> = (
      set,
      get
    ) => ({
      y: 1,
      incY: () => set(state => ({ y: state.y + 1 })),
      ...compute('y', get, computeYSliceMock),
    });

    const createXySlice: StateCreator<Store, [], [], XSlice> = (set, get) => ({
      x: 1,
      incX: () => set(state => ({ x: state.x + 1 })),
      ...compute('x', get, computeXSliceMock),
    });

    return create<Store>()(
      computed((...a) => ({
        ...createCountSlice(...a),
        ...createXySlice(...a),
      }))
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('computed works on slices pattern example', () => {
    const useStore = makeStore();

    expect(computeYSliceMock).toHaveBeenCalledTimes(1);
    expect(computeXSliceMock).toHaveBeenCalledTimes(1);

    expect(useStore.getState().y).toEqual(1);
    expect(useStore.getState().ySq).toEqual(1);

    expect(useStore.getState().x).toEqual(1);
    expect(useStore.getState().xSq).toEqual(1);

    useStore.getState().incY();

    expect(computeYSliceMock).toHaveBeenCalledTimes(2);
    expect(computeXSliceMock).toHaveBeenCalledTimes(2);

    expect(useStore.getState().y).toEqual(2);
    expect(useStore.getState().ySq).toEqual(4);

    expect(useStore.getState().x).toEqual(1);
    expect(useStore.getState().xSq).toEqual(1);

    useStore.getState().incY();

    expect(computeYSliceMock).toHaveBeenCalledTimes(3);
    expect(computeXSliceMock).toHaveBeenCalledTimes(3);

    expect(useStore.getState().y).toEqual(3);
    expect(useStore.getState().ySq).toEqual(9);

    expect(useStore.getState().x).toEqual(1);
    expect(useStore.getState().xSq).toEqual(1);

    useStore.setState({ y: 4 });

    expect(computeYSliceMock).toHaveBeenCalledTimes(4);
    expect(computeXSliceMock).toHaveBeenCalledTimes(4);

    expect(useStore.getState().y).toEqual(4);
    expect(useStore.getState().ySq).toEqual(16);

    expect(useStore.getState().x).toEqual(1);
    expect(useStore.getState().xSq).toEqual(1);

    useStore.getState().incX();

    expect(computeYSliceMock).toHaveBeenCalledTimes(5);
    expect(computeXSliceMock).toHaveBeenCalledTimes(5);

    expect(useStore.getState().x).toEqual(2);
    expect(useStore.getState().xSq).toEqual(4);

    useStore.getState().incX();

    expect(computeYSliceMock).toHaveBeenCalledTimes(6);
    expect(computeXSliceMock).toHaveBeenCalledTimes(6);

    expect(useStore.getState().y).toEqual(4);
    expect(useStore.getState().ySq).toEqual(16);

    expect(useStore.getState().x).toEqual(3);
    expect(useStore.getState().xSq).toEqual(9);

    useStore.setState({ x: 4 });

    expect(computeYSliceMock).toHaveBeenCalledTimes(7);
    expect(computeXSliceMock).toHaveBeenCalledTimes(7);

    expect(useStore.getState().y).toEqual(4);
    expect(useStore.getState().ySq).toEqual(16);

    expect(useStore.getState().x).toEqual(4);
    expect(useStore.getState().xSq).toEqual(16);
  });
});
