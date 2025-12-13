function UserReservationsList(props) {
  const userReservations = props.userReservations;
  const allResources = props.allResources;
  
  // badgee of status
  function getStatusBadge(status) {
    const badges = {
      pending: { text: 'Oczekujące' }, 
      approved: { text: 'Zatwierdzone' }, 
      rejected: { text: 'Odrzucone' } 
    };
    
    const badge = badges[status];
    
    // Zwracamy badge z odpowiednim tekstem
    return <span>{badge.text}</span>;
  }
  
  return (
    <div>
      <h2>Twoje rezerwacje</h2>
      <div>
        {/* if no reservations */}
        {userReservations.length === 0 ? (
          <p>Nie masz jeszcze żadnych rezerwacji</p>
        ) : (
          userReservations.map(function(reservation) {
            const reservationResource = allResources.find(function(resource) {
              return resource.id === reservation.resourceId;
            });
            
            // convert to timestamp
            const startTime = new Date(reservation.startTime);
            const endTime = new Date(reservation.endTime);
            
            return (
              <div key={reservation.id}>
                {/* service + status */}
                <div>
                  <h3>{reservationResource?.name}</h3>                  
                  {getStatusBadge(reservation.status)}
                </div>
                
                {/* date */}
                <p>{startTime.toLocaleDateString('pl-PL')}</p>
                
                {/* hours .. - .. */}
                <p>{startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>
                
                {/* duration */}
                <p>Czas trwania: {reservationResource?.duration} min</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default UserReservationsList;
