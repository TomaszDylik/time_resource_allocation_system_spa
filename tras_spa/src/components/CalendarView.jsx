import { useState, useEffect } from 'react';

function CalendarView(props) {
  const reservations = props.reservations; 
  const allResources = props.allResources;
  const allUsers = props.allUsers; 
  const isAdminView = props.isAdminView || false;
  const onReservationClick = props.onReservationClick;
  
  // mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // get monday of week
  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 0 = sunday
    return new Date(d.setDate(diff));
  };
  
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  
  useEffect(() => {
    setWeekStart(getMonday(new Date()));
  }, [isMobile]);
  
  // navigation
  const goToPrevious = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() - (isMobile ? 1 : 7)); // mobile: 1 day, desktop: 7 days
    setWeekStart(newDate);
  };
  
  const goToNext = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + (isMobile ? 1 : 7));
    setWeekStart(newDate);
  };
  
  // generate days (1 mobile, 7 desktop)
  const daysToShow = isMobile ? 1 : 7;
  const days = [];
  for (let i = 0; i < daysToShow; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    days.push(day);
  }
  
  // time slots 9:00-18:00
  const timeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    timeSlots.push(hour);
  }
  
  // filter reservations for view
  const viewStart = days[0].setHours(0, 0, 0, 0);
  const viewEnd = days[days.length - 1].setHours(23, 59, 59, 999);
  
  const visibleReservations = reservations.filter((reservation) => {
    return reservation.startTime >= viewStart && reservation.startTime <= viewEnd;
  });
  
  // get tile position and height
  const getReservationStyle = (reservation) => {
    const startDate = new Date(reservation.startTime);
    const endDate = new Date(reservation.endTime);
    
    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();
    const duration = (endDate - startDate) / (1000 * 60); // minutes
    
    const cellHeight = 100;
    const top = ((startHour - 9) * cellHeight + (startMinute * cellHeight / 60));
    const height = (duration * cellHeight / 60);
    
    return {
      top: `${top}px`,
      height: `${height}px`
    };
  };
  
  const isReservationOnDay = (reservation, day) => {
    const reservationDate = new Date(reservation.startTime);
    return (
      reservationDate.getDate() === day.getDate() &&
      reservationDate.getMonth() === day.getMonth() &&
      reservationDate.getFullYear() === day.getFullYear()
    );
  };
  
  return (
    <div className="calendar-view" key={isMobile ? 'mobile' : 'desktop'}>
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={goToPrevious}>
          ← {isMobile ? 'Poprzedni dzień' : 'Poprzedni tydzień'}
        </button>
        
        <div className="calendar-title">
          {isMobile ? (
            <h3>{days[0].toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
          ) : (
            <h3>
              {days[0].toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })} - {" "} 
              {days[6].toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
          )}
        </div>
        
        <button className="calendar-nav-btn" onClick={goToNext}>
          {isMobile ? 'Następny dzień' : 'Następny tydzień'} →
        </button>
      </div>
      
      <div className="calendar-grid">
        <div className="time-column">
          <div className="time-header"></div>
          {timeSlots.map(function(hour) {
            return (
              <div key={hour} className="time-slot">
                {hour}:00
              </div>
            );
          })}
        </div>
        
        {days.map((day, dayIndex) => {
          const dayReservations = visibleReservations.filter((reservation) => {
            return isReservationOnDay(reservation, day);
          });
          
          const isToday = new Date().toDateString() === day.toDateString();
          
          return (
            <div key={dayIndex} className={`day-column ${isToday ? 'today' : ''}`}>
              <div className="day-header">
                <div className="day-name">{day.toLocaleDateString('pl-PL', { weekday: 'short' })}</div>
                <div className="day-date">{day.getDate()}</div>
              </div>
              
              <div className="day-grid">
                {timeSlots.map((hour) => {
                  return <div key={hour} className="grid-cell"></div>;
                })}
                
                {dayReservations.map((reservation) => {
                  const resource = allResources.find((r) => {
                    return r.id === reservation.resourceId;
                  });
                  
                  const user = isAdminView ? allUsers.find((u) => {
                    return u.id === reservation.userId;
                  }) : null;
                  
                  const startTime = new Date(reservation.startTime);
                  const endTime = new Date(reservation.endTime);
                  const durationMinutes = (endTime - startTime) / (1000 * 60);
                  const isSmall = durationMinutes < 45;
                  
                  return (
                    <div
                      key={reservation.id}
                      className={`reservation-tile ${reservation.status} ${isSmall ? 'is-small' : ''}`}
                      style={getReservationStyle(reservation)}
                    >
                      <div className="tile-time">
                        {startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="tile-service">{resource?.name}</div>
                      {isAdminView && user && (
                        <div className="tile-user">{user.name}</div>
                      )}
                      
                      {isAdminView && reservation.status === 'pending' && (
                        <div className="tile-actions" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="tile-action-btn approve"
                            onClick={() => props.onApprove && props.onApprove(reservation.id)}
                            title="Zatwierdź"
                          >
                            ✓
                          </button>
                          <button 
                            className="tile-action-btn reject"
                            onClick={() => props.onReject && props.onReject(reservation.id)}
                            title="Odrzuć"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                      
                      {isAdminView && (reservation.status === 'approved' || reservation.status === 'completed') && (
                        <div className="tile-actions" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="tile-action-btn delete"
                            onClick={() => onReservationClick && onReservationClick(reservation)}
                            title="Usuń"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                      
                      {!isAdminView && (reservation.status === 'pending' || reservation.status === 'approved') && (
                        <div className="tile-actions" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="tile-action-btn delete"
                            onClick={() => onReservationClick && onReservationClick(reservation)}
                            title="Usuń/Anuluj"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarView;
