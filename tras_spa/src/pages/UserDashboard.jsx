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

// user dashboard component - client panel for viewing and creating reservations
function UserDashboard() {
  // get auth context - current user data and logout function
  const authContext = useAuth();
  const currentUser = authContext.user; 
  const logoutFunction = authContext.logout; 
  
  // get database context - localStorage data (users, resources, reservations)
  const databaseContext = useDatabase();
  const allReservations = databaseContext.reservations; 
  const allResources = databaseContext.resources; 
  const allUsers = databaseContext.users; 
  const saveDataFunction = databaseContext.saveData; 
  
  // local state - form filters (date, resource, hour)
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedResource, setSelectedResource] = useState('');
  const [selectedHour, setSelectedHour] = useState('');

  // update reservation statuses on component mount
  useEffect(function() {
    updateReservationStatuses(allReservations, allUsers, allResources, saveDataFunction);
  }, [allReservations, allUsers, allResources, saveDataFunction]);

  // filter reservations - only current user's reservations - memoized
  const userReservations = useMemo(function() {
    return allReservations.filter(function(reservation) {
      return reservation.userId === currentUser.id;
    });
  }, [allReservations, currentUser.id]);
  
  // rejected reservations - memoized
  const rejectedReservations = useMemo(function() {
    return userReservations.filter(function(reservation) {
      return reservation.status === 'rejected';
    });
  }, [userReservations]);
  
  // calendar reservations - user's pending, approved, completed (not rejected) - memoized
  const calendarReservations = useMemo(function() {
    return userReservations.filter(function(reservation) {
      return reservation.status !== 'rejected';
    });
  }, [userReservations]);

  // generate available slots based on selected filters - memoized expensive calculation
  const availableSlots = useMemo(function() {
    return generateFreeTimeSlots(selectedDate, selectedResource, selectedHour, allReservations, allResources);
  }, [selectedDate, selectedResource, selectedHour, allReservations, allResources]);

  // form change handlers - update state when user changes form values
  function handleDateChange(event) {
    setSelectedDate(event.target.value);
  }

  function handleResourceChange(event) {
    setSelectedResource(event.target.value);
  }
  
  function handleHourChange(event) {
    setSelectedHour(event.target.value);
  }
  
  // wrapper for reservation handler
  function handleReservation(slot) {
    handleReservationUtil(slot, currentUser, allReservations, allUsers, allResources, saveDataFunction);
  }
  
  // delete reservation handler for calendar
  function handleDeleteReservation(reservation) {
    handleDelete(reservation.id, allReservations, allUsers, allResources, saveDataFunction);
  }
  
  // generate hour options list - memoized static list
  const hourOptions = useMemo(function() {
    return generateHourOptions();
  }, []);

  // determine if "No available slots" message should be shown
  const shouldShowNoSlots = selectedDate !== '' && selectedResource !== '' && availableSlots.length === 0;

  // render component
  return (
    <div>
      {/* header with user name and logout button */}
      <DashboardHeader 
        currentUser={currentUser} 
        logoutFunction={logoutFunction} 
        title="Panel Użytkownika"
      />

      <div className="dashboard-container">
        {/* reservation creation form */}
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
        
        {/* calendar view - user's reservations (pending, approved, completed) */}
        <CalendarView
          reservations={calendarReservations}
          allResources={allResources}
          allUsers={allUsers}
          isAdminView={false}
          onReservationClick={handleDeleteReservation}
        />
        
        {/* rejected/cancelled reservations section */}
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
