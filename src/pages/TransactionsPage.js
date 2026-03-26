import React, { useState } from 'react';
import styles from './TransactionsPage.module.css';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatAmount(amount) {
  return parseFloat(amount || 0).toFixed(2);
}

function SaleItem({ sale }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.saleCard}>
      <button className={styles.saleHeader} onClick={() => setExpanded(!expanded)}>
        <div className={styles.saleLeft}>
          <div className={styles.saleIcon}>🧾</div>
          <div>
            <div className={styles.saleDate}>{formatDate(sale.createdAt)}</div>
            <div className={styles.saleItems}>{sale.items?.length || 0} ürün</div>
          </div>
        </div>
        <div className={styles.saleRight}>
          <div className={styles.saleAmount}>{formatAmount(sale.totalAmount)} ₺</div>
          <div className={styles.chevron}>{expanded ? '▲' : '▼'}</div>
        </div>
      </button>

      {expanded && sale.items && sale.items.length > 0 && (
        <div className={styles.itemList}>
          <div className={styles.itemListHeader}>
            <span>Ürün</span>
            <span>Adet</span>
            <span>Fiyat</span>
            <span>Toplam</span>
          </div>
          {sale.items.map((item, i) => (
            <div key={i} className={styles.itemRow}>
              <span className={styles.itemName}>{item.productName}</span>
              <span className={styles.itemQty}>{parseFloat(item.quantity)}</span>
              <span>{formatAmount(item.priceAtSale)} ₺</span>
              <span className={styles.itemTotal}>{formatAmount(item.lineTotal)} ₺</span>
            </div>
          ))}
          <div className={styles.itemTotal_row}>
            <span>Toplam</span>
            <span>{formatAmount(sale.totalAmount)} ₺</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TransactionsPage({ data, loading, error }) {
  const sales = [...(data?.sales || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

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
      <h2 className={styles.pageTitle}>Alışverişlerim</h2>

      {error && (
        <div className={styles.offlineBadge}>📵 Çevrimdışı görünüm</div>
      )}

      {sales.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛒</span>
          <p>Henüz veresiye alışveriş yok.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {sales.map((sale) => (
            <SaleItem key={sale.id} sale={sale} />
          ))}
        </div>
      )}
    </div>
  );
}
