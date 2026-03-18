import React from 'react';
import { createRoot } from 'react-dom/client';
import MagazineCategory from './components/MagazineCategory';

const MAGAZINE_CATEGORIES = ['Applebees', 'KinderLa', 'Kutty Ulakam', 'Baal Manch', 'Tell Me More'];

const AdminDashboard = () => {
  return (
    <div>
      <style>
        {`
          .mag-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
          @media(min-width: 1024px) { .mag-grid { grid-template-columns: 1fr 1fr; } }
          .mag-cat-section { margin-bottom: 3rem; background: #fff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 1.5rem; }
          .mag-cat-header { font-size: 1.4rem; color: #1e3a8a; margin-bottom: 1rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 0.5rem; }
        `}
      </style>
      {MAGAZINE_CATEGORIES.map(category => (
        <MagazineCategory key={category} category={category} />
      ))}
    </div>
  );
};

const container = document.getElementById('admin-dashboard-root');
if (container) {
  const root = createRoot(container);
  root.render(<AdminDashboard />);
}
