import { useState, useCallback, useEffect } from 'react';
import { FinanceService, type Payment } from '../services/finance';
import { ApiError } from '../lib/api';

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const loadPayments = useCallback(async (page = 1) => {
    setLoading(true); setError('');
    try {
      const res = await FinanceService.listPayments({
        search: search || undefined,
        status: filterStatus || undefined,
        type: filterType || undefined,
        page,
        limit: pagination.limit,
      });
      setPayments(res.data);
      setPagination(res.pagination);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load payments.');
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterType, pagination.limit]);

  useEffect(() => {
    loadPayments(1);
  }, [loadPayments]);

  const deletePayment = async (id: string) => {
    if (!confirm(`Delete payment ${id}?`)) return;
    try {
      await FinanceService.deletePayment(id);
      loadPayments(pagination.page);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to delete payment.');
    }
  };

  return { 
    payments, pagination, loading, error, 
    search, setSearch, 
    filterStatus, setFilterStatus, 
    filterType, setFilterType, 
    loadPayments, deletePayment 
  };
}