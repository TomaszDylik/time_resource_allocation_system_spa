import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';

const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.role}</p>
      <button onClick={logout}>Wyloguj</button>
    </div>
  );
};

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />``
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;