export function handleReservation(slot, currentUser, selectedResource, allReservations, allUsers, allResources, saveDataFunction) {
  // create new reservation
  const newReservation = {
    id: Date.now(), // unique id
    userId: currentUser.id,
    resourceId: parseInt(selectedResource),
    startTime: slot.startTime.getTime(),
    endTime: slot.endTime.getTime(),
    status: 'pending' // needs approval
  };

  const updatedReservations = allReservations.concat([newReservation]);

  // save to localStorage
  const updatedData = {
    users: allUsers,
    resources: allResources,
    reservations: updatedReservations
  };

  saveDataFunction(updatedData);
  
  alert('Rezerwacja została wysłana do zatwierdzenia!');
}

// generate hour options (9:00 to 17:30)
export function generateHourOptions() {
  const hours = [];
  
  // loop 9-17
  for (let hour = 9; hour < 18; hour = hour + 1) {
    // 0 and 30 minutes
    for (let minute = 0; minute < 60; minute = minute + 30) {
      const hourString = hour < 10 ? '0' + hour : '' + hour;
      const minuteString = minute === 0 ? '00' : '' + minute;
      const timeString = hourString + ':' + minuteString;
      hours.push(timeString);
    }
  }
  return hours;
}
