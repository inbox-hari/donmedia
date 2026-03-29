import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from './supabase-client';


const FALLBACK_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="100%" height="100%" fill="#f1f5f9"/><rect x="60" y="80" width="480" height="640" fill="#e2e8f0"/><text x="300" y="410" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="28" fill="#64748b">Cover Unavailable</text></svg>'
)}`;

const handleCoverError = (event) => {
  event.currentTarget.src = FALLBACK_COVER;
  event.currentTarget.classList.add('loaded');
};

const MagazinesPage = () => {
  const [currentCats, setCurrentCats] = useState([]);
  const [oldCats, setOldCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await safeQuery(() => 
        supabase
          .from('categories')
          .select('*')
          .order('position', { ascending: true })
      );
      
      if (error) {
        setError(`${error.message} (${error.code})`);
      } else {
        const cats = data || [];
        setCurrentCats(cats.filter(c => c.type === 'current'));
        setOldCats(cats.filter(c => !c.type || c.type === 'old'));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem' }}>
      <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '1.8rem', color: '#1e3799' }}></i>
      <p style={{ marginTop: '1rem', color: '#94a3b8', fontWeight: '600' }}>Loading magazines...</p>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: '#ef4444' }}>
      <i className="fas fa-exclamation-circle" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
      <h3>Unable to load magazines</h3>
      <p style={{ opacity: 0.7 }}>{error}</p>
      <button onClick={() => window.location.reload()} className="mag-btn" style={{ margin: '1rem auto' }}>Retry</button>
    </div>
  );

  return (
    <div className="magazines-gallery">
      <style>{`
        .magazines-gallery { padding: 10px 0 60px; max-width: 1200px; margin: 0 auto; font-family: 'Nunito', sans-serif; }
        
        /* GRID SYSTEM */
        .mag-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding: 0 16px;
        }
        @media (min-width: 768px) {
          .mag-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 0 20px; }
        }
        @media (min-width: 1024px) {
          .mag-grid { grid-template-columns: repeat(4, 1fr); gap: 32px; }
        }

        /* SECTION STYLING */
        .section { margin-top: 40px; }
        .section-title {
          font-size: 20px;
          font-weight: 800;
          color: #1e3799;
          margin-bottom: 20px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: -0.02em;
        }

        /* PREMIUM CURRENT SECTION */
        .current-section {
          background: #fffcf0;
          padding: 24px 0 32px 0;
          border-radius: 24px;
          margin: 10px 16px 40px;
          border: 1px solid #fef3c7;
        }
        .current-section .section-title { padding-left: 20px; }
        .current-section .mag-grid { padding: 0 20px; }

        /* CARD STYLING */
        .mag-card {
          background: white;
          border-radius: 18px;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(30, 55, 153, 0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-decoration: none;
          color: inherit;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
          will-change: transform;
          border: 1px solid rgba(30, 55, 153, 0.03);
        }
        .mag-card:hover { 
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(30, 55, 153, 0.12);
        }
        .mag-card:active { transform: scale(0.97); }

        .mag-img-container {
          width: 100%;
          aspect-ratio: 1.4 / 1;
          background: #f8fafc;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }
        
        /* Shimmer effect for loading */
        .mag-img-container::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          transform: translateX(-100%);
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        .mag-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0;
          transition: opacity 0.5s ease, filter 0.5s ease;
          filter: blur(5px);
        }
        
        .mag-card img.loaded {
          opacity: 1;
          filter: blur(0);
        }
        
        .mag-card-content { display: flex; flex-direction: column; gap: 6px; padding: 4px; }
        .mag-title {
          font-size: 16px;
          font-weight: 800;
          color: #1e3799;
          line-height: 1.3;
          margin-bottom: 2px;
        }
        .mag-subtitle {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
          height: 3em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        /* BUTTON STYLING */
        .mag-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          background: #1e3799;
          color: white;
          font-size: 12px;
          font-weight: 700;
          padding: 8px;
          border-radius: 8px;
          margin-top: 4px;
          transition: background 0.2s;
        }
        .mag-card:hover .mag-btn { background: #1a2a7a; }
        .old-btn { background: #64748b; }
      `}</style>

      {/* 1. CURRENT MAGAZINES */}
      {currentCats.length > 0 && (
        <div className="current-section">
          <h2 className="section-title">
            <i className="fas fa-star" style={{ color: '#f59e0b' }}></i> Current Magazines
          </h2>
          <div className="mag-grid">
            {currentCats.map((cat, index) => (
              <a key={cat.id} href={`/magazine-detail.html?id=${cat.id}`} className="mag-card">
                <div className="mag-img-container">
                  <img 
                    src={cat.cover_url || FALLBACK_COVER}
                    alt={cat.name} 
                    width="520"
                    height="380"
                    onLoad={(e) => e.target.classList.add('loaded')}
                    onError={handleCoverError}
                    loading={index < 4 ? "eager" : "lazy"} 
                    decoding="async"
                    fetchpriority={index < 2 ? "high" : "auto"}
                  />
                </div>
                <div className="mag-card-content">
                  <div className="mag-title">{cat.name}</div>
                  <div className="mag-subtitle">{cat.description || 'Latest actively running publication.'}</div>
                  <div className="mag-btn"><i className="fas fa-book-open" style={{ fontSize: '10px' }}></i> Browse</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 2. OLD MAGAZINES */}
      <div className="section" style={{ marginTop: currentCats.length > 0 ? '0' : '28px' }}>
        <h2 className="section-title">
          <i className="fas fa-history" style={{ color: '#64748b' }}></i> Browse Old Editions
        </h2>
        <div className="mag-grid">
          {oldCats.length > 0 ? oldCats.map(cat => (
            <a key={cat.id} href={`/magazine-detail.html?id=${cat.id}`} className="mag-card">
              <div className="mag-img-container">
                <img 
                  src={cat.cover_url || FALLBACK_COVER}
                  alt={cat.name} 
                  width="520"
                  height="380"
                  onLoad={(e) => e.target.classList.add('loaded')}
                  onError={handleCoverError}
                  loading="lazy" 
                  decoding="async"
                />
              </div>
              <div className="mag-card-content">
                <div className="mag-title">{cat.name}</div>
                <div className="mag-subtitle">{cat.description || 'Past archived collection.'}</div>
                <div className="mag-btn old-btn"><i className="fas fa-archive" style={{ fontSize: '10px' }}></i> Archive</div>
              </div>
            </a>
          )) : <div style={{ color: '#94a3b8', padding: '2rem', gridColumn: '1/-1', textAlign: 'center' }}>No archived editions found.</div>}
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('magazines-root');
if (container) createRoot(container).render(<MagazinesPage />);
