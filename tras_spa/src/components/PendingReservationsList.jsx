import { isReservationConflicting } from '../utils/collisonLogic';

function PendingReservationsList(props) {
  const pendingReservations = props.pendingReservations; // table of pending reservations
  const allReservations = props.allReservations; // all reservations 
  const allResources = props.allResources; // all services
  const allUsers = props.allUsers; // all users
  const handleApprove = props.handleApprove; // confirm reservation function
  const handleReject = props.handleReject; // reject reservation function
  
  return (
    <div>
      <h2>Nowe rezerwacje do zatwierdzenia ({pendingReservations.length})</h2>
      
      {pendingReservations.length === 0 ? (
        <p>Brak nowych rezerwacji do zatwierdzenia.</p>
      ) : (
        <div>
          {pendingReservations.map(function(reservation) {

            // find service of this reservation
            const reservationResource = allResources.find(function(resource) {
              return resource.id === reservation.resourceId;
            });
            
            // find user of this reservation
            const reservationUser = allUsers.find(function(user) {
              return user.id === reservation.userId;
            });
            
            // conert to timestamp
            const startTime = new Date(reservation.startTime);
            const endTime = new Date(reservation.endTime);

            // get confirmed reservations
            const approvedReservations = allReservations.filter(function(reservation) {
              return reservation.status === 'approved';
            });

            // has conflict?
            const hasConflict = isReservationConflicting(
              reservation.startTime, // start
              reservation.endTime, // end
              reservation.resourceId, // which service
              approvedReservations, // resevations approwved
              reservation.id // id of current reservation
            );

            return (
              <div key={reservation.id}>
                {hasConflict && (
                  <div>KONFLIKT: Ten termin koliduje z zatwierdzoną rezerwacją!</div>
                )}
                
                <div>
                  <div>
                    <h3>{reservationResource?.name}</h3>
                    
                    <p>Klient: {reservationUser?.name} ({reservationUser?.email})</p>
                    
                    <p>Data: {startTime.toLocaleDateString('pl-PL')}</p>
                    
                    <p>Godzina: {startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>
                    
                    <p>Czas trwania: {reservationResource?.duration} min</p>
                  </div>

                  {/* buttons */}
                  <div>
                    {/* reject */}
                    <button onClick={function() { handleReject(reservation.id); }}>Odrzuć</button>
                    
                    {/* approve | disabled if conflict*/}
                    <button onClick={function() { handleApprove(reservation.id); }} disabled={hasConflict}>Zatwierdź</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PendingReservationsList;
