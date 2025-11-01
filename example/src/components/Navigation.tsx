type Page = 'basic' | 'slices' | 'getters';

type NavigationProps = {
  currentPage: Page;
  onPageChange: (page: Page) => void;
};

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const pages: { id: Page; label: string; description: string }[] = [
    { id: 'basic', label: 'Basic Compute', description: 'Simple compute function pattern' },
    { id: 'slices', label: 'Slices Pattern', description: 'Named compute IDs with slices' },
    { id: 'getters', label: 'Getters Pattern', description: 'Using getters with compute' },
  ];

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '2px solid #e0e0e0',
      padding: '1rem 2rem',
      marginBottom: '2rem',
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
          zustand-computed-state
        </h1>
        <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
          {pages.map(page => (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                background: currentPage === page.id ? '#007acc' : 'transparent',
                color: currentPage === page.id ? 'white' : '#666',
                border: currentPage === page.id ? 'none' : '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== page.id) {
                  e.currentTarget.style.background = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== page.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
