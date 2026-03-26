import React from 'react';
import styles from './PaymentsPage.module.css';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatAmount(amount) {
  return parseFloat(amount || 0).toFixed(2);
}

export default function PaymentsPage({ data, loading, error }) {
  const payments = [...(data?.payments || [])].sort(
    (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
  );

  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner}></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Ödemelerim</h2>

      {error && (
        <div className={styles.offlineBadge}>📵 Çevrimdışı görünüm</div>
      )}

      {payments.length > 0 && (
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Toplam Ödenen</div>
          <div className={styles.summaryAmount}>{totalPaid.toFixed(2)} ₺</div>
          <div className={styles.summaryCount}>{payments.length} ödeme</div>
        </div>
      )}

      {payments.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>💳</span>
          <p>Henüz ödeme kaydı yok.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {payments.map((payment, i) => (
            <div key={i} className={styles.paymentCard}>
              <div className={styles.paymentLeft}>
                <div className={styles.paymentIcon}>✅</div>
                <div>
                  <div className={styles.paymentDate}>{formatDate(payment.paymentDate)}</div>
                  {payment.note && (
                    <div className={styles.paymentNote}>{payment.note}</div>
                  )}
                </div>
              </div>
              <div className={styles.paymentAmount}>+{formatAmount(payment.amount)} ₺</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
