import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { FinanceService, type Payment } from '../../../services/finance';
import { ApiError } from '../../../lib/api';
import { ErrorBanner } from '../../../utils/financeUtils';

export function UpdatePaymentModal({ payment, onClose, onUpdated }: { payment: Payment; onClose: () => void; onUpdated: () => void; }) {
  const [status, setStatus] = useState(payment.Status);
  const [method, setMethod] = useState(payment.Method ?? '');
  const [payDate, setPayDate] = useState(payment.PaymentDate?.slice(0, 10) ?? '');
  const [amount, setAmount] = useState(String(payment.Amount));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    setSaving(true); setError('');
    try {
      await FinanceService.updatePayment(payment.PaymentID, {
        status, method: method || undefined, payment_date: payDate || undefined, amount: Number(amount) || undefined,
      });
      onUpdated();
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to update payment.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="text-foreground">Update Payment</h3>
            <p className="text-muted-foreground text-xs">{payment.PaymentID}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {error && <ErrorBanner message={error} />}
          <div>
            <label className="text-sm text-foreground block mb-1.5">Amount ($)</label>
            <input type="number" min={0} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-input text-foreground outline-none" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-foreground block mb-1.5">Status</label>
            <select className="w-full rounded-xl px-3 py-2.5 text-sm border bg-input text-foreground outline-none" value={status} onChange={e => setStatus(e.target.value as Payment['Status'])}>
              {['Paid', 'Pending', 'Overdue'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-foreground block mb-1.5">Payment Method</label>
            <select className="w-full rounded-xl px-3 py-2.5 text-sm border bg-input text-foreground outline-none" value={method} onChange={e => setMethod(e.target.value)}>
              <option value="">— Select —</option>
              {['Bank Transfer', 'Online Portal', 'Cash', 'Card', 'Mobile Money'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-foreground block mb-1.5">Payment Date</label>
            <input type="date" className="w-full rounded-xl px-3 py-2.5 text-sm border bg-input text-foreground outline-none" value={payDate} onChange={e => setPayDate(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} disabled={saving} className="flex-1 rounded-xl py-2.5 text-sm font-medium border text-foreground hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}>Cancel</button>
          <button onClick={save} disabled={saving} className="flex-1 rounded-xl py-2.5 text-sm font-medium text-white flex items-center justify-center gap-2" style={{ background: 'var(--primary)' }}>
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}