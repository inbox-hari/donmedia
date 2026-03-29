import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from './supabase-client';
import MagazineCategory from './components/MagazineCategory';

import { optimizeImageUpload } from './image-upload';

// DND Kit Imports
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

// Sortable Category Item Component
const SortableCategory = ({ category, onEdit, onDelete, onManage }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1.25rem 1.5rem',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    marginBottom: '1.2rem',
    boxShadow: isDragging ? '0 12px 24px rgba(0,0,0,0.12)' : '0 4px 6px rgba(0,0,0,0.02)',
    zIndex: isDragging ? 100 : 1,
    position: 'relative',
    transition: 'all 0.2s ease-out'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners} style={{ cursor: 'grab', color: '#cbd5e1', padding: '0.6rem' }}>
        <i className="fas fa-grip-vertical"></i>
      </div>

      {category.cover_url ? (
        <img src={category.cover_url} alt="" width="60" height="60" style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover', background: '#f8fafc' }} />
      ) : (
        <div style={{ width: '60px', height: '60px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
          <i className="fas fa-image" style={{ fontSize: '1.2rem' }}></i>
        </div>
      )}

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.15rem' }}>{category.name}</div>
        <div style={{ fontSize: '0.85rem', color: '#64748b', opacity: 0.9, maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {category.description || 'View all publications and issues.'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-blue btn-sm" onClick={() => onManage(category)} style={{ padding: '8px 16px' }}>
          <i className="fas fa-tasks"></i> Manage
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(category)}>
          <i className="fas fa-edit"></i>
        </button>
        <button className="btn btn-red btn-sm" onClick={() => onDelete(category.id, category.cover_url)}>
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

const MagazinesAdmin = () => {
  const [currentCats, setCurrentCats] = useState([]);
  const [oldCats, setOldCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ name: '', cover: null, description: '', type: 'current' });
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('position', { ascending: true });
      if (error) throw error;
      const cats = data || [];
      setCurrentCats(cats.filter(c => c.type === 'current'));
      setOldCats(cats.filter(c => !c.type || c.type === 'old'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name) return alert('Category Name is required');
    setUploading(true);
    try {
      let cover_url = null;
      if (form.cover) {
        const optimizedCover = await optimizeImageUpload(form.cover, { maxWidth: 900, maxHeight: 1200, quality: 0.76 });
        const path = `categories/covers/${Date.now()}_${optimizedCover.name}`;
        await supabase.storage.from(BUCKET).upload(path, optimizedCover);
        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
        cover_url = publicUrl;
      }

      if (editingId) {
        const updates = { name: form.name, description: form.description, type: form.type };
        if (cover_url) updates.cover_url = cover_url;
        await supabase.from('categories').update(updates).eq('id', editingId);
        setEditingId(null);
      } else {
        const listLen = form.type === 'current' ? currentCats.length : oldCats.length;
        await supabase.from('categories').insert([{
          name: form.name,
          description: form.description,
          cover_url,
          type: form.type,
          position: listLen + 1
        }]);
      }
      setForm({ name: '', cover: null, description: '', type: 'current' });
      e.target.reset();
      fetchCategories();
    } catch (err) { alert(err.message); } finally { setUploading(false); }
  };

  const onDragEnd = async (event, sectionType) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const isCurrent = sectionType === 'current';
      const items = isCurrent ? currentCats : oldCats;
      const oldIdx = items.findIndex(c => c.id === active.id);
      const newIdx = items.findIndex(c => c.id === over.id);
      const newItems = arrayMove(items, oldIdx, newIdx);

      if (isCurrent) setCurrentCats(newItems); else setOldCats(newItems);

      const updates = newItems.map((item, index) => ({
        id: item.id,
        name: item.name,
        cover_url: item.cover_url,
        description: item.description,
        type: item.type,
        position: index + 1
      }));

      try {
        const { error } = await supabase.from('categories').upsert(updates);
        if (error) throw error;
      } catch (err) { fetchCategories(); }
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, cover: null, description: cat.description || '', type: cat.type || 'old' });
    setEditingId(cat.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, coverUrl) => {
    if (!confirm('Delete this category?')) return;
    try {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    } catch (err) { alert(err.message); }
  };

  if (selectedCategory) {
    return (
      <div className="admin-inner-view">
        <button onClick={() => setSelectedCategory(null)} className="btn btn-ghost" style={{ marginBottom: '1.5rem', fontWeight: '800' }}>
          <i className="fas fa-arrow-left"></i> Back to Categories
        </button>
        <header style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#1e3a8a', fontSize: '2rem', margin: 0 }}>Managing: {selectedCategory.name}</h2>
          <p style={{ color: '#64748b' }}>Configure publications and issues for this category.</p>
        </header>
        <MagazineCategory category={selectedCategory} />
      </div>
    );
  }

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i> Loading...</div>;

  return (
    <div className="admin-magazines-page">
      <header style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#1e3a8a', fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Magazine Management</h2>
        <p style={{ color: '#64748b' }}>Organize your publications into Current and Old sections.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '4rem', alignItems: 'start' }}>

        <div className="card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'sticky', top: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Category' : 'Add New Category'}</h3>
          <form onSubmit={handleCreate}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem' }}>Category Name:</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem' }}>Section:</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <option value="current">Current Magazine</option>
                <option value="old">Old Magazine</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem' }}>Cover Image:</label>
              <input type="file" accept="image/*" onChange={e => setForm({ ...form, cover: e.target.files[0] })} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className={`btn ${editingId ? 'btn-green' : 'btn-blue'}`} disabled={uploading} style={{ flexGrow: 1 }}>
                {uploading ? '...' : (editingId ? 'Update' : 'Add Category')}
              </button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', cover: null, description: '', type: 'current' }); }} className="btn btn-ghost">Cancel</button>}
            </div>
          </form>
        </div>

        <div>
          {/* Section 1: CURRENT */}
          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '2px solid #ecfdf5', paddingBottom: '0.5rem' }}>
              <i className="fas fa-check-circle"></i> Current Magazines
            </h3>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => onDragEnd(e, 'current')}>
              <SortableContext items={currentCats.map(c => c.id)} strategy={verticalListSortingStrategy}>
                {currentCats.map(cat => <SortableCategory key={cat.id} category={cat} onEdit={handleEdit} onDelete={handleDelete} onManage={setSelectedCategory} />)}
              </SortableContext>
            </DndContext>
            {currentCats.length === 0 && <div className="empty-msg" style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #e2e8f0', color: '#94a3b8' }}>No current editions.</div>}
          </div>

          {/* Section 2: OLD */}
          <div>
            <h3 style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              <i className="fas fa-history"></i> Old Magazines
            </h3>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => onDragEnd(e, 'old')}>
              <SortableContext items={oldCats.map(c => c.id)} strategy={verticalListSortingStrategy}>
                {oldCats.map(cat => <SortableCategory key={cat.id} category={cat} onEdit={handleEdit} onDelete={handleDelete} onManage={setSelectedCategory} />)}
              </SortableContext>
            </DndContext>
            {oldCats.length === 0 && <div className="empty-msg" style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #e2e8f0', color: '#94a3b8' }}>No old editions. (Try adding Applebees, Tell Me More, etc.)</div>}
          </div>
        </div>

      </div>
    </div>
  );
};

const root = document.getElementById('admin-dashboard-root');
if (root) createRoot(root).render(<MagazinesAdmin />);
