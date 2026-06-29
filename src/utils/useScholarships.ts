import { useState, useCallback, useEffect } from 'react';
import { FinanceService, type Scholarship } from '../services/finance';
import { ApiError } from '../lib/api';

export function useScholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const loadScholarships = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await FinanceService.listScholarships({
        type: filterType || undefined,
        status: filterStatus || undefined,
      });
      setScholarships(res.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load scholarships.');
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus]);

  useEffect(() => {
    loadScholarships();
  }, [loadScholarships]);

  const deleteScholarship = async (id: number) => {
    if (!confirm('Delete this scholarship?')) return;
    try {
      await FinanceService.deleteScholarship(id);
      loadScholarships();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to delete scholarship.');
    }
  };

  return {
    scholarships, loading, error,
    filterType, setFilterType,
    filterStatus, setFilterStatus,
    loadScholarships, deleteScholarship
  };
}