import { useEffect, useState } from 'react';
import api from '../../api/axios';

export function Dashboard() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/test')
      .then(res => setMessage(res.data.message))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div>
      <h1>{message || 'Loading...'}</h1>
    </div>
  );
}