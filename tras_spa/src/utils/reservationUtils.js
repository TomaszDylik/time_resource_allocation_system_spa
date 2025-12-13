export function handleReservation(slot, currentUser, selectedResource, allReservations, allUsers, allResources, saveDataFunction) {
  // create new reservation object
  const newReservation = {
    id: Date.now(), // unique ID based on timestamp
    userId: currentUser.id, // current user's ID
    resourceId: parseInt(selectedResource), // selected service ID
    startTime: slot.startTime.getTime(), // start time as timestamp
    endTime: slot.endTime.getTime(), // end time as timestamp
    status: 'pending' // status "pending" - needs admin approval
  };

  // add new reservation to existing reservations
  const updatedReservations = allReservations.concat([newReservation]);

  // prepare full data object for save
  const updatedData = {
    users: allUsers,
    resources: allResources,
    reservations: updatedReservations // updatedData reservations list
  };

  // save to localStorage
  saveDataFunction(updatedData);
  
  // notify user of successful submission
  alert('Rezerwacja została wysłana do zatwierdzenia!');
}

// generate hour options for select (9:00 to 17:30, every 30 minutes)
export function generateHourOptions() {
  const hours = [];
  
  // loop through hours 9 to 17 (18 excluded - no slot 18:00-18:30)
  for (let hour = 9; hour < 18; hour = hour + 1) {
    // loop through minutes: 0 and 30
    for (let minute = 0; minute < 60; minute = minute + 30) {
      // format hour with leading zero if < 10 (e.g., "09" instead of "9")
      const hourString = hour < 10 ? '0' + hour : '' + hour;
      // format minutes ("00" or "30")
      const minuteString = minute === 0 ? '00' : '' + minute;
      // combine into string like "09:00", "09:30", "10:00", etc.
      const timeString = hourString + ':' + minuteString;
      hours.push(timeString);
    }
  }
  return hours;
}
