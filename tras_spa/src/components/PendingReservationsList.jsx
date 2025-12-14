import { useState, useEffect } from 'react';
import { isReservationConflicting } from '../utils/collisonLogic';
import PaginationControls from './PaginationControls';

function PendingReservationsList(props) {
  const pendingReservations = props.pendingReservations; // table of pending reservations
  const allReservations = props.allReservations; // all reservations 
  const allResources = props.allResources; // all services
  const allUsers = props.allUsers; // all users
  const handleApprove = props.handleApprove; // confirm reservation function
  const handleReject = props.handleReject; // reject reservation function
  
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
  const totalPages = Math.ceil(pendingReservations.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPendingReservations = pendingReservations.slice(startIndex, endIndex);
  
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
      <div className="pending-section-header">
        <h2 className="section-title">Nowe rezerwacje do zatwierdzenia</h2>
        <div className="pending-header-right">
          <span className="pending-count">{pendingReservations.length}</span>
          {pendingReservations.length > itemsPerPage && (
            <span className="pagination-info">
              Strona {currentPage + 1}/{totalPages}
            </span>
          )}
        </div>
      </div>
      
      {pendingReservations.length === 0 ? (
        <div className="empty-pending">
          <p>Brak nowych rezerwacji do zatwierdzenia.</p>
        </div>
      ) : (
        <div className="pending-list">
          {currentPendingReservations.map(function(reservation) {

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
              <div key={reservation.id} className={`pending-card ${hasConflict ? 'has-conflict' : ''}`}>
                {hasConflict && (
                  <div className="conflict-warning">
                    Ten termin koliduje z zatwierdzoną rezerwacją!
                  </div>
                )}
                
                <div className="pending-card-content">
                  <div className="pending-info">
                    <h3 className="pending-service-name">{reservationResource?.name}</h3>
                    
                    <div className="pending-detail">
                      <strong>Klient:</strong> {reservationUser?.name} ({reservationUser?.email})
                    </div>
                    
                    <div className="pending-detail">
                      <strong>Data:</strong> {startTime.toLocaleDateString('pl-PL')}
                    </div>
                    
                    <div className="pending-detail">
                      <strong>Godzina:</strong> {startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    
                    <div className="pending-detail">
                      <strong>Czas trwania:</strong> {reservationResource?.duration} min
                    </div>
                  </div>

                  {/* buttons */}
                  <div className="pending-actions">
                    {/* approve | disabled if conflict*/}
                    <button 
                      className="action-button approve"
                      onClick={function() { handleApprove(reservation.id); }} 
                      disabled={hasConflict}
                    >
                      Zatwierdź
                    </button>
                    
                    {/* reject */}
                    <button 
                      className="action-button reject"
                      onClick={function() { handleReject(reservation.id); }}
                    >
                      Odrzuć
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* pagination buttons */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onNext={goToNextPage}
        onPrevious={goToPreviousPage}
        itemsCount={pendingReservations.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}

export default PendingReservationsList;
