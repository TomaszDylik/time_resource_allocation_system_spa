function DashboardHeader(props) {
  const currentUser = props.currentUser; 
  const logoutFunction = props.logoutFunction;
  const title = props.title;
  
  return (
    <div className="dashboard-header">
      <h1 className="dashboard-title">{title} - {currentUser?.name}</h1>
      
      <button className="logout-button" onClick={logoutFunction}>Wyloguj</button>
    </div>
  );
}

export default DashboardHeader;
