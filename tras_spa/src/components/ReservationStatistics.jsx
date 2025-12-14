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
    <div className="section-card">
      <h3 className="section-title">Statystyki wszystkich rezerwacji</h3>
      <div className="stats-grid">
        <div className="stat-card pending">
          <div className="stat-number pending">{pendingCount}</div>
          <div className="stat-label">Oczekujące</div>
        </div>
        
        <div className="stat-card approved">
          <div className="stat-number approved">{approvedCount}</div>
          <div className="stat-label">Zatwierdzone</div>
        </div>
        
        <div className="stat-card rejected">
          <div className="stat-number rejected">{rejectedCount}</div>
          <div className="stat-label">Odrzucone</div>
        </div>
      </div>
    </div>
  );
}

export default ReservationStatistics;
