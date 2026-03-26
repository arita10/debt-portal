import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import PaymentsPage from './pages/PaymentsPage';
import Layout from './components/Layout';
import { getMe } from './api';
import { getToken, clearAuth, isLoggedIn } from './auth';
import InstallPrompt from './components/InstallPrompt';

function PrivateRoute({ loggedIn, onLogout, children, data, loading, error, onRefresh }) {
  if (!loggedIn) return <Navigate to="/login" replace />;
  return (
    <Layout onLogout={onLogout}>
      {React.cloneElement(children, { data, loading, error, onRefresh })}
    </Layout>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getMe(token);
      setData(result);
    } catch (e) {
      if (e.message === 'UNAUTHORIZED') {
        clearAuth();
        setLoggedIn(false);
        setData(null);
        return;
      }
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) fetchData();
  }, [loggedIn, fetchData]);

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogout() {
    clearAuth();
    setLoggedIn(false);
    setData(null);
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <InstallPrompt />
      <Routes>
        <Route
          path="/login"
          element={loggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute loggedIn={loggedIn} onLogout={handleLogout} data={data} loading={loading} error={error} onRefresh={fetchData}>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute loggedIn={loggedIn} onLogout={handleLogout} data={data} loading={loading} error={error} onRefresh={fetchData}>
              <TransactionsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <PrivateRoute loggedIn={loggedIn} onLogout={handleLogout} data={data} loading={loading} error={error} onRefresh={fetchData}>
              <PaymentsPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to={loggedIn ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
