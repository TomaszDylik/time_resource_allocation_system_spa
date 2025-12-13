function ReservationStatistics(props) {
  const allReservations = props.allReservations;
  
  // count pending 
  const pendingCount = allReservations.filter(function(reservation) {
    return reservation.status === 'pending';
  }).length;
  
  // count approved
  const approvedCount = allReservations.filter(function(reservation) {
    return reservation.status === 'approved';
  }).length;
  
  // count rejected
  const rejectedCount = allReservations.filter(function(reservation) {
    return reservation.status === 'rejected';
  }).length;
  
  return (
    <div>
      <h3>Statystyki wszystkich rezerwacji</h3>
      <div>
        <div>
          <div>{pendingCount}</div>
          <div>Oczekujące</div>
        </div>
        
        <div>
          <div>{approvedCount}</div>
          <div>Zatwierdzone</div>
        </div>
        
        <div>
          <div>{rejectedCount}</div>
          <div>Odrzucone</div>
        </div>
      </div>
    </div>
  );
}

export default ReservationStatistics;
