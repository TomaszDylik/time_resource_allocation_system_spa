import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import UserReservationsList from '../components/UserReservationsList';
import ReservationForm from '../components/ReservationForm';
import { generateFreeTimeSlots } from '../utils/slotGenerator';
import { handleReservation as handleReservationUtil, generateHourOptions } from '../utils/reservationUtils';

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

  // filter reservations - only current user's reservations
  const userReservations = allReservations.filter(function(reservation) {
    return reservation.userId === currentUser.id;
  });

  // generate available slots based on selected filters
  const availableSlots = generateFreeTimeSlots(selectedDate, selectedResource, selectedHour, allReservations, allResources);

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
    handleReservationUtil(slot, currentUser, selectedResource, allReservations, allUsers, allResources, saveDataFunction);
  }
  
  // generate hour options list
  const hourOptions = generateHourOptions();

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

      <div>
        {/* user's reservations list (pending, approved, rejected) */}
        <UserReservationsList 
          userReservations={userReservations}
          allResources={allResources}
        />

        {/* reservation creation form */}
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
    </div>
  );
}

export default UserDashboard;
