export const isReservationConflicting = (newStart, newEnd, resourceId, allReservations) => {
    // convert to timestamps
    const start = new Date(newStart).getTime();
    const end = new Date(newEnd).getTime();

    for (let reservation of allReservations) {
        // check overlap
        if (
            reservation.resourceId === resourceId &&
            start < reservation.endTime && 
            end > reservation.startTime
        ) {
            return true; // conflict found
        }
    }
    
    return false; // no conflict 
}