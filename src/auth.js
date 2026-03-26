const TOKEN_KEY = 'veresiye_token';
const CUSTOMER_KEY = 'veresiye_customer';

export function saveAuth(token, customer) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCustomer() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMER_KEY));
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}
