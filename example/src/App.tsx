import { useState } from 'react';
import Navigation from './components/Navigation';
import BasicCompute from './pages/BasicCompute';
import SlicesPattern from './pages/SlicesPattern';
import GettersPattern from './pages/GettersPattern';
import './App.css';

type Page = 'basic' | 'slices' | 'getters';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('basic');

  const renderPage = () => {
    switch (currentPage) {
      case 'basic':
        return <BasicCompute />;
      case 'slices':
        return <SlicesPattern />;
      case 'getters':
        return <GettersPattern />;
      default:
        return <BasicCompute />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
