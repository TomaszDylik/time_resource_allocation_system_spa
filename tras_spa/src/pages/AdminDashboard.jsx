import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { handleApprove, handleReject } from '../utils/reservationHandlers';
import DashboardHeader from '../components/DashboardHeader';
import PendingReservationsList from '../components/PendingReservationsList';
import ReservationStatistics from '../components/ReservationStatistics';

function AdminDashboard() {
  // get auth informations
  const authContext = useAuth();
  const currentUser = authContext.user; 
  const logoutFunction = authContext.logout; 
  
  // get local storage data
  const databaseContext = useDatabase();
  const allReservations = databaseContext.reservations; 
  const allResources = databaseContext.resources; 
  const allUsers = databaseContext.users; 
  const saveDataFunction = databaseContext.saveData; 

  // pendings
  const pendingReservations = allReservations.filter(function(reservation) {
    return reservation.status === 'pending';
  });

  // render
  return (
    <div>
      {/* header and logout */}
      <DashboardHeader 
        currentUser={currentUser} 
        logoutFunction={logoutFunction} 
        title="Panel Administratora"
      />

      <div className="dashboard-container">
        <div className="dashboard-grid">
          {/* pending reservations list with Approve/Reject buttons */}
          <PendingReservationsList 
            pendingReservations={pendingReservations}
            allReservations={allReservations}
            allResources={allResources}
            allUsers={allUsers}
            handleApprove={function(reservationId) {
              handleApprove(reservationId, allReservations, allUsers, allResources, saveDataFunction);
            }}
            handleReject={function(reservationId) {
              handleReject(reservationId, allReservations, allUsers, allResources, saveDataFunction);
            }}
          />

          {/* statistics */}
          <ReservationStatistics allReservations={allReservations} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
