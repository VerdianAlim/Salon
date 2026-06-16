import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Customer pages
import Landing from './pages/customer/Landing';
import Services from './pages/customer/Services';
import ServiceDetail from './pages/customer/ServiceDetail';
import BookingForm from './pages/customer/BookingForm';
import BookingSuccess from './pages/customer/BookingSuccess';
import BookingHistory from './pages/customer/BookingHistory';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import BookingList from './pages/admin/BookingList';
import BookingDetail from './pages/admin/BookingDetail';
import ServiceManager from './pages/admin/ServiceManager';
import Calendar from './pages/admin/Calendar';

// Layout
import AdminLayout from './components/layout/AdminLayout';

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            padding: '12px 16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        {/* ==================== CUSTOMER ROUTES ==================== */}
        <Route path="/" element={<Landing />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/booking/success" element={<BookingSuccess />} />
        <Route path="/booking/history" element={<BookingHistory />} />

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<BookingList />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="services" element={<ServiceManager />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
