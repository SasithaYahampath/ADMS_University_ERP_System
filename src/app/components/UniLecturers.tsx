import { useState, useEffect, useCallback } from 'react';
import { Plus, Users, Award, Star, BarChart3 } from 'lucide-react';
import { LecturerService, type Lecturer } from '../../services/lecturer';
import { ApiError } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { LecturerDrawer } from '../components/lecturers/Lecturerdrawer';
import { LecturerListTab, PER_PAGE } from '../components/lecturers/LecturerListTab';
import { AssignmentsTab } from '../components/lecturers/AssignmentsTab';
import { AnalyticsTab } from '../components/lecturers/AnalyticsTab';
import { RegisterRedirectTab } from '../components/lecturers/RegisterRedirectTab';

export function UniLecturers({ activeTab, onNavigate }: { activeTab: string; onNavigate?: (view: string) => void }) {
  const { user } = useAuth();
  const isAdmin  = user?.role === 'Admin';

  const [tab, setTab]             = useState(activeTab === 'lecturers-assignments' ? 'assignments' : 'list');
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [selected, setSelected]   = useState<{ lecturer: Lecturer; idx: number } | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await LecturerService.listLecturers();
      setLecturers(res.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load lecturers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'list' || tab === 'assignments' || tab === 'analytics') load();
  }, [tab, load]);

  const filtered = lecturers.filter(l => {
    const q = search.toLowerCase();
    return !q || l.Name.toLowerCase().includes(q) || l.LecturerID.toLowerCase().includes(q) || l.Department.toLowerCase().includes(q);
  });

  const pages     = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalPublications = lecturers.reduce((a, l) => a + (Number(l.Publications) || 0), 0);
  const avgRating = lecturers.length
    ? (lecturers.reduce((a, l) => a + (Number(l.Rating) || 0), 0) / lecturers.filter(l => l.Rating).length).toFixed(2)
    : '—';
  const professorCount = lecturers.filter(l => l.Rank === 'Professor').length;

  function handleSelect(lecturer: Lecturer, idx: number) {
    setSelected({ lecturer, idx });
  }

  return (
    <div className="space-y-6">
      {selected && (
        <LecturerDrawer
          lecturer={selected.lecturer}
          colorIdx={selected.idx}
          isAdmin={isAdmin}
          onClose={() => setSelected(null)}
          onDeleted={() => { load(); setSelected(null); }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Lecturer Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {loading ? 'Loading…' : `${lecturers.length} lecturers · ${professorCount} professors`}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => onNavigate ? onNavigate('user-management') : setTab('register')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'var(--primary)' }}>
            <Plus size={15} /> Add Lecturer
          </button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Lecturers',   value: loading ? '—' : lecturers.length,       icon: <Users size={18} />,    color: '#3b5bdb', bg: '#eef2ff' },
          { label: 'Professors',        value: loading ? '—' : professorCount,          icon: <Award size={18} />,    color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Avg Student Rating',value: loading ? '—' : avgRating,              icon: <Star size={18} />,     color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Total Publications',value: loading ? '—' : totalPublications.toLocaleString(), icon: <BarChart3 size={18} />, color: '#10b981', bg: '#ecfdf5' },
        ].map(m => (
          <div key={m.label} className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
            <div className="p-2.5 rounded-xl shrink-0" style={{ background: m.bg }}>
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">{m.label}</div>
              <div className="text-foreground font-semibold mt-0.5" style={{ fontSize: 18 }}>{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit flex-wrap" style={{ background: 'var(--muted)' }}>
        {[
          { id: 'list',        label: 'All Lecturers' },
          { id: 'assignments', label: 'Assignments' },
          { id: 'analytics',   label: 'Analytics' },
          ...(isAdmin ? [{ id: 'register', label: 'Register' }] : []),
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? 'var(--card)' : 'transparent',
              color:      tab === t.id ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow:  tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'list' && (
        <LecturerListTab
          lecturers={lecturers}
          filtered={filtered}
          paginated={paginated}
          loading={loading}
          error={error}
          search={search}
          page={page}
          pages={pages}
          onSearchChange={v => { setSearch(v); setPage(1); }}
          onPageChange={setPage}
          onSelect={handleSelect}
          onRetry={load}
        />
      )}

      {tab === 'assignments' && (
        <AssignmentsTab
          lecturers={lecturers}
          loading={loading}
          error={error}
          onSelect={handleSelect}
          onRetry={load}
        />
      )}

      {tab === 'analytics' && (
        <AnalyticsTab lecturers={lecturers} loading={loading} />
      )}

      {tab === 'register' && isAdmin && (
        <RegisterRedirectTab onNavigate={onNavigate} />
      )}
    </div>
  );
}