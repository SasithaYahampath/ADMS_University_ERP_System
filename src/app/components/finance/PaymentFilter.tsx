import { Search, X } from 'lucide-react';

interface Props {
  search: string; setSearch: (v: string) => void;
  filterType: string; setFilterType: (v: string) => void;
  filterStatus: string; setFilterStatus: (v: string) => void;
}

export function PaymentFilters({ search, setSearch, filterType, setFilterType, filterStatus, setFilterStatus }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card" style={{ borderColor: 'var(--border)' }}>
        <Search size={15} className="text-muted-foreground shrink-0" />
        <input placeholder="Search by student name, ID, or payment ID…" className="flex-1 bg-transparent text-sm outline-none text-foreground" value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button onClick={() => setSearch('')} className="text-muted-foreground"><X size={13} /></button>}
      </div>
      <select className="rounded-xl px-3 py-2.5 text-sm border bg-card outline-none" value={filterType} onChange={e => setFilterType(e.target.value)}>
        <option value="">All Types</option>
        {['Tuition','Hostel','Library','Other'].map(t => <option key={t}>{t}</option>)}
      </select>
      <select className="rounded-xl px-3 py-2.5 text-sm border bg-card outline-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
        <option value="">All Statuses</option>
        {['Paid','Pending','Overdue'].map(s => <option key={s}>{s}</option>)}
      </select>
    </div>
  );
}