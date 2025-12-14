import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'admin') {
    return <Navigate to="/admin" />;
  } else {
    return <Navigate to="/user" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/" element={<DashboardRedirect />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;