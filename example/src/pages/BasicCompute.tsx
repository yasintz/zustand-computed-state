import { create } from 'zustand';
import { computed, compute } from 'zustand-computed-state';

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

const useStore = create<Store>(
  computed((set, get) => ({
    count: 1,
    x: 1,
    y: 1,
    inc: () => set(state => ({ count: state.count + 1 })),
    dec: () => set(state => ({ count: state.count - 1 })),
    ...compute(get, computeState),
  }))
);

export default function BasicCompute() {
  const count = useStore(state => state.count);
  const countSq = useStore(state => state.countSq);
  const nestedResult = useStore(state => state.nestedResult);
  const inc = useStore(state => state.inc);
  const dec = useStore(state => state.dec);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Basic Compute Pattern</h1>
      <p style={{ marginBottom: '1rem', color: '#666' }}>
        This example demonstrates the basic usage of <code>compute(get, computeFunction)</code>.
        The computed values (<code>countSq</code> and <code>nestedResult</code>) are automatically
        recalculated whenever the state changes.
      </p>

      <div style={{ 
        background: '#f5f5f5', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Count:</strong> <span style={{ fontSize: '1.5rem' }}>{count}</span>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Count Squared (computed):</strong>{' '}
          <span style={{ fontSize: '1.5rem', color: '#007acc' }}>{countSq}</span>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Nested Result (computed):</strong>{' '}
          <code style={{ background: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
            {nestedResult.stringified}
          </code>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={dec}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Decrement
        </button>
        <button
          onClick={inc}
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
          Increment
        </button>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e3f2fd', borderRadius: '4px' }}>
        <h3 style={{ marginTop: 0 }}>How it works:</h3>
        <pre style={{ background: '#fff', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`const useStore = create<Store>(
  computed((set, get) => ({
    count: 1,
    inc: () => set(state => ({ count: state.count + 1 })),
    dec: () => set(state => ({ count: state.count - 1 })),
    ...compute(get, computeState),
  }))
);`}
        </pre>
        <p>
          The <code>compute(get, computeState)</code> function receives the current state and returns
          computed values that are merged into the store. These values are automatically recalculated
          whenever the state changes.
        </p>
      </div>
    </div>
  );
}
