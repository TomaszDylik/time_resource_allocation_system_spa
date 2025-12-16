import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { useEffect, useMemo } from 'react';
import { handleApprove, handleReject, updateReservationStatuses, handleDelete } from '../utils/reservationHandlers';
import { exportReservationsToCSV } from '../utils/exportUtils';
import DashboardHeader from '../components/DashboardHeader';
import CalendarView from '../components/CalendarView';
import RejectedReservations from '../components/RejectedReservations';

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

  // update reservation statuses on component mount
  useEffect(function() {
    updateReservationStatuses(allReservations, allUsers, allResources, saveDataFunction);
  }, [allReservations, allUsers, allResources, saveDataFunction]);

  // rejected reservations - memoized to avoid unnecessary recalculations
  const rejectedReservations = useMemo(function() {
    return allReservations.filter(function(reservation) {
      return reservation.status === 'rejected';
    });
  }, [allReservations]);
  
  // active reservations for calendar (pending, approved, completed - not rejected) - memoized
  const calendarReservations = useMemo(function() {
    return allReservations.filter(function(reservation) {
      return reservation.status !== 'rejected';
    });
  }, [allReservations]);
  
  // handle approve in calendar
  const handleApproveReservation = function(reservationId) {
    handleApprove(reservationId, allReservations, allUsers, allResources, saveDataFunction);
  };
  
  // handle reject in calendar
  const handleRejectReservation = function(reservationId) {
    handleReject(reservationId, allReservations, allUsers, allResources, saveDataFunction);
  };
  
  // handle reservation click in calendar (admin can delete/cancel)
  const handleReservationClick = function(reservation) {
    handleDelete(reservation.id, allReservations, allUsers, allResources, saveDataFunction);
  };

  // handle CSV export
  const handleExportCSV = function() {
    exportReservationsToCSV(allReservations, allResources, allUsers);
  };

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
        {/* export button */}
        <div className="export-section">
          <button className="export-csv-btn" onClick={handleExportCSV}>
            Eksportuj wszystkie rezerwacje do CSV
          </button>
        </div>

        {/* calendar view - all active reservations (pending, approved, completed) */}
        <CalendarView
          reservations={calendarReservations}
          allResources={allResources}
          allUsers={allUsers}
          isAdminView={true}
          onReservationClick={handleReservationClick}
          onApprove={handleApproveReservation}
          onReject={handleRejectReservation}
        />
        
        {/* rejected/Cancelled reservations section */}
        <RejectedReservations 
          reservations={rejectedReservations}
          allResources={allResources}
          allUsers={allUsers}
          isAdminView={true}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
