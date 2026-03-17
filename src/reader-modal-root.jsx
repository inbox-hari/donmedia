import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import FlipbookReader from './components/FlipbookReader';

const ReaderModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    // Listen for custom event to open reader
    const handleOpen = (e) => {
      console.log("Opening reader with:", e.detail?.url);
      setPdfUrl(e.detail.url);
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    };

    window.addEventListener('open-pdf-reader', handleOpen);
    
    // Attach to window for legacy support
    window.openBookReader = (url) => {
      console.log("Opening reader with:", url);
      window.dispatchEvent(new CustomEvent('open-pdf-reader', { detail: { url } }));
    };

    return () => window.removeEventListener('open-pdf-reader', handleOpen);
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="book-reader-modal active" 
         style={{ 
           position: 'fixed', 
           top: 0, left: 0, 
           width: '100vw', height: '100vh', 
           zIndex: 9999,
           background: 'rgba(0,0,0,0.85)',
           display: 'flex',
           flexDirection: 'column'
         }}>
      <div className="reader-toolbar" style={{ 
        padding: '1rem', 
        display: 'flex', 
        justifyContent: 'flex-end',
        background: 'rgba(0,0,0,0.5)'
      }}>
        <button onClick={handleClose} style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '2rem',
          cursor: 'pointer',
          padding: '0.5rem'
        }}>✕</button>
      </div>
      <div className="modal-body" style={{ flex: 1, overflowY: 'auto' }}>
        <FlipbookReader fileUrl={pdfUrl} />
      </div>
    </div>
  );
};

const rootEl = document.getElementById('react-reader-root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<ReaderModal />);
}
