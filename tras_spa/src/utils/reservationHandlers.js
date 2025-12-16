import { isReservationConflicting } from './collisonLogic';

// approve reservation
export function handleApprove(reservationId, allReservations, allUsers, allResources, saveDataFunction) {
  // get approved reservations
  const approvedReservations = allReservations.filter(function(reservation) {
    return reservation.status === 'approved';
  });
  
  // find target
  const targetReservation = allReservations.find(function(reservation) {
    return reservation.id === reservationId;
  });
  
  // check conflict
  const hasConflict = isReservationConflicting(
    targetReservation.startTime,
    targetReservation.endTime,
    targetReservation.resourceId,
    approvedReservations
  );
  // if conflict - stop
  if (hasConflict) {
    alert('Nie można zatwierdzić - istnieje konflikt z inną zatwierdzoną rezerwacją!');
    return;
  }

  // approve reservation
  const updatedReservations = allReservations.map(function(reservation) {
    if (reservation.id === reservationId) {
      const approvedReservation = {
        id: reservation.id,
        userId: reservation.userId,
        resourceId: reservation.resourceId,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        status: 'approved' // change status
      };
      return approvedReservation;
    } else {
      return reservation;
    }
  });

  // save to localStorage
  const dataToSave = {
    users: allUsers,
    resources: allResources,
    reservations: updatedReservations
  };
  
  saveDataFunction(dataToSave);
}

// reject reservation
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
        status: 'rejected' // change status
      };
      return rejectedReservation;
    } else {
      return reservation;
    }
  });

  // save to localStorage
  const dataToSave = {
    users: allUsers,
    resources: allResources,
    reservations: updatedReservations
  };
  
  saveDataFunction(dataToSave);
}

// delete reservation
export function handleDelete(reservationId, allReservations, allUsers, allResources, saveDataFunction) {
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
    // approved -> completed if ended
    if (reservation.status === 'approved' && reservation.endTime < currentTime) {
      hasChanges = true;
      return {
        ...reservation,
        status: 'completed'
      };
    }
    
    // pending -> rejected if ended
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
