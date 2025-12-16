import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import ReservationForm from '../components/ReservationForm';
import CalendarView from '../components/CalendarView';
import RejectedReservations from '../components/RejectedReservations';
import { generateFreeTimeSlots } from '../utils/slotGenerator';
import { handleReservation as handleReservationUtil, generateHourOptions } from '../utils/reservationUtils';
import { handleDelete, updateReservationStatuses } from '../utils/reservationHandlers';

function UserDashboard() {
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
  
  // form state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedResource, setSelectedResource] = useState('');
  const [selectedHour, setSelectedHour] = useState('');

  // update statuses on mount
  useEffect(function() {
    updateReservationStatuses(allReservations, allUsers, allResources, saveDataFunction);
  }, [allReservations, allUsers, allResources, saveDataFunction]);

  // user's reservations - memoized
  const userReservations = useMemo(function() {
    return allReservations.filter(function(reservation) {
      return reservation.userId === currentUser.id;
    });
  }, [allReservations, currentUser.id]);
  
  // rejected - memoized
  const rejectedReservations = useMemo(function() {
    return userReservations.filter(function(reservation) {
      return reservation.status === 'rejected';
    });
  }, [userReservations]);
  
  // calendar reservations (not rejected) - memoized
  const calendarReservations = useMemo(function() {
    return userReservations.filter(function(reservation) {
      return reservation.status !== 'rejected';
    });
  }, [userReservations]);

  // available slots - memoized
  const availableSlots = useMemo(function() {
    return generateFreeTimeSlots(selectedDate, selectedResource, selectedHour, allReservations, allResources);
  }, [selectedDate, selectedResource, selectedHour, allReservations, allResources]);

  // form handlers
  function handleDateChange(event) {
    setSelectedDate(event.target.value);
  }

  function handleResourceChange(event) {
    setSelectedResource(event.target.value);
  }
  
  function handleHourChange(event) {
    setSelectedHour(event.target.value);
  }
  
  function handleReservation(slot) {
    handleReservationUtil(slot, currentUser, selectedResource, allReservations, allUsers, allResources, saveDataFunction);
  }
  
  function handleDeleteReservation(reservation) {
    handleDelete(reservation.id, allReservations, allUsers, allResources, saveDataFunction);
  }
  
  // hour options - memoized
  const hourOptions = useMemo(function() {
    return generateHourOptions();
  }, []);

  const shouldShowNoSlots = selectedDate !== '' && selectedResource !== '' && availableSlots.length === 0;

  return (
    <div>
      <DashboardHeader 
        currentUser={currentUser} 
        logoutFunction={logoutFunction} 
        title="Panel Użytkownika"
      />

      <div className="dashboard-container">
        <div className="reservation-form-wrapper">
          <ReservationForm 
            allResources={allResources}
            selectedResource={selectedResource}
            handleResourceChange={handleResourceChange}
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            selectedHour={selectedHour}
            handleHourChange={handleHourChange}
            hourOptions={hourOptions}
            availableSlots={availableSlots}
            handleReservation={handleReservation}
            shouldShowNoSlots={shouldShowNoSlots}
          />
        </div>
        
        <CalendarView
          reservations={calendarReservations}
          allResources={allResources}
          allUsers={allUsers}
          isAdminView={false}
          onReservationClick={handleDeleteReservation}
        />
        
        <RejectedReservations 
          reservations={rejectedReservations}
          allResources={allResources}
          allUsers={allUsers}
          isAdminView={false}
        />
      </div>
    </div>
  );
}

export default UserDashboard;
