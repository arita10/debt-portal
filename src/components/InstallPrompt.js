import React, { useState, useEffect } from 'react';
import styles from './InstallPrompt.module.css';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    if (dismissed) return;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    });
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    localStorage.setItem('pwa_install_dismissed', '1');
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.icon}>📲</span>
        <span className={styles.text}>Uygulamayı telefona ekle</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.installBtn} onClick={handleInstall}>Ekle</button>
        <button className={styles.dismissBtn} onClick={handleDismiss}>✕</button>
      </div>
    </div>
  );
}
