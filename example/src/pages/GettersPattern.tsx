import { create } from 'zustand';
import { computed, compute } from 'zustand-computed-state';

type Store = {
  count: number;
  x: number;
  y: number;
  inc: () => void;
  dec: () => void;
  get countSq(): number;
};

const useStore = create<Store>(
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

export default function GettersPattern() {
  const count = useStore(state => state.count);
  const countSq = useStore(state => state.countSq);
  const inc = useStore(state => state.inc);
  const dec = useStore(state => state.dec);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Getters Pattern</h1>
      <p style={{ marginBottom: '1rem', color: '#666' }}>
        This example demonstrates using getters with <code>compute(object)</code>. Getters
        defined in the object are automatically converted to computed values that update
        when the state changes.
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
          <strong>Count Squared (computed via getter):</strong>{' '}
          <span style={{ fontSize: '1.5rem', color: '#007acc' }}>{countSq}</span>
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
  computed(set =>
    compute({
      count: 1,
      inc: () => set(state => ({ count: state.count + 1 })),
      dec: () => set(state => ({ count: state.count - 1 })),
      get countSq() {
        return this.count ** 2;
      },
    })
  )
);`}
        </pre>
        <p>
          When you pass an object to <code>compute()</code>, any getters defined in that object
          are automatically detected and converted to computed values. The getter functions
          are bound to the current state, so <code>this</code> refers to the store state.
          This pattern is useful when you want to define computed values inline using JavaScript
          getter syntax.
        </p>
      </div>
    </div>
  );
}
