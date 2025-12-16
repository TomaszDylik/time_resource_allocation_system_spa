import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DATA } from '../data/mockData';

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [data, setData] = useState(null); // database state
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    const localData = localStorage.getItem('spa_db');
    
    if (localData) {
      setData(JSON.parse(localData));
    } else {
      localStorage.setItem('spa_db', JSON.stringify(INITIAL_DATA));
      setData(INITIAL_DATA);
    }
    setLoading(false); // ready
  }, []);

  const save = (newData) => {
    localStorage.setItem('spa_db', JSON.stringify(newData));
    setData(newData);
  };

  const value = {
    users: data?.users || [],
    resources: data?.resources || [],
    reservations: data?.reservations || [],
    saveData: save
  };

  if (loading) return <div>Ładowanie systemu...</div>;

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);