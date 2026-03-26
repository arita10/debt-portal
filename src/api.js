// Empty string = use CRA proxy (dev). Production sets the full URL.
const BASE_URL = process.env.REACT_APP_API_URL || '';
const SHOP_ID = process.env.REACT_APP_SHOP_ID || '1';

export const SHOP_BASE = `${BASE_URL}/shops/${SHOP_ID}/verisiye/portal`;

export async function login(homeNo, telNo) {
  const res = await fetch(`${SHOP_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ homeNo, telNo }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Giriş başarısız');
  }
  return res.json();
}

export async function getMe(token) {
  const res = await fetch(`${SHOP_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    throw new Error('Veriler alınamadı');
  }
  return res.json();
}
