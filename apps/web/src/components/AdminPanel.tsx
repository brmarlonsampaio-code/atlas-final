'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, X, Lock, Trash2, Plus, FileUp, Loader2 } from 'lucide-react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Category = { id: string; name: string; color: string; icon: string };
type EntityRow = {
  id: string; title: string; subtitle: string | null; period: string | null;
  country: string | null; author: string | null; category_name: string | null;
};

const EMPTY_FORM = {
  title: '', subtitle: '', categoryId: '', categoryName: '', categoryColor: '#6B7280', categoryIcon: '📍',
  latitude: '', longitude: '', summary: '', description: '', author: '', century: '', period: '',
  year: '', documentType: '', theme: '', country: '', region: '', culture: '',
  sourceArchive: '', sourceUrl: '', bibliography: '', notes: '',
};

function useAdminKey() {
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    setKey(sessionStorage.getItem('admin_api_key'));
  }, []);
  const save = (k: string) => {
    sessionStorage.setItem('admin_api_key', k);
    setKey(k);
  };
  const clear = () => {
    sessionStorage.removeItem('admin_api_key');
    setKey(null);
  };
  return { key, save, clear };
}

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { key, save, clear } = useAdminKey();
  const [keyInput, setKeyInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [entities, setEntities] = useState<EntityRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [geoFile, setGeoFile] = useState<File | null>(null);

  async function authedFetch(path: string, options: RequestInit = {}) {
    const res = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: { ...(options.headers || {}), 'x-admin-key': key || '' },
    });
    if (res.status === 401) {
      clear();
      setAuthError('Chave inválida ou expirada. Entre novamente.');
      throw new Error('unauthorized');
    }
    return res;
  }

  async function loadData() {
    if (!key) return;
    setLoading(true);
    try {
      const [entRes, catRes] = await Promise.all([
        authedFetch('/admin/entities'),
        fetch(`${apiUrl}/categories`),
      ]);
      setEntities(await entRes.json());
      setCategories(await catRes.json());
    } catch {
      // erro de auth já tratado em authedFetch
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen && key) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, key]);

  async function handleLoginTest() {
    setAuthError('');
    try {
      const res = await fetch(`${apiUrl}/admin/entities`, {
        headers: { 'x-admin-key': keyInput },
      });
      if (res.status === 401) {
        setAuthError('Chave incorreta.');
        return;
      }
      if (!res.ok) {
        setAuthError('Não foi possível conectar ao backend. Ele está rodando?');
        return;
      }
      save(keyInput);
      setKeyInput('');
    } catch {
      setAuthError('Não foi possível conectar ao backend (ele está rodando em ' + apiUrl + '?).');
    }
  }

  async function handleCreateEntity(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const lat = parseFloat(form.latitude);
    const lng = parseFloat(form.longitude);
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'Título é obrigatório.' });
      return;
    }
    if (isNaN(lat) || isNaN(lng)) {
      setMessage({ type: 'error', text: 'Latitude e longitude precisam ser números válidos.' });
      return;
    }

    setLoading(true);
    try {
      const res = await authedFetch('/admin/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, latitude: lat, longitude: lng }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao criar entidade.');
      setMessage({ type: 'ok', text: `Local "${form.title}" criado com sucesso (id: ${data.id}).` });
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao criar entidade.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(`Remover "${id}" e todos os vínculos (documentos, tags, rotas)? Isso não pode ser desfeito.`)) return;
    setLoading(true);
    try {
      const res = await authedFetch(`/admin/entities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao remover.');
      setMessage({ type: 'ok', text: `"${id}" removido.` });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao remover.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleGeoJSONUpload() {
    if (!geoFile) return;
    setMessage(null);
    setLoading(true);
    try {
      const body = new FormData();
      body.append('file', geoFile);
      const res = await authedFetch('/admin/upload-geojson', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro na importação.');
      setMessage({
        type: 'ok',
        text: `Importação concluída: ${data.imported}/${data.featuresCount} entidades importadas.` +
          (data.errors?.length ? ` ${data.errors.length} com erro (veja console).` : ''),
      });
      if (data.errors?.length) console.warn('Erros na importação GeoJSON:', data.errors);
      setGeoFile(null);
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro na importação.' });
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-24 right-6 z-20 bg-black/40 backdrop-blur-xl border border-white/10 p-3 rounded-full text-zinc-400 hover:text-red-400 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        title="Área Administrativa (Backoffice)"
      >
        <Lock className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] max-h-[85vh] overflow-y-auto bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-6 z-50 pointer-events-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Database className="text-red-400 w-6 h-6" />
                <h2 className="text-xl font-bold text-white">Backoffice Científico</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!key ? (
              <div className="space-y-3">
                <p className="text-sm text-zinc-400">
                  Digite a chave de administrador (a mesma do <code className="text-zinc-300">ADMIN_API_KEY</code> no <code className="text-zinc-300">.env</code> do backend).
                </p>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLoginTest()}
                  placeholder="Chave de administrador"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-red-400/50"
                />
                {authError && <p className="text-xs text-red-400">{authError}</p>}
                <button
                  onClick={handleLoginTest}
                  className="w-full bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500/40 transition-colors"
                >
                  Entrar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {message && (
                  <div className={`text-xs px-3 py-2 rounded-lg border ${message.type === 'ok' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {message.text}
                  </div>
                )}

                {!showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Adicionar novo local
                  </button>
                ) : (
                  <form onSubmit={handleCreateEntity} className="space-y-2 border border-white/10 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <input required placeholder="Título *" value={form.title} onChange={(e) => updateField('title', e.target.value)} className="admin-input col-span-2" />
                      <input placeholder="Subtítulo" value={form.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} className="admin-input col-span-2" />
                      <input required placeholder="Latitude *" value={form.latitude} onChange={(e) => updateField('latitude', e.target.value)} className="admin-input" />
                      <input required placeholder="Longitude *" value={form.longitude} onChange={(e) => updateField('longitude', e.target.value)} className="admin-input" />

                      <select
                        value={form.categoryId}
                        onChange={(e) => {
                          const cat = categories.find((c) => c.id === e.target.value);
                          updateField('categoryId', e.target.value);
                          if (cat) { updateField('categoryColor', cat.color); updateField('categoryIcon', cat.icon); }
                        }}
                        className="admin-input col-span-2"
                      >
                        <option value="">— Sem categoria —</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                        ))}
                      </select>
                      {!form.categoryId && (
                        <input placeholder="Ou nova categoria (id, ex: 'igrejas')" value={form.categoryName} onChange={(e) => { updateField('categoryId', e.target.value.toLowerCase().replace(/\s+/g, '-')); updateField('categoryName', e.target.value); }} className="admin-input col-span-2" />
                      )}

                      <textarea placeholder="Resumo" value={form.summary} onChange={(e) => updateField('summary', e.target.value)} className="admin-input col-span-2 h-16" />
                    </div>

                    <button type="button" onClick={() => setShowMoreFields((v) => !v)} className="text-xs text-zinc-400 hover:text-white underline">
                      {showMoreFields ? 'Ocultar campos adicionais' : 'Mostrar mais campos (autor, período, bibliografia...)'}
                    </button>

                    {showMoreFields && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                        <input placeholder="Autor" value={form.author} onChange={(e) => updateField('author', e.target.value)} className="admin-input" />
                        <input placeholder="Século" value={form.century} onChange={(e) => updateField('century', e.target.value)} className="admin-input" />
                        <input placeholder="Período" value={form.period} onChange={(e) => updateField('period', e.target.value)} className="admin-input" />
                        <input placeholder="Data" value={form.year} onChange={(e) => updateField('year', e.target.value)} className="admin-input" />
                        <input placeholder="Tipo documental" value={form.documentType} onChange={(e) => updateField('documentType', e.target.value)} className="admin-input" />
                        <input placeholder="Tema" value={form.theme} onChange={(e) => updateField('theme', e.target.value)} className="admin-input" />
                        <input placeholder="País" value={form.country} onChange={(e) => updateField('country', e.target.value)} className="admin-input" />
                        <input placeholder="Região" value={form.region} onChange={(e) => updateField('region', e.target.value)} className="admin-input" />
                        <input placeholder="Cultura" value={form.culture} onChange={(e) => updateField('culture', e.target.value)} className="admin-input col-span-2" />
                        <input placeholder="Arquivo de origem" value={form.sourceArchive} onChange={(e) => updateField('sourceArchive', e.target.value)} className="admin-input col-span-2" />
                        <input placeholder="Link da fonte" value={form.sourceUrl} onChange={(e) => updateField('sourceUrl', e.target.value)} className="admin-input col-span-2" />
                        <textarea placeholder="Bibliografia" value={form.bibliography} onChange={(e) => updateField('bibliography', e.target.value)} className="admin-input col-span-2 h-14" />
                        <textarea placeholder="Observações" value={form.notes} onChange={(e) => updateField('notes', e.target.value)} className="admin-input col-span-2 h-14" />
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button type="submit" disabled={loading} className="flex-1 bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500/40 transition-colors disabled:opacity-50">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Salvar no banco'}
                      </button>
                      <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white">
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-zinc-400 mb-2">Importar vários pontos de uma vez (GeoJSON FeatureCollection, cada feature precisa de <code>properties.title</code>):</p>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".json,.geojson,application/geo+json,application/json"
                      onChange={(e) => setGeoFile(e.target.files?.[0] || null)}
                      className="flex-1 text-xs text-zinc-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-white/10 file:text-white file:text-xs"
                    />
                    <button
                      onClick={handleGeoJSONUpload}
                      disabled={!geoFile || loading}
                      className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white disabled:opacity-40 transition-colors"
                    >
                      <FileUp className="w-3.5 h-3.5" /> Importar
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-zinc-400 mb-2">{entities.length} local(is) cadastrado(s):</p>
                  <div className="max-h-52 overflow-y-auto space-y-1">
                    {entities.map((ent) => (
                      <div key={ent.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-xs">
                        <div className="min-w-0">
                          <p className="text-white truncate">{ent.title}</p>
                          <p className="text-zinc-500 truncate">{ent.category_name || 'sem categoria'} · {ent.period || '—'} · {ent.country || '—'}</p>
                        </div>
                        <button onClick={() => handleDelete(ent.id)} className="text-zinc-500 hover:text-red-400 shrink-0 ml-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {entities.length === 0 && !loading && (
                      <p className="text-xs text-zinc-600 italic">Nenhum local cadastrado ainda.</p>
                    )}
                  </div>
                </div>

                <button onClick={clear} className="text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-widest">
                  Sair
                </button>
              </div>
            )}

            <style jsx>{`
              .admin-input {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 0.5rem;
                padding: 0.5rem 0.75rem;
                color: white;
                font-size: 0.8rem;
                outline: none;
              }
              .admin-input:focus {
                border-color: rgba(248,113,113,0.5);
              }
              .admin-input::placeholder {
                color: rgba(255,255,255,0.3);
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
