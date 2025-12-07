import { useAuth } from '../contexts/auth';
import { useEffect, useState } from 'react';
import * as klantApi from '../api/klant';

export default function DebugUser() {
  const { user, token } = useAuth();
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (user?.klantID) {
        try {
          const data = await klantApi.getKlantById(user.klantID);
          setApiData(data);
        } catch (err) {
          setError(err.message || err);
        }
      }
    }
    fetchData();
  }, [user]);

  return (
    <div style={{ background: '#eee', padding: 16, margin: 16 }}>
      <h3>Debug User Context</h3>
      <pre>user (context): {JSON.stringify(user, null, 2)}</pre>
      <pre>token: {token}</pre>
      <pre>API /api/klanten/:id: {JSON.stringify(apiData, null, 2)}</pre>
      {error && <pre style={{ color: 'red' }}>API error: {error}</pre>}
    </div>
  );
}
