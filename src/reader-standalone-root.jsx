import React from 'react';
import ReactDOM from 'react-dom/client';
import FlipbookReader from './components/FlipbookReader';

const StandaloneReader = () => {
  const bookUrl = new URLSearchParams(window.location.search).get('book');
  console.log("Opening standalone reader with:", bookUrl);

  if (!bookUrl) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#dc2626' }}>
        <h2>Error: No book specified.</h2>
        <p>Please return to the store and select a book.</p>
        <a href="store.html" style={{ color: '#1e3799', fontWeight: 'bold' }}>Back to Store</a>
      </div>
    );
  }

  return (
    <div className="standalone-reader-container">
      <FlipbookReader fileUrl={bookUrl} />
    </div>
  );
};

const rootEl = document.getElementById('standalone-reader-root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<StandaloneReader />);
}
