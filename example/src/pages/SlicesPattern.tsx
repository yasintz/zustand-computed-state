import { create, type StateCreator } from 'zustand';
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

const createCountSlice: StateCreator<Store, [], YSlice> = (set, get) => ({
  y: 1,
  incY: () => set(state => ({ y: state.y + 1 })),
  ...compute('y', get, computeYSlice),
});

const createXySlice: StateCreator<Store, [], [], XSlice> = (set, get) => ({
  x: 1,
  incX: () => set(state => ({ x: state.x + 1 })),
  ...compute('x', get, computeXSlice),
});

const useStore = create<Store>()(
  computed((...a) => ({
    ...createCountSlice(...a),
    ...createXySlice(...a),
  }))
);

export default function SlicesPattern() {
  const x = useStore(state => state.x);
  const xSq = useStore(state => state.xSq);
  const y = useStore(state => state.y);
  const ySq = useStore(state => state.ySq);
  const incX = useStore(state => state.incX);
  const incY = useStore(state => state.incY);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Slices Pattern</h1>
      <p style={{ marginBottom: '1rem', color: '#666' }}>
        This example demonstrates using named compute IDs with slices. Each slice has its own
        compute function identified by a unique ID (<code>'x'</code> and <code>'y'</code>).
        This is useful when organizing your store into multiple slices.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ 
          background: '#fff3e0', 
          padding: '1.5rem', 
          borderRadius: '8px',
          border: '2px solid #ff9800'
        }}>
          <h2 style={{ marginTop: 0, color: '#e65100' }}>X Slice</h2>
          <div style={{ marginBottom: '1rem' }}>
            <strong>X:</strong> <span style={{ fontSize: '1.5rem' }}>{x}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>X Squared (computed):</strong>{' '}
            <span style={{ fontSize: '1.5rem', color: '#007acc' }}>{xSq}</span>
          </div>
          <button
            onClick={incX}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              background: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Increment X
          </button>
        </div>

        <div style={{ 
          background: '#e8f5e9', 
          padding: '1.5rem', 
          borderRadius: '8px',
          border: '2px solid #4caf50'
        }}>
          <h2 style={{ marginTop: 0, color: '#2e7d32' }}>Y Slice</h2>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Y:</strong> <span style={{ fontSize: '1.5rem' }}>{y}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Y Squared (computed):</strong>{' '}
            <span style={{ fontSize: '1.5rem', color: '#007acc' }}>{ySq}</span>
          </div>
          <button
            onClick={incY}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Increment Y
          </button>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e3f2fd', borderRadius: '4px' }}>
        <h3 style={{ marginTop: 0 }}>How it works:</h3>
        <pre style={{ background: '#fff', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`const createCountSlice = (set, get) => ({
  y: 1,
  incY: () => set(state => ({ y: state.y + 1 })),
  ...compute('y', get, computeYSlice), // Named ID: 'y'
});

const createXySlice = (set, get) => ({
  x: 1,
  incX: () => set(state => ({ x: state.x + 1 })),
  ...compute('x', get, computeXSlice), // Named ID: 'x'
});`}
        </pre>
        <p>
          Using <code>compute('id', get, computeFunction)</code> allows you to have multiple
          compute functions in the same store, each identified by a unique ID. This is perfect
          for organizing your store into slices while keeping computed values scoped to their
          respective slices.
        </p>
      </div>
    </div>
  );
}
