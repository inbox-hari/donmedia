import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from './supabase-client';


const FALLBACK_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="100%" height="100%" fill="#f1f5f9"/><rect x="60" y="80" width="480" height="640" fill="#e2e8f0"/><text x="300" y="410" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="28" fill="#64748b">Cover Unavailable</text></svg>'
)}`;

const handleCoverError = (event) => {
  event.currentTarget.src = FALLBACK_COVER;
};

const MagazineDetailPage = () => {
  const [category, setCategory] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('id');

  useEffect(() => {
    if (!categoryId) {
      setError("No category selected.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .single();

        if (catError) throw catError;
        setCategory(catData);

        const { data: issuesData, error: issuesError } = await supabase
          .from('magazines')
          .select('*')
          .eq('category_id', categoryId)
          .order('position', { ascending: true })
          .order('created_at', { ascending: false });

        if (issuesError) throw issuesError;
        setIssues(issuesData || []);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const openReader = (magazine) => {
    if (typeof window.openBookReader === 'function') {
      window.openBookReader({ title: magazine.title, pdfUrl: magazine.pdf_url });
      return;
    }
    window.location.href = `/reader.html?pdf=${encodeURIComponent(magazine.pdf_url || '')}`;
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '10rem' }}>
      <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '3rem', color: '#1e3a8a' }}></i>
      <p style={{ marginTop: '1.5rem', color: '#64748b', fontWeight: '700' }}>Gathering issues...</p>
    </div>
  );
  
  if (error) return (
    <div style={{ textAlign: 'center', padding: '10rem', color: '#e11d48' }}>
      <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
      <h3>Error: {error}</h3>
      <a href="/magazines.html" style={{ color: '#1e3a8a', fontWeight: '800', marginTop: '1rem', display: 'inline-block' }}>Return to Magazines</a>
    </div>
  );

  return (
    <div className="mag-detail-container">
      <style>{`
        .mag-detail-container { padding: 2rem 0; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #64748b; text-decoration: none; margin-bottom: 2rem; font-weight: 700; transition: color 0.2s; }
        .back-link:hover { color: #1e3a8a; }
        
        .detail-header { border-bottom: 3px solid #f1f5f9; padding-bottom: 2rem; margin-bottom: 3.5rem; }
        .detail-category { font-size: 0.9rem; font-weight: 800; color: #e11d48; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .detail-title { font-size: 2.8rem; font-weight: 900; color: #1e3a8a; margin: 0; line-height: 1.1; }
        .detail-desc { font-size: 1.1rem; color: #64748b; margin-top: 1rem; max-width: 800px; line-height: 1.6; }
        
        .mag-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 2rem; 
        }
        @media(min-width: 640px) { .mag-grid { grid-template-columns: repeat(3, 1fr); } }
        @media(min-width: 900px) { .mag-grid { grid-template-columns: repeat(4, 1fr); } }
        @media(min-width: 1100px) { .mag-grid { grid-template-columns: repeat(5, 1fr); } }

        .mag-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(30,55,153,0.06); overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column; border: 1px solid #f1f5f9; cursor: pointer; }
        .mag-card:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(30,55,153,0.12); border-color: #cbd5e1; }
        .mag-thumb { position: relative; aspect-ratio: 3/4; overflow: hidden; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
        .mag-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .mag-card-content { padding: 1.25rem; flex-grow: 1; display: flex; flex-direction: column; background: #fff; }
        .mag-card-title { font-size: 1.1rem; font-weight: 800; color: #1e293b; margin-bottom: 0.4rem; line-height: 1.3; }
        .mag-card-meta { font-size: 0.85rem; color: #e11d48; font-weight: 700; margin-bottom: 1.25rem; }
        
        .read-btn { 
          margin-top: auto; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 0.5rem; 
          background: #1e3a8a; 
          color: #fff; 
          padding: 0.75rem; 
          border-radius: 8px; 
          text-align: center; 
          font-weight: 700; 
          cursor: pointer; 
          border: none; 
          transition: background 0.2s;
          text-decoration: none;
        }
        .read-btn:hover { background: #1e40af; }
        .empty-state { grid-column: 1/-1; padding: 6rem 2rem; text-align: center; color: #94a3b8; background: #f8fafc; border-radius: 16px; border: 2px dashed #e2e8f0; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/magazines.html" className="back-link">
          <i className="fas fa-arrow-left"></i> Back to Store
        </a>
      </div>

      <div className="detail-header">
        <div className="detail-category">
          <i className="fas fa-folder-open"></i> {category?.type === 'current' ? 'Current Magazine' : 'Old Magazine ARCHIVE'}
        </div>
        <h1 className="detail-title">{category?.name}</h1>
        <p className="detail-desc">{category?.description || 'Browse our complete collection of issues and editions.'}</p>
      </div>

      <div className="mag-grid">
        {issues.length > 0 ? issues.map(mag => (
          <div key={mag.id} className="mag-card">
            <div className="mag-thumb" onClick={() => openReader(mag)}>
              <img
                src={mag.cover_url || FALLBACK_COVER}
                alt={mag.title}
                width="420"
                height="560"
                loading="lazy"
                decoding="async"
                onError={handleCoverError}
              />
            </div>
            <div className="mag-card-content">
               <h3 className="mag-card-title">{mag.title}</h3>
               <div className="mag-card-meta">{mag.month} {mag.year}</div>
               <button type="button" className="read-btn" onClick={() => openReader(mag)}>
                 <i className="fas fa-book-open"></i> READ NOW
               </button>
            </div>
          </div>
        )) : (
          <div className="empty-state">
             <i className="fas fa-newspaper" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', display: 'block', opacity: 0.3 }}></i>
             <h3 style={{ fontSize: '1.5rem', color: '#1e3a8a', opacity: 0.5 }}>No issues found in this category</h3>
             <p>Our team is currently preparing the latest issues. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const container = document.getElementById('magazine-detail-root');
if (container) createRoot(container).render(<MagazineDetailPage />);
