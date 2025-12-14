import { useState, useEffect } from 'react';
import PaginationControls from './PaginationControls';

function UserReservationsList(props) {
  const userReservations = props.userReservations;
  const allResources = props.allResources;
  
  // detect mobile - 1 item on mobile, 4 on desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(function() {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    
    window.addEventListener('resize', handleResize);
    return function() {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // pagination state - 1 on mobile, 4 on desktop
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = isMobile ? 1 : 4;
  
  // calculate pagination
  const totalPages = Math.ceil(userReservations.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = userReservations.slice(startIndex, endIndex);
  
  // reset page when itemsPerPage changes
  useEffect(function() {
    setCurrentPage(0);
  }, [itemsPerPage]);
  
  // navigation functions
  function goToNextPage() {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  }
  
  function goToPreviousPage() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }
  
  return (
    <div className="section-card">
      <div className="section-header-with-pagination">
        <h2 className="section-title">Twoje rezerwacje</h2>
        {userReservations.length > itemsPerPage && (
          <div className="pagination-info">
            Strona {currentPage + 1} z {totalPages}
          </div>
        )}
      </div>
      <div className="reservations-list">
        {/* if no reservations */}
        {userReservations.length === 0 ? (
          <p className="empty-state">Nie masz jeszcze żadnych rezerwacji</p>
        ) : (
          currentReservations.map(function(reservation) {
            const reservationResource = allResources.find(function(resource) {
              return resource.id === reservation.resourceId;
            });
            
            // convert to timestamp
            const startTime = new Date(reservation.startTime);
            const endTime = new Date(reservation.endTime);
            
            return (
              <div key={reservation.id} className="reservation-card">
                {/* service + status */}
                <div className="reservation-header">
                  <h3 className="reservation-service">{reservationResource?.name}</h3>                  
                  <span className={`status-badge ${reservation.status}`}>
                    {reservation.status === 'pending' && 'Oczekujące'}
                    {reservation.status === 'approved' && 'Zatwierdzone'}
                    {reservation.status === 'rejected' && 'Odrzucone'}
                  </span>
                </div>
                
                <div className="reservation-details">
                  {/* date */}
                  <p>● Data: {startTime.toLocaleDateString('pl-PL')}</p>
                  
                  {/* hours .. - .. */}
                  <p>● Godzina: {startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>
                  
                  {/* duration */}
                  <p>● Czas trwania: {reservationResource?.duration} min</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* pagination buttons */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onNext={goToNextPage}
        onPrevious={goToPreviousPage}
        itemsCount={userReservations.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}

export default UserReservationsList;
