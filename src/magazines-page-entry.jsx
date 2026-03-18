import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from './supabase-client';

const MAGAZINE_CATEGORIES = ['Applebees', 'KinderLa', 'Kutty Ulakam', 'Baal Manch', 'Tell Me More'];
const CATEGORY_MAP = MAGAZINE_CATEGORIES.reduce((acc, category) => {
  acc[category.trim().toLowerCase()] = category;
  return acc;
}, {});
const FALLBACK_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="100%" height="100%" fill="#f1f5f9"/><rect x="60" y="80" width="480" height="640" fill="#e2e8f0"/><text x="300" y="410" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="28" fill="#64748b">Cover Unavailable</text></svg>'
)}`;

const openMagazineReader = (magazine) => {
  if (typeof window.openBookReader === 'function') {
    window.openBookReader({
      title: magazine.title,
      pdfUrl: magazine.pdf_url,
    });
    return;
  }

  window.location.href = `/reader.html?book=${encodeURIComponent(magazine.pdf_url || '')}`;
};

const MagazinesPage = () => {
  const [magazines, setMagazines] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMagazines = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('magazines')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        console.log("Categories from DB:", data.map(m => m.category));

        const grouped = MAGAZINE_CATEGORIES.reduce((acc, category) => {
          acc[category] = [];
          return acc;
        }, {});
        data.forEach((magazine) => {
          const normalized = String(magazine.category || '').trim().toLowerCase();
          if (CATEGORY_MAP[normalized]) {
            grouped[CATEGORY_MAP[normalized]].push(magazine);
          } else {
            // fallback: try direct match
            if (grouped[magazine.category]) {
              grouped[magazine.category].push(magazine);
            } else {
              console.warn("Unmatched category:", magazine.category);
            }
          }
        });
        setMagazines(grouped);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  return (
    <div>
      <style>{`
        .mag-section { margin-bottom: 3rem; }
        .mag-section-title { font-size: 2rem; margin-bottom: 1.5rem; }
        .mag-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        @media(max-width: 1024px) { .mag-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width: 640px) { .mag-grid { grid-template-columns: 1fr; } }
        .mag-card { background: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; transition: all 0.3s ease; }
        .mag-card:hover { transform: translateY(-5px); box-shadow: 0 8px 12px rgba(0,0,0,0.15); }
        .mag-card img { width: 100%; height: auto; }
        .mag-card-content { padding: 1rem; }
        .mag-card-title { font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem; }
        .read-btn { display: inline-block; background: #1e3a8a; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; }
      `}</style>
      {loading && (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '1.8rem', marginBottom: '.6rem', display: 'block' }}></i>
          Loading magazines…
        </div>
      )}
      {error && <p>Error: {error}</p>}
      {!loading && !error && MAGAZINE_CATEGORIES.map(category => (
        <div key={category} className="mag-section">
          <h2 className="mag-section-title">{category}</h2>
          <div className="mag-grid">
            {magazines[category] && magazines[category].length > 0 ? (
              magazines[category].map(magazine => (
                <div key={magazine.id} className="mag-card">
                  <img
                    src={magazine.cover_url || FALLBACK_COVER}
                    alt={magazine.title}
                    onError={(e) => { e.currentTarget.src = FALLBACK_COVER; }}
                  />
                  <div className="mag-card-content">
                    <h3 className="mag-card-title">{magazine.title}</h3>
                    <button
                      type="button"
                      className="read-btn"
                      onClick={() => openMagazineReader(magazine)}
                    >
                      Read
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No magazines yet in this category.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const container = document.getElementById('magazines-root');
if (container) {
  const root = createRoot(container);
  root.render(<MagazinesPage />);
}
