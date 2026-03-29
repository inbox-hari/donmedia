import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase-client';

import { optimizeImageUpload } from '../image-upload';
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

const SortableIssue = ({ issue, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: issue.id });
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
      <img src={issue.cover_url} alt="" width="40" height="54" style={{ width: '40px', height: '54px', objectFit: 'cover', borderRadius: '4px' }} />
      <div style={{ flexGrow: 1 }}>
        <div style={{ fontWeight: '700' }}>{issue.title}</div>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{issue.month} {issue.year}</div>
      </div>
      <button onClick={() => onDelete(issue.id, issue.cover_url, issue.pdf_url)} className="btn btn-red btn-sm"><i className="fas fa-trash"></i></button>
    </div>
  );
};

const MagazineIssueManager = ({ title, onBack }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', month: '', year: new Date().getFullYear().toString(), cover: null, pdf: null });

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('magazines').select('*').eq('magazine_title_id', title.id).order('position', { ascending: true });
      if (error) throw error;
      setIssues(data || []);
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { fetchIssues(); }, [title.id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.title || !form.cover || !form.pdf) return alert('All fields required');
    setUploading(true);
    try {
      const cleanTitle = title.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const optimizedCover = await optimizeImageUpload(form.cover, { maxWidth: 900, maxHeight: 1200, quality: 0.76 });
      const coverPath = `magazines/covers/${cleanTitle}/${Date.now()}_${optimizedCover.name}`;
      const pdfPath = `magazines/pdfs/${cleanTitle}/${Date.now()}_${form.pdf.name}`;
      await supabase.storage.from(BUCKET).upload(coverPath, optimizedCover);
      await supabase.storage.from(BUCKET).upload(pdfPath, form.pdf);
      const { data: { publicUrl: cUrl } } = supabase.storage.from(BUCKET).getPublicUrl(coverPath);
      const { data: { publicUrl: pUrl } } = supabase.storage.from(BUCKET).getPublicUrl(pdfPath);

      await supabase.from('magazines').insert([{
        title: form.title,
        month: form.month,
        year: parseInt(form.year),
        magazine_title_id: title.id,
        category_id: title.category_id,
        cover_url: cUrl,
        pdf_url: pUrl,
        position: issues.length + 1
      }]);
      setForm({ title: '', month: '', year: new Date().getFullYear().toString(), cover: null, pdf: null });
      fetchIssues();
    } catch (err) { alert(err.message); } finally { setUploading(false); }
  };

  const handleDelete = async (id, cUrl, pUrl) => {
    if (!confirm('Delete this issue?')) return;
    try {
      await supabase.from('magazines').delete().eq('id', id);
      const paths = [extractStoragePath(cUrl), extractStoragePath(pUrl)].filter(Boolean);
      if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
      fetchIssues();
    } catch (err) { alert(err.message); }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIdx = issues.findIndex(m => m.id === active.id);
      const newIdx = issues.findIndex(m => m.id === over.id);
      const newItems = arrayMove(issues, oldIdx, newIdx);
      setIssues(newItems);
      const updates = newItems.map((m, i) => ({ id: m.id, magazine_title_id: title.id, position: i + 1 }));
      try {
        await supabase.from('magazines').upsert(updates);
      } catch (err) { fetchIssues(); }
    }
  };

  return (
    <div className="issue-manager">
      <button onClick={onBack} className="btn btn-ghost" style={{ marginBottom: '1rem' }}>← Back to Titles</button>
      <h3 style={{ marginBottom: '2rem' }}>Managing Issues for: {title.name}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '3rem' }}>
        <div className="card" style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
          <h4>Upload New Issue</h4>
          <form onSubmit={handleUpload}>
             <input type="text" placeholder="Issue Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={{ width: '100%', marginBottom: '1rem', padding: '0.6rem' }} required />
             <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                <select value={form.month} onChange={e => setForm({...form, month: e.target.value})} style={{ flex: 1, padding: '0.6rem' }}>
                   <option value="">Month</option>
                   {['January','February','March','April','May','June','July','August', 'September','October','November','December'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <input type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} style={{ flex: 1, padding: '0.6rem' }} />
             </div>
             <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.4rem' }}>Cover Image</label>
             <input type="file" accept="image/*" onChange={e => setForm({...form, cover: e.target.files[0]})} style={{ marginBottom: '1rem' }} required />
             <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.4rem' }}>PDF File</label>
             <input type="file" accept="application/pdf" onChange={e => setForm({...form, pdf: e.target.files[0]})} style={{ marginBottom: '1.5rem' }} required />
             <button type="submit" className="btn btn-green" style={{ width: '100%' }} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Issue'}</button>
          </form>
        </div>
        <div>
           <h4>Current Issues</h4>
           <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={issues.map(i => i.id)} strategy={verticalListSortingStrategy}>
                 {issues.map(issue => <SortableIssue key={issue.id} issue={issue} onDelete={handleDelete} />)}
              </SortableContext>
           </DndContext>
           {issues.length === 0 && <p style={{ color: '#94a3b8' }}>No issues found.</p>}
        </div>
      </div>
    </div>
  );
};

export default MagazineIssueManager;
