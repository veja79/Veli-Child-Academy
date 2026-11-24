import { useEffect, useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';

export default function AdminLogin() {
  const { session, login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'Log in · Veli admin';
  }, []);

  if (session) return <Navigate to="/admin" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="card form admin-login__card" onSubmit={onSubmit}>
        <img src="/logo.png" alt="Veli Child Academy" className="admin-login__logo" width="90" height="92" />
        <h1>Staff login</h1>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required autoFocus />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        {error && <p className="notice notice--error" role="alert">{error}</p>}
        <button className="btn btn--sun" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        <a href="/" className="admin-login__back">← Back to the website</a>
      </form>
    </div>
  );
}
