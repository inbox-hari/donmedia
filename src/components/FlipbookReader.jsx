import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';

// Vite worker setup
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const FlipbookPage = React.forwardRef(({ children }, ref) => (
  <div ref={ref} className="page-content" style={{ 
    background: '#fff', 
    width: '100%', 
    height: '100%', 
    position: 'relative',
    overflow: 'hidden'
  }}>
    {children}
  </div>
));

const FlipbookReader = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState(1.414);
  const [error, setError] = useState(false);

  const flipBookRef = useRef(null);

  const debugPdf =
    new URLSearchParams(window.location.search).get('debugPdf') === '1';
  const resolvedFileUrl = debugPdf
    ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    : fileUrl;

  // Responsive sizing logic
  useEffect(() => {
    const updateDimensions = () => {
      const windowWidth = window.innerWidth;
      // Modern UX: Portrait/Single page mode. min(90% window, 600px max)
      const calculatedWidth = Math.min(windowWidth * 0.9, 600);
      const calculatedHeight = calculatedWidth * aspectRatio;

      setPageSize({
        width: Math.max(calculatedWidth, 200), // Min 200px width
        height: Math.max(calculatedHeight, 300) // Min 300px height
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [aspectRatio]);

  useEffect(() => {
    console.log("Flipbook States:", { numPages, pageSize, aspectRatio, error });
  }, [numPages, pageSize, aspectRatio, error]);

  useEffect(() => {
    if (resolvedFileUrl) {
      console.log("FlipbookReader: Initializing with URL:", resolvedFileUrl);
    }
  }, [resolvedFileUrl]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log("FlipbookReader: PDF Document loaded. Total pages:", numPages);
    setNumPages(numPages);
    setError(false);
  };

  const handleNext = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const handlePrev = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  return (
    <div className="flipbook-wrapper">
      <div className="flipbook-container">
        {resolvedFileUrl ? (
          <Document
            file={resolvedFileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => {
              console.error("FlipbookReader: PDF load error:", err);
              setError(true);
            }}
            loading={
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading PDF content...</p>
              </div>
            }
          >
            {error && <div className="error-state">Failed to load PDF. Please check the file path.</div>}

            {numPages && pageSize.width > 0 && (
              <HTMLFlipBook
                key={`flipbook-${numPages}-${pageSize.width}`}
                width={pageSize.width}
                height={pageSize.height}
                size="stretch"
                minWidth={pageSize.width}
                maxWidth={600}
                minHeight={pageSize.height}
                maxHeight={900}
                maxShadowOpacity={0.4}
                showCover={false}
                mobileScrollSupport={true}
                usePortrait={true}
                className="flipbook-canvas"
                ref={flipBookRef}
                flippingTime={800}
                startPage={0}
                drawShadow={true}
                swipeDistance={30}
                showPageCorners={true}
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <FlipbookPage key={`page_${index + 1}`}>
                    <Page
                      pageNumber={index + 1}
                      width={pageSize.width}
                      scale={1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={<div className="page-loading">Loading page {index + 1}...</div>}
                      onLoadError={(err) => console.error(`FlipbookReader: Page ${index + 1} load error:`, err)}
                      onLoadSuccess={(page) => {
                        console.log(`FlipbookReader: Page ${index + 1} rendered`);
                        if (index === 0) {
                          const ratio = page.height / page.width;
                          if (Math.abs(aspectRatio - ratio) > 0.01) {
                            setAspectRatio(ratio);
                          }
                        }
                      }}
                    />
                  </FlipbookPage>
                ))}
              </HTMLFlipBook>
            )}
          </Document>
        ) : (
          <div className="error-state">No PDF source provided.</div>
        )}
      </div>

      {/* Controls Overlay */}
      <div className="flipbook-controls">
        <button onClick={handlePrev} className="nav-btn" aria-label="Previous page">
          <i className="fas fa-chevron-left"></i> <span>Previous</span>
        </button>
        <div className="page-info">
          {numPages ? `Pages: ${numPages}` : 'Interactive Flipbook'}
        </div>
        <button onClick={handleNext} className="nav-btn" aria-label="Next page">
          <span>Next</span> <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <style>{`
        .flipbook-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 100vh;
          background: #f1f5f9;
          padding: 1rem;
          box-sizing: border-box;
        }

        .flipbook-container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
          width: 100%;
          position: relative;
        }

        .flipbook-canvas {
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          background: white;
          border-radius: 4px;
          overflow: hidden;
        }

        .page-content {
          background: #fff;
          box-shadow: inset 0 0 15px rgba(0,0,0,0.05);
        }

        .flipbook-controls {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          padding: 1rem 2rem;
          background: white;
          border-radius: 50px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          margin: 2rem 0;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          border-radius: 25px;
          border: none;
          background: #1e3799;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }

        .nav-btn:hover {
          background: #2c49b8;
          transform: translateY(-2px);
        }

        .page-info {
          font-weight: 800;
          color: #1e293b;
          font-size: 0.95rem;
          min-width: 120px;
          text-align: center;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4rem;
          color: #1e3799;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #1e3799;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .flipbook-wrapper {
            padding: 0.5rem;
          }
          
          .flipbook-controls {
            width: 100%;
            justify-content: space-between;
            padding: 0.8rem 1rem;
            gap: 0.5rem;
            border-radius: 0;
            margin: 0;
            position: fixed;
            bottom: 0;
            left: 0;
            box-shadow: 0 -5px 15px rgba(0,0,0,0.05);
          }

          .nav-btn span {
            display: none;
          }

          .nav-btn {
            padding: 0.8rem;
          }

          .page-info {
            font-size: 0.85rem;
            min-width: auto;
          }

          .flipbook-container {
            padding-bottom: 70px; /* Space for fixed controls */
          }
        }

        .error-state {
          color: #dc2626;
          padding: 2rem;
          text-align: center;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default FlipbookReader;

