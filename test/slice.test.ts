import { create, StateCreator } from 'zustand';
import { computed, compute } from '../src';

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

describe('slices pattern', () => {
  const makeStore = () => {
    const createYSlice: StateCreator<Store, [], [], YSlice> = set =>
      compute('y', {
        y: 1,
        incY: () => set(state => ({ y: state.y + 1 })),
        get ySq() {
          return this.y ** 2;
        },
      });

    const createXSlice: StateCreator<Store, [], [], XSlice> = set =>
      compute('x', {
        x: 1,
        incX: () => set(state => ({ x: state.x + 1 })),
        get xSq() {
          return this.x ** 2;
        },
      });

    return create<Store>()(
      computed((...a) => ({
        ...createYSlice(...a),
        ...createXSlice(...a),
      }))
    );
  };

  test('computed works on slices pattern example', () => {
    const useStore = makeStore();

    expect(useStore.getState().y).toEqual(1);
    expect(useStore.getState().ySq).toEqual(1);

    expect(useStore.getState().x).toEqual(1);
    expect(useStore.getState().xSq).toEqual(1);

    useStore.getState().incY();

    expect(useStore.getState().y).toEqual(2);
    expect(useStore.getState().ySq).toEqual(4);

    expect(useStore.getState().x).toEqual(1);
    expect(useStore.getState().xSq).toEqual(1);

    useStore.getState().incY();

    expect(useStore.getState().y).toEqual(3);
    expect(useStore.getState().ySq).toEqual(9);

    expect(useStore.getState().x).toEqual(1);
    expect(useStore.getState().xSq).toEqual(1);

    useStore.setState({ y: 4 });

    expect(useStore.getState().y).toEqual(4);
    expect(useStore.getState().ySq).toEqual(16);

    expect(useStore.getState().x).toEqual(1);
    expect(useStore.getState().xSq).toEqual(1);

    useStore.getState().incX();

    expect(useStore.getState().x).toEqual(2);
    expect(useStore.getState().xSq).toEqual(4);

    useStore.getState().incX();

    expect(useStore.getState().y).toEqual(4);
    expect(useStore.getState().ySq).toEqual(16);

    expect(useStore.getState().x).toEqual(3);
    expect(useStore.getState().xSq).toEqual(9);

    useStore.setState({ x: 4 });

    expect(useStore.getState().y).toEqual(4);
    expect(useStore.getState().ySq).toEqual(16);

    expect(useStore.getState().x).toEqual(4);
    expect(useStore.getState().xSq).toEqual(16);
  });
});
