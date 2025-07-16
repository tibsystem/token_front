
import { useEffect, useState } from 'react';
import { getRaisers } from '@/services/raisers/getRaisers';

export default function UseOptionsSelect() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRaisers() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRaisers();
        const opts = data.map((raiser) => ({
          value: raiser.id,
          label: raiser.name,
        }));
        setOptions(opts);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRaisers();
  }, []);

  return { options, loading, error };
}