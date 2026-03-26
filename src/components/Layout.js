import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Layout.module.css';

export default function Layout({ children, onLogout }) {
  function handleLogout() {
    if (onLogout) onLogout();
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.logo}>Balcı Market Defterim</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>Çıkış</button>
      </header>

      <main className={styles.main}>{children}</main>

      <nav className={styles.bottomNav}>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
          <span className={styles.navIcon}>🏠</span>
          <span className={styles.navLabel}>Ana Sayfa</span>
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
          <span className={styles.navIcon}>🧾</span>
          <span className={styles.navLabel}>Alışverişler</span>
        </NavLink>
        <NavLink to="/payments" className={({ isActive }) => isActive ? styles.navItemActive : styles.navItem}>
          <span className={styles.navIcon}>💳</span>
          <span className={styles.navLabel}>Ödemeler</span>
        </NavLink>
      </nav>
    </div>
  );
}
