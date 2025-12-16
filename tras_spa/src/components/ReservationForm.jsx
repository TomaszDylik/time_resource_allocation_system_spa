function ReservationForm(props) {
  const allResources = props.allResources; // all services
  const selectedResource = props.selectedResource; // selected service id
  const handleResourceChange = props.handleResourceChange; // on change handler
  const selectedDate = props.selectedDate; // selected date
  const handleDateChange = props.handleDateChange; // on change handler
  const selectedHour = props.selectedHour; // optional hour filter
  const handleHourChange = props.handleHourChange; // on change handler
  const hourOptions = props.hourOptions; // hour options list
  const availableSlots = props.availableSlots; // available time slots
  const handleReservation = props.handleReservation; // create reservation
  const shouldShowNoSlots = props.shouldShowNoSlots; // show no slots message 
  
  return (
    <div className="section-card">
      <h2 className="section-title">Zarezerwuj termin</h2>
      
      <div className="reservation-form-grid">
        <div className="form-field">
          <label className="field-label">Wybierz usługę:</label>
          <select className="field-select" value={selectedResource} onChange={handleResourceChange}>
            <option value="">-- Wybierz usługę --</option>
            
            {allResources.map(function(resource) {
              return (
                <option key={resource.id} value={resource.id}>
                  {resource.name} ({resource.duration} min)
                </option>
              );
            })}
          </select>
        </div>


        <div className="form-field">
          <label className="field-label">Wybierz datę:</label>
          <input 
            className="field-input"
            type="date" 
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-field" style={{ gridColumn: '1 / -1' }}>
          <label className="field-label">Wybierz godzinę (opcjonalnie):</label>
          <select className="field-select" value={selectedHour} onChange={handleHourChange}>
            <option value="">-- Wszystkie godziny --</option>
            
            {hourOptions.map(function(hourOption) {
              return (
                <option key={hourOption} value={hourOption}>
                  {hourOption}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {availableSlots.length > 0 && (
        <div className="slots-section">
          <h3 className="slots-title">Dostępne terminy (4 najbliższe {selectedHour !== '' ? 'dla godziny ' + selectedHour : ''}):</h3>
          <div className="slots-grid">
            {availableSlots.map(function(slot, index) {
              function handleSlotReservation() {
                handleReservation(slot);
              }
              
              return (
                <div key={index} className="slot-card">
                  <span className="slot-time">
                    {slot.startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} - {slot.endTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button className="slot-button" onClick={handleSlotReservation}>Zarezerwuj</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {shouldShowNoSlots && (
        <p className="no-slots-message">Brak dostępnych terminów w wybranym dniu.</p>
      )}
    </div>
  );
}

export default ReservationForm;
