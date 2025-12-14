import { useNavigate } from 'react-router-dom';

function DashboardHeader(props) {
  const currentUser = props.currentUser; 
  const logoutFunction = props.logoutFunction;
  const title = props.title;
  const navigate = useNavigate();
  
  const isUser = currentUser?.role !== 'admin';
  
  return (
    <div className="dashboard-header">
      <h1 className="dashboard-title">{title} - {currentUser?.name}</h1>
      
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
