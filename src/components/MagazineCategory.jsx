import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase-client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MagazineIssueManager from './MagazineIssueManager';

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

// --- Sortable Item Component ---
const SortableMagazine = ({ magazine, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: magazine.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.8rem 1rem',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : 'none',
    zIndex: isDragging ? 100 : 1,
    position: 'relative'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners} style={{ cursor: 'grab', color: '#cbd5e1', padding: '0.4rem' }}>
        <i className="fas fa-grip-vertical"></i>
      </div>
      
      <img 
        src={magazine.cover_url} 
        alt="" 
        width="40"
        height="54"
        style={{ width: '40px', height: '54px', objectFit: 'cover', borderRadius: '4px', background: '#f8fafc' }} 
      />

      <div style={{ flexGrow: 1 }}>
        <div style={{ fontWeight: '700', color: '#1e293b' }}>{magazine.title}</div>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {magazine.month} {magazine.year}
        </div>
      </div>

      <button 
        onClick={() => onDelete(magazine.id, magazine.cover_url, magazine.pdf_url)}
        className="btn btn-red btn-sm" 
        style={{ padding: '4px 8px', borderRadius: '6px' }}
      >
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
};


const MagazineCategory = ({ category }) => {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [selectedTitle, setSelectedTitle] = useState(null);

  const fetchTitles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('magazine_titles')
        .select('*')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setTitles(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTitles(); }, [category.id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name) return alert('Name is required');
    setUploading(true);
    try {
      await supabase.from('magazine_titles').insert([{
        name: form.name,
        category_id: category.id
      }]);
      setForm({ name: '' });
      fetchTitles();
    } catch (err) { alert(err.message); } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this publication title?')) return;
    try {
      await supabase.from('magazine_titles').delete().eq('id', id);
      fetchTitles();
    } catch (err) { alert(err.message); }
  };

  if (selectedTitle) {
    return <MagazineIssueManager title={selectedTitle} onBack={() => setSelectedTitle(null)} />;
  }

  return (
    <div className="mag-title-manager" style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '3rem', alignItems: 'start' }}>
        
        <div className="card" style={{ padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <h3 style={{ marginTop: 0 }}>Add Publication Title</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Examples: "Tell Me More", "Applebees", etc.</p>
          <form onSubmit={handleCreate}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem' }}>Title Name:</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} required />
            </div>
            <button type="submit" className="btn btn-blue" disabled={uploading} style={{ width: '100%', padding: '0.75rem' }}>
              {uploading ? '...' : 'Add Title'}
            </button>
          </form>
        </div>

        <div>
           <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Publication Titles in {category.name}</h3>
           {loading ? <p>Loading...</p> : (
             <div style={{ display: 'grid', gap: '1rem' }}>
               {titles.map(t => (
                 <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                   <div style={{ fontWeight: '700' }}>{t.name}</div>
                   <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-blue btn-sm" style={{ fontWeight: '800' }} onClick={() => setSelectedTitle(t)}>
                        <i className="fas fa-tasks"></i> Manage Issues
                      </button>
                      <button className="btn btn-red btn-sm" onClick={() => handleDelete(t.id)}><i className="fas fa-trash"></i></button>
                   </div>
                 </div>
               ))}
               {titles.length === 0 && <p style={{ color: '#94a3b8' }}>No titles found.</p>}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default MagazineCategory;
