import { isReservationConflicting } from './collisonLogic';

// confirmation function
export function handleApprove(reservationId, allReservations, allUsers, allResources, saveDataFunction) {
  // approved
  const approvedReservations = allReservations.filter(function(reservation) {
    return reservation.status === 'approved';
  });
  
  // find target reservation
  const targetReservation = allReservations.find(function(reservation) {
    return reservation.id === reservationId;
  });
  
  // check conflicts
  const hasConflict = isReservationConflicting(
    targetReservation.startTime,
    targetReservation.endTime,
    targetReservation.resourceId,
    approvedReservations
  );
  // if conflict alert and stop
  if (hasConflict) {
    alert('Nie można zatwierdzić - istnieje konflikt z inną zatwierdzoną rezerwacją!');
    return;
  }

  // if no conflict approve
  const updatedReservations = allReservations.map(function(reservation) {
    // change status to approved
    if (reservation.id === reservationId) {
      const approvedReservation = {
        id: reservation.id,
        userId: reservation.userId,
        resourceId: reservation.resourceId,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        status: 'approved' // main change
      };
      return approvedReservation;
    } else {
      return reservation;
    }
  });

  // object to save
  const dataToSave = {
    users: allUsers,
    resources: allResources,
    reservations: updatedReservations
  };
  
  // push to localStorage
  saveDataFunction(dataToSave);
}

// rejection function
export function handleReject(reservationId, allReservations, allUsers, allResources, saveDataFunction) {
  // change status to rejected
  const updatedReservations = allReservations.map(function(reservation) {
    if (reservation.id === reservationId) {
      const rejectedReservation = {
        id: reservation.id,
        userId: reservation.userId,
        resourceId: reservation.resourceId,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        status: 'rejected' // main change
      };
      return rejectedReservation;
    } else {
      return reservation;
    }
  });

  // object to save
  const dataToSave = {
    users: allUsers,
    resources: allResources,
    reservations: updatedReservations
  };
  
  // save to localStorage
  saveDataFunction(dataToSave);
}

// delete reservation function
export function handleDelete(reservationId, allReservations, allUsers, allResources, saveDataFunction) {
  // filter reservation to delete
  const updatedReservations = allReservations.filter(function(reservation) {
    return reservation.id !== reservationId;
  });

  // save data
  const dataToSave = {
    users: allUsers,
    resources: allResources,
    reservations: updatedReservations
  };
  
  saveDataFunction(dataToSave);
}

export function updateReservationStatuses(allReservations, allUsers, allResources, saveDataFunction) {
  const currentTime = new Date().getTime();
  let hasChanges = false;
  
  const updatedReservations = allReservations.map(function(reservation) {
    // if reservation is approved and endTime has passed, mark as completed
    if (reservation.status === 'approved' && reservation.endTime < currentTime) {
      hasChanges = true;
      return {
        ...reservation,
        status: 'completed'
      };
    }
    
    // ff reservation pending and endTime has passed -> rejected
    if (reservation.status === 'pending' && reservation.endTime < currentTime) {
      hasChanges = true;
      return {
        ...reservation,
        status: 'rejected'
      };
    }
    
    return reservation;
  });

  if (hasChanges) {
    const dataToSave = {
      users: allUsers,
      resources: allResources,
      reservations: updatedReservations
    };
    saveDataFunction(dataToSave);
  }
  
  return updatedReservations;
}
