import { useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { StudentFinanceView } from '../components/finance/StudentFinanceView';
import { FinanceDashboard } from '../components/finance/FinanceDashboard';
import { PaymentsTable } from '../components/finance/PaymentsTable';
import { ScholarshipsTable } from '../components/finance/ScholarshipsTable';
import { CreateInvoiceForm } from '../components/finance/CreateInvoiceForm';
import { CreateScholarshipForm } from '../components/finance/CreateScholarshipForm';

export function UniFinance() {
  const { user } = useAuth();
  const isAdmin  = user?.role === 'Admin';
  const isStudent = user?.role === 'Student';

  const defaultTab = isStudent ? 'my-finance' : 'dashboard';
  const [tab, setTab] = useState(defaultTab);

  const tabs = [
    ...(isStudent  ? [{ id:'my-finance',   label:'My Finance' }]          : []),
    ...(!isStudent ? [{ id:'dashboard',    label:'Revenue Dashboard' }]    : []),
    ...(!isStudent ? [{ id:'payments',     label:'Payments' }]             : []),
    ...(!isStudent ? [{ id:'scholarships', label:'Scholarships' }]         : []),
    ...(isAdmin    ? [{ id:'invoice',      label:'New Invoice' }]          : []),
    ...(isAdmin    ? [{ id:'add-scholarship', label:'Award Scholarship' }] : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Finance & Payments</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Academic Year 2025–2026 · Financial Management</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm border hover:bg-muted"><Download size={15} /> Export</button>
            <button onClick={() => setTab('invoice')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}><Plus size={15} /> New Invoice</button>
          </div>
        )}
      </div>

      <div className="flex gap-1 p-1 rounded-xl w-fit flex-wrap" style={{ background: 'var(--muted)' }}>
        {tabs.map(t => (
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

      <div className="mt-6">
        {tab === 'my-finance' && user?.studentId && <StudentFinanceView studentId={user.studentId} />}
        {tab === 'dashboard' && <FinanceDashboard />}
        {tab === 'payments' && <PaymentsTable isAdmin={isAdmin} />}
        {tab === 'scholarships' && <ScholarshipsTable isAdmin={isAdmin} />}
        {tab === 'invoice' && isAdmin && <CreateInvoiceForm />}
        {tab === 'add-scholarship' && isAdmin && <CreateScholarshipForm />}
      </div>
    </div>
  );
}