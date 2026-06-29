import { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePayments } from '../../../utils/usePayments';
import { PaymentFilters } from './PaymentFilter';
import { UpdatePaymentModal } from './UpdatePaymentModal';
import { fmt, payStatusBadge, SkeletonRows, ErrorBanner } from '../../../utils/financeUtils';
import type { Payment } from '../../../services/finance';

export function PaymentsTable({ isAdmin }: { isAdmin: boolean }) {
  const { payments, pagination, loading, error, search, setSearch, filterStatus, setFilterStatus, filterType, setFilterType, loadPayments, deletePayment } = usePayments();
  const [editPayment, setEditPayment] = useState<Payment | null>(null);

  return (
    <div className="space-y-6">
      {editPayment && <UpdatePaymentModal payment={editPayment} onClose={() => setEditPayment(null)} onUpdated={() => loadPayments(pagination.page)} />}
      {error && <ErrorBanner message={error} onRetry={() => loadPayments(pagination.page)} />}
      <PaymentFilters search={search} setSearch={setSearch} filterType={filterType} setFilterType={setFilterType} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {['Payment ID','Student','Type','Amount','Semester','Date','Method','Status',isAdmin ? 'Actions' : ''].filter(Boolean).map(h => (
                  <th key={h as string} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <SkeletonRows cols={isAdmin ? 9 : 8} /> : payments.length === 0 ? (
                  <tr><td colSpan={9} className="px-5 py-12 text-center text-muted-foreground text-sm">No payments found.</td></tr>
              ) : payments.map(p => (
                <tr key={p.PaymentID} className="border-t hover:bg-muted/30">
                  <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{p.PaymentID}</td>
                  <td className="px-5 py-3.5"><div className="text-sm font-medium">{p.StudentName}</div><div className="text-muted-foreground font-mono text-xs">{p.StudentID}</div></td>
                  <td className="px-5 py-3.5 text-sm">{p.Type}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold">{fmt(Number(p.Amount))}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.Semester ?? '—'}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.PaymentDate?.slice(0,10) ?? '—'}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.Method ?? '—'}</td>
                  <td className="px-5 py-3.5">{payStatusBadge(p.Status)}</td>
                  {isAdmin && (
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => setEditPayment(p)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><Edit2 size={13} /></button>
                        <button onClick={() => deletePayment(p.PaymentID)} className="p-1.5 rounded-lg hover:bg-muted text-red-500"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            {loading ? 'Loading…' : `${pagination.total} total · page ${pagination.page} of ${pagination.pages}`}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => loadPayments(pagination.page - 1)} disabled={pagination.page <= 1 || loading} className="p-1.5 text-muted-foreground disabled:opacity-40"><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => loadPayments(p)} className="w-8 h-8 rounded-lg text-sm" style={{ background: p === pagination.page ? 'var(--primary)' : 'transparent', color: p === pagination.page ? '#fff' : 'var(--muted-foreground)' }}>{p}</button>
            ))}
            <button onClick={() => loadPayments(pagination.page + 1)} disabled={pagination.page >= pagination.pages || loading} className="p-1.5 text-muted-foreground disabled:opacity-40"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}