import { useState, useEffect } from 'react';
import PaginationControls from './PaginationControls';

function RejectedReservations(props) {
  const reservations = props.reservations;
  const allResources = props.allResources;
  const allUsers = props.allUsers;
  const isAdminView = props.isAdminView || false;
  
  // pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // pagination logic
  const itemsPerPage = isMobile ? 1 : 4;
  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = reservations.slice(startIndex, endIndex);
  
  // reset page if out of bounds
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(0);
    }
  }, [totalPages, currentPage]);
  
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return (
    <div className="rejected-reservations">
      <h3>Odrzucone rezerwacje</h3>
      
      {reservations.length === 0 ? (
        <p className="no-reservations">Brak odrzuconych rezerwacji.</p>
      ) : (
        <>
          <div className="reservations-list">
            {currentReservations.map((reservation) => {
              const resource = allResources.find((r) => r.id === reservation.resourceId);
              
              const user = isAdminView ? allUsers.find((u) => u.id === reservation.userId) : null;
              
              const startDate = new Date(reservation.startTime);
              const endDate = new Date(reservation.endTime);
              
              return (
                <div key={reservation.id} className="reservation-card rejected-card">
                  <div className="card-header">
                    <span className="service-name">{resource?.name || 'Usługa usunięta'}</span>
                    <span className="badge rejected"> - Odrzucone</span>
                  </div>
                  
                  <div className="card-content">
                    {isAdminView && user && (
                      <p className="user-info">
                        <strong>Użytkownik:</strong> {user.name} ({user.email})
                      </p>
                    )}
                    
                    <p className="date-info">
                      <strong>Data:</strong> {startDate.toLocaleDateString('pl-PL', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    
                    <p className="time-info">
                      <strong>Godzina:</strong> {startDate.toLocaleTimeString('pl-PL', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {endDate.toLocaleTimeString('pl-PL', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={handleNext}
            onPrevious={handlePrevious}
            itemsCount={reservations.length}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}
    </div>
  );
}

export default RejectedReservations;
