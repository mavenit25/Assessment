import React from 'react';
import { HierarchicalTable } from './components/HierarchicalTable';
import { initialData } from './data';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hierarchical Table</h1>
        <HierarchicalTable initialData={initialData} />
      </div>
    </div>
  );
}

export default App;