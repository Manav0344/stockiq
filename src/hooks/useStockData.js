import { useState, useEffect, useCallback } from 'react';
import { fetchHistory } from '../services/api';

export function useStockChart(symbol, filter) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchHistory(symbol, filter);
      setData(result || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [symbol, filter]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}
