function DashboardHeader(props) {
  const currentUser = props.currentUser; 
  const logoutFunction = props.logoutFunction;
  const title = props.title;
  
  return (
    <div>
      <h1>{title} - {currentUser?.name}</h1>
      
      <button onClick={logoutFunction}>Wyloguj</button>
    </div>
  );
}

export default DashboardHeader;
