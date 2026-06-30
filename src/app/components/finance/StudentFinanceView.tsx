import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Clock, Award } from 'lucide-react';
import { FinanceService, type Payment, type Scholarship } from '../../../services/finance';
import { ApiError } from '../../../lib/api';
import { fmt, payStatusBadge, scholarshipBadge, ErrorBanner } from '../../../utils/financeUtils';

export function StudentFinanceView({ studentId }: { studentId: string }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([FinanceService.studentPayments(studentId), FinanceService.studentScholarships(studentId)])
      .then(([p, s]) => { setPayments(p.data); setScholarships(s.data); })
      .catch(e => setError(e instanceof ApiError ? e.message : 'Failed to load finance data.'))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-muted-foreground" /></div>;
  if (error) return <ErrorBanner message={error} />;

  // Render logic remains identical to your original code block...
  return <div>{/* Your original Student layout here */}</div>;
}