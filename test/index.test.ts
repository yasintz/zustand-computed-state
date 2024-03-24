import { create, StateCreator } from 'zustand';
import { computed, compute } from '../src';

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
  const computeStateMock = jest.fn(computeState);
  const makeStore = () =>
    create<Store>(
      computed(set => ({
        count: 1,
        x: 1,
        y: 1,
        inc: () => set(state => ({ count: state.count + 1 })),
        dec: () => set(state => ({ count: state.count - 1 })),
        ...compute<Store, ReturnType<typeof computeState>>(computeStateMock),
      }))
    );

  let useStore: ReturnType<typeof makeStore>;
  beforeEach(() => {
    jest.clearAllMocks();
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
  const computeStateMock = jest.fn(computeState);
  const makeStore = () =>
    create<Store>(
      computed(set => ({
        count: 1,
        x: 1,
        y: 1,
        inc: () => set(state => ({ count: state.count + 1 })),
        dec: () => set(state => ({ count: state.count - 1 })),
        ...compute<Store>()(computeStateMock),
      }))
    );

  let useStore: ReturnType<typeof makeStore>;
  beforeEach(() => {
    jest.clearAllMocks();
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

  test.skip('modifying variables x and y do not trigger compute function more than once, as they are not used in compute function', () => {
    expect(computeStateMock).toHaveBeenCalledTimes(1);
    useStore.setState({ x: 2 });
    expect(computeStateMock).toHaveBeenCalledTimes(2);
    useStore.setState({ x: 3 });
    expect(computeStateMock).toHaveBeenCalledTimes(2);
    useStore.setState({ y: 2 });
    expect(computeStateMock).toHaveBeenCalledTimes(2);
  });
});

type CountSlice = Pick<Store, 'count' | 'dec' | 'countSq' | 'nestedResult'>;
type XYSlice = Pick<Store, 'x' | 'y' | 'inc'>;
function computeSlice(state: CountSlice) {
  const nestedResult = {
    stringified: JSON.stringify(state.count),
  };

  return {
    countSq: state.count ** 2,
    nestedResult,
  };
}

describe('slices pattern', () => {
  const computeSliceMock = jest.fn(computeSlice);
  const makeStore = () => {
    const createCountSlice: StateCreator<Store, [], [], CountSlice> = computed(
      set => ({
        count: 1,
        dec: () => set(state => ({ count: state.count - 1 })),
        ...compute<Store>()(computeSliceMock),
      })
    );

    const createXySlice: StateCreator<Store, [], [], XYSlice> = set => ({
      x: 1,
      y: 1,
      // this should not trigger compute function
      inc: () => set(state => ({ count: state.count + 2 })),
    });

    return create<Store>()((...a) => ({
      ...createCountSlice(...a),
      ...createXySlice(...a),
    }));
  };

  beforeEach(() => {
    computeSliceMock.mockClear();
  });

  test('computed works on slices pattern example', () => {
    const useStore = makeStore();
    expect(computeSliceMock).toHaveBeenCalledTimes(1);
    expect(useStore.getState().count).toEqual(1);
    expect(useStore.getState().countSq).toEqual(1);
    useStore.getState().inc();
    expect(useStore.getState().count).toEqual(3);
    expect(useStore.getState().countSq).toEqual(1);
    expect(computeSliceMock).toHaveBeenCalledTimes(1);
    useStore.getState().dec();
    expect(useStore.getState().count).toEqual(2);
    expect(useStore.getState().countSq).toEqual(4);
    expect(computeSliceMock).toHaveBeenCalledTimes(2);
    useStore.setState({ count: 4 });
    expect(useStore.getState().countSq).toEqual(16);
    expect(computeSliceMock).toHaveBeenCalledTimes(3);
  });
});
