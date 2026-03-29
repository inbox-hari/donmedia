import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from './supabase-client';
import MagazineCategory from './components/MagazineCategory';

const CategoryManageWrapper = () => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const urlParams = new URLSearchParams(window.location.search);
  const catId = urlParams.get('id');

  useEffect(() => {
    if (!catId) return;
    const fetchCategory = async () => {
      const { data } = await supabase.from('categories').select('*').eq('id', catId).single();
      setCategory(data);
      setLoading(false);
    };
    fetchCategory();
  }, [catId]);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i> Loading Category Detail...</div>;
  if (!category) return <div style={{ padding: '4rem', textAlign: 'center' }}>Category not found. <a href="/admin/dashboard.html">Back to Dashboard</a></div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
         <a href="/admin/dashboard.html" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '800' }}>← Back to Dashboard</a>
         <h1 style={{ marginTop: '0.5rem', color: '#1e3a8a' }}>Managing Content: {category.name}</h1>
      </header>
      <MagazineCategory category={category} />
    </div>
  );
};

const root = document.getElementById('admin-category-manage-root');
if (root) createRoot(root).render(<CategoryManageWrapper />);
