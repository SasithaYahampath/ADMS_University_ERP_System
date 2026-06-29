import { useState, useCallback, useEffect } from 'react';
import { FinanceService, type FinanceSummary, type MonthlyRevenue } from '../services/finance';
import { ApiError } from '../lib/api';

export function useFinanceDashboard() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [sumRes, monRes] = await Promise.all([
        FinanceService.summary(),
        FinanceService.monthlyRevenue(),
      ]);
      setSummary(sumRes.data);
      setMonthly(monRes.data.map(m => ({
        ...m,
        TotalRevenue: Number(m.Tuition) + Number(m.Hostel) + Number(m.Library) + Number(m.Other),
      })));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return { summary, monthly, loading, error, loadDashboard };
}