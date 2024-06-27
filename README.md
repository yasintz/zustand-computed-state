# zustand-computed-state

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]

zustand-computed-state is a lightweight, TypeScript-friendly middleware for the state management system [Zustand](https://github.com/pmndrs/zustand). It's a simple layer which adds a transformation function after any state change in your store.

## Install

```bash
yarn add zustand-computed-state
npm install zustand-computed-state
pnpm add zustand-computed-state
```

## Usage

The middleware layer takes in your store creation function and a compute function, which transforms your state into a computed state. It does not need to handle merging states.

```js
import { computed } from 'zustand-computed-state';

const useStore = create(
  computed((set, get) => ({
    count: 1,
    inc: () => set(state => ({ count: state.count + 1 })),
    dec: () => set(state => ({ count: state.count - 1 })),
    // get() function has access to computed states
    square: () => set(() => ({ count: get().countSq })),
    root: () => set(state => ({ count: Math.floor(Math.sqrt(state.count)) })),
    get countSq() {
      return this.count ** 2;
    },
  }))
);
```

With types, the previous example would look like this:

```ts
import { computed } from 'zustand-computed-state';

type Store = {
  count: number;
  inc: () => void;
  dec: () => void;
  countSq: number;
};

const useStore = create<Store>()(
  computed((set, get) => ({
    count: 1,
    inc: () => set(state => ({ count: state.count + 1 })),
    dec: () => set(state => ({ count: state.count - 1 })),
    square: () => set(() => ({ count: get().countSq })),
    root: () => set(state => ({ count: Math.floor(Math.sqrt(state.count)) })),
    get countSq() {
      return this.count ** 2;
    },
  }))
);
```

The store can then be used as normal in a React component or via the Zustand API.

```tsx
function Counter() {
  const { count, countSq, inc, dec } = useStore();
  return (
    <div>
      <span>{count}</span>
      <br />
      <span>{countSq}</span>
      <br />
      <button onClick={inc}>+1</button>
      <button onClick={dec}>-1</button>
    </div>
  );
}
```

## With Middleware

Here's an example with the Immer middleware.

```ts
const useStore = create<Store>()(
  devtools(
    computed(
      immer((set, get) => ({
        count: 1,
        inc: () =>
          set(state => {
            // example with Immer middleware
            state.count += 1;
          }),
        dec: () => set(state => ({ count: state.count - 1 })),
        get countSq() {
          return this.count ** 2;
        },
      }))
    )
  )
);
```

## With Slice Pattern

You will need to cover your slices with compute function

```ts
import { computed, compute } from 'zustand-computed-state';

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

type Store = XSlice & YSlice;

const createXSlice: StateCreator<Store, [], [], XSlice> = (set, get) =>
  compute('x', {
    x: 1,
    incX: () => set(state => ({ x: state.x + 1 })),
    get xSq() {
      return this.x ** 2;
    },
  });

const createYSlice: StateCreator<Store, [], [], YSlice> = (set, get) =>
  compute('y', {
    y: 1,
    incY: () => set(state => ({ y: state.y + 1 })),
    get ySq() {
      return this.y ** 2;
    },
  });

const store = create<Store>()(
  computed((...a) => ({
    ...createCountSlice(...a),
    ...createXySlice(...a),
  }))
);
```

[build-img]: https://github.com/yasintz/zustand-computed-state/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/yasintz/zustand-computed-state/actions/workflows/build.yml
[downloads-img]: https://img.shields.io/npm/dt/zustand-computed-state
[downloads-url]: https://www.npmtrends.com/zustand-computed-state-state
[npm-img]: https://img.shields.io/npm/v/zustand-computed-state
[npm-url]: https://www.npmjs.com/package/zustand-computed-state
[issues-img]: https://img.shields.io/github/issues/yasintz/zustand-computed-state
[issues-url]: https://github.com/yasintz/yasintz/zustand-computed-state/issues
