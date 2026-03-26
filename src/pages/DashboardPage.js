import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomer } from '../auth';
import styles from './DashboardPage.module.css';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatAmount(amount) {
  return parseFloat(amount || 0).toFixed(2);
}

export default function DashboardPage({ data, loading, error, onRefresh }) {
  const navigate = useNavigate();
  const storedCustomer = getCustomer();
  const customer = data?.customer || storedCustomer;

  const lastSale = data?.sales?.[0];
  const totalSales = data?.sales?.length || 0;
  const totalPayments = data?.payments?.length || 0;

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {customer && (
        <div className={styles.greeting}>
          Merhaba, <strong>{customer.name}</strong>
        </div>
      )}

      {error && (
        <div className={styles.errorBanner}>
          <span>Veriler yüklenemedi (çevrimdışı görünüm)</span>
          <button className={styles.retryBtn} onClick={onRefresh}>Yenile</button>
        </div>
      )}

      <div className={styles.balanceCard}>
        <div className={styles.balanceLabel}>Toplam Borcunuz</div>
        <div className={styles.balanceAmount}>
          {formatAmount(customer?.balance)} <span className={styles.currency}>₺</span>
        </div>
        {lastSale && (
          <div className={styles.lastDate}>
            Son alışveriş: {formatDate(lastSale.createdAt)}
          </div>
        )}
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalSales}</div>
          <div className={styles.statLabel}>Alışveriş</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalPayments}</div>
          <div className={styles.statLabel}>Ödeme</div>
        </div>
      </div>

      <div className={styles.quickLinks}>
        <button className={styles.linkCard} onClick={() => navigate('/transactions')}>
          <span className={styles.linkIcon}>🧾</span>
          <div>
            <div className={styles.linkTitle}>Alışverişlerim</div>
            <div className={styles.linkSub}>Tüm veresiye alışverişleri</div>
          </div>
          <span className={styles.arrow}>›</span>
        </button>

        <button className={styles.linkCard} onClick={() => navigate('/payments')}>
          <span className={styles.linkIcon}>💳</span>
          <div>
            <div className={styles.linkTitle}>Ödemelerim</div>
            <div className={styles.linkSub}>Yaptığım ödemeler</div>
          </div>
          <span className={styles.arrow}>›</span>
        </button>
      </div>

      <button className={styles.refreshBtn} onClick={onRefresh} disabled={loading}>
        ↻ Yenile
      </button>
    </div>
  );
}
