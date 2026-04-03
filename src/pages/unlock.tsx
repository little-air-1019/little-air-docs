import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import styles from './unlock.module.css';

export default function UnlockPage(): React.ReactElement {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState('/docs/notes');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('redirect');
    if (r && r.startsWith('/docs/notes')) {
      setRedirect(r);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, redirect }),
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = data.redirect;
      } else {
        setError('密碼錯誤，請再試一次。');
        setPassword('');
      }
    } catch {
      setError('發生錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Notes" description="Private notes access">
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.lockIcon}>🔒</div>
          <h2 className={styles.title}>Private Notes</h2>
          <p className={styles.subtitle}>請輸入密碼以進入筆記區域</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.input}
              autoFocus
              disabled={loading}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button} disabled={loading || !password}>
              {loading ? '驗證中...' : '進入'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
