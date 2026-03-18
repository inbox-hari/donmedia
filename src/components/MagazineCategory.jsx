import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase-client';

const BUCKET = 'donmedia';

const extractStoragePath = (publicUrl) => {
  if (!publicUrl) return null;
  try {
    const url = new URL(publicUrl);
    const marker = `/object/public/${BUCKET}/`;
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.pathname.slice(idx + marker.length));
  } catch {
    return null;
  }
};

const MagazineCategory = ({ category }) => {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    cover_image: null,
    pdf_file: null,
  });

  const fetchMagazines = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('magazines')
        .select('*')
        .ilike('category', category)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMagazines(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMagazines();
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    const { title, description, cover_image, pdf_file } = formState;

    if (!title || !cover_image || !pdf_file) {
      setError('Title, cover image, and PDF file are required.');
      setUploading(false);
      return;
    }

    try {
      // 1. Upload cover image
      const safeName = cover_image.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const coverPath = `magazines/covers/${category}/${Date.now()}-${safeName}`;
      const { error: coverError } = await supabase.storage
        .from(BUCKET)
        .upload(coverPath, cover_image);
      if (coverError) throw coverError;
      const { data: { publicUrl: cover_url } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(coverPath);

      // 2. Upload PDF file
      const safePdfName = pdf_file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const pdfPath = `magazines/pdfs/${category}/${Date.now()}-${safePdfName}`;
      const { error: pdfError } = await supabase.storage
        .from(BUCKET)
        .upload(pdfPath, pdf_file);
      if (pdfError) throw pdfError;
      const { data: { publicUrl: pdf_url } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(pdfPath);

      // 3. Insert into database
      const { error: dbError } = await supabase.from('magazines').insert([
        { title, description, category, cover_url, pdf_url },
      ]);
      if (dbError) throw dbError;

      setFormState({ title: '', description: '', cover_image: null, pdf_file: null });
      e.target.reset();
      fetchMagazines();
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, cover_url, pdf_url) => {
    if (!confirm('Are you sure you want to delete this magazine?')) return;

    try {
      // 1. Delete from database
      const { error: dbError } = await supabase.from('magazines').delete().eq('id', id);
      if (dbError) throw dbError;

      // 2. Delete cover from storage
      if (cover_url) {
        const coverPath = extractStoragePath(cover_url);
        if (coverPath) {
          const { error: coverErr } = await supabase.storage.from(BUCKET).remove([coverPath]);
          if (coverErr) throw coverErr;
        }
      }
      // 3. Delete PDF from storage
      if (pdf_url) {
        const pdfPath = extractStoragePath(pdf_url);
        if (pdfPath) {
          const { error: pdfErr } = await supabase.storage.from(BUCKET).remove([pdfPath]);
          if (pdfErr) throw pdfErr;
        }
      }

      fetchMagazines();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mag-cat-section">
      <h2 className="mag-cat-header">{category}</h2>
      <div className="mag-grid">
        <div className="card">
          <div className="card-header">
            <h3>Upload New Magazine</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpload}>
              <div className="form-field">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" onChange={handleInputChange} placeholder="Magazine Title" required />
              </div>
              <div className="form-field">
                <label htmlFor="description">Description</label>
                <textarea name="description" onChange={handleInputChange} placeholder="Magazine Description"></textarea>
              </div>
              <div className="form-field">
                <label htmlFor="cover_image">Cover Image</label>
                <input type="file" name="cover_image" onChange={handleInputChange} accept="image/*" required />
              </div>
              <div className="form-field">
                <label htmlFor="pdf_file">PDF File</label>
                <input type="file" name="pdf_file" onChange={handleInputChange} accept="application/pdf" required />
              </div>
              <button type="submit" className="btn btn-green" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              {error && <div className="error-msg show">{error}</div>}
            </form>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>{category} Magazines</h3>
            <button className="btn btn-ghost btn-sm" onClick={fetchMagazines} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div className="items-table-container">
            {loading && <p>Loading...</p>}
            {!loading && magazines.length === 0 && <p>No magazines yet.</p>}
            <table className="items-table">
              <tbody>
                {magazines.map(magazine => (
                  <tr key={magazine.id}>
                    <td><img src={magazine.cover_url} alt={magazine.title} width="50" /></td>
                    <td>{magazine.title}</td>
                    <td>
                      <a href={magazine.pdf_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm">View</a>
                      <button onClick={() => handleDelete(magazine.id, magazine.cover_url, magazine.pdf_url)} className="btn btn-red btn-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineCategory;
