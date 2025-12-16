import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { useEffect, useMemo } from 'react';
import { handleApprove, handleReject, updateReservationStatuses, handleDelete } from '../utils/reservationHandlers';
import { exportReservationsToCSV } from '../utils/exportUtils';
import DashboardHeader from '../components/DashboardHeader';
import CalendarView from '../components/CalendarView';
import RejectedReservations from '../components/RejectedReservations';
import StatisticsCards from '../components/StatisticsCards';

function AdminDashboard() {
  // auth context
  const authContext = useAuth();
  const currentUser = authContext.user; 
  const logoutFunction = authContext.logout; 
  
  // database context
  const databaseContext = useDatabase();
  const allReservations = databaseContext.reservations; 
  const allResources = databaseContext.resources; 
  const allUsers = databaseContext.users; 
  const saveDataFunction = databaseContext.saveData;

  // update statuses on mount
  useEffect(function() {
    updateReservationStatuses(allReservations, allUsers, allResources, saveDataFunction);
  }, [allReservations, allUsers, allResources, saveDataFunction]);

  // rejected reservations - memoized
  const rejectedReservations = useMemo(function() {
    return allReservations.filter(function(reservation) {
      return reservation.status === 'rejected';
    });
  }, [allReservations]);
  
  // calendar reservations (not rejected) - memoized
  const calendarReservations = useMemo(function() {
    return allReservations.filter(function(reservation) {
      return reservation.status !== 'rejected';
    });
  }, [allReservations]);
  
  // handlers
  const handleApproveReservation = function(reservationId) {
    handleApprove(reservationId, allReservations, allUsers, allResources, saveDataFunction);
  };
  
  const handleRejectReservation = function(reservationId) {
    handleReject(reservationId, allReservations, allUsers, allResources, saveDataFunction);
  };
  
  const handleReservationClick = function(reservation) {
    handleDelete(reservation.id, allReservations, allUsers, allResources, saveDataFunction);
  };

  const handleExportCSV = function() {
    exportReservationsToCSV(allReservations, allResources, allUsers);
  };

  return (
    <div>
      <DashboardHeader 
        currentUser={currentUser} 
        logoutFunction={logoutFunction} 
        title="Panel Administratora"
      />

      <div className="dashboard-container">
        <div className="export-section">
          <button className="export-csv-btn" onClick={handleExportCSV}>
            Eksportuj wszystkie rezerwacje do CSV
          </button>
        </div>

        <CalendarView
          reservations={calendarReservations}
          allResources={allResources}
          allUsers={allUsers}
          isAdminView={true}
          onReservationClick={handleReservationClick}
          onApprove={handleApproveReservation}
          onReject={handleRejectReservation}
        />
        
        <RejectedReservations 
          reservations={rejectedReservations}
          allResources={allResources}
          allUsers={allUsers}
          isAdminView={true}
        />

        <StatisticsCards 
          reservations={allReservations}
          resources={allResources}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
