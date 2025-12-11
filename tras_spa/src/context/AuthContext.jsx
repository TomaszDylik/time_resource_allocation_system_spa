import { createContext, useContext, useState, useEffect } from 'react';
import { useDatabase } from './DatabaseContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { users } = useDatabase(); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('spa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('spa_user', JSON.stringify(foundUser)); 
      return true; // sukces logowania
    }
    return false; // blad logowania
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spa_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);