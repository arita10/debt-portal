import React, { useState } from 'react';
import { login } from '../api';
import { saveAuth } from '../auth';
import styles from './LoginPage.module.css';

export default function LoginPage({ onLogin }) {
  const [homeNo, setHomeNo] = useState('');
  const [telNo, setTelNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!homeNo.trim() || !telNo.trim()) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await login(homeNo.trim(), telNo.trim());
      saveAuth(result.accessToken, result.customer);
      onLogin(); // sets loggedIn=true → App fetches data → redirects to /dashboard
    } catch (err) {
      setError(err.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}>🛒</div>
          <h1 className={styles.title}>Balcı Market</h1>
          <p className={styles.brand}>Defterim</p>
          <p className={styles.subtitle}>Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Ev Numarası</label>
            <input
              className={styles.input}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Örn: 12"
              value={homeNo}
              onChange={(e) => setHomeNo(e.target.value.replace(/\D/g, ''))}
              autoComplete="off"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Telefon Numarası</label>
            <input
              className={styles.input}
              type="tel"
              inputMode="tel"
              placeholder="05XX XXX XX XX"
              value={telNo}
              onChange={(e) => setTelNo(e.target.value.replace(/\D/g, ''))}
              autoComplete="tel"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? <span className={styles.spinner}></span> : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
