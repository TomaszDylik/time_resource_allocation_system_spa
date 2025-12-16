import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchIconSvg } from '../utils/avatarApi';

function DashboardHeader(props) {
  const currentUser = props.currentUser; 
  const logoutFunction = props.logoutFunction;
  const title = props.title;
  const navigate = useNavigate();
  
  // fetch icon from API
  const [iconSvg, setIconSvg] = useState(null);
  
  useEffect(() => {
    fetchIconSvg().then(setIconSvg);
  }, []);
  
  const isUser = currentUser?.role !== 'admin';
  
  return (
    <div className="dashboard-header">
      <div className="header-left">
        {iconSvg && <div className="app-icon" dangerouslySetInnerHTML={{ __html: iconSvg }} />}
        <h1 className="dashboard-title">{title} - {currentUser?.name}</h1>
      </div>
      
      <div className="header-actions">
        {isUser && (
          <button className="profile-button" onClick={() => navigate('/user-profile')}>
            Profil
          </button>
        )}
        <button className="logout-button" onClick={logoutFunction}>Wyloguj</button>
      </div>
    </div>
  );
}

export default DashboardHeader;
