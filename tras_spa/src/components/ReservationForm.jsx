function ReservationForm(props) {
  const allResources = props.allResources; // all services in barber
  const selectedResource = props.selectedResource; // ID choosen service
  const handleResourceChange = props.handleResourceChange; // user changes selection of service
  const selectedDate = props.selectedDate; // selected date
  const handleDateChange = props.handleDateChange; // user changes selection of date
  const selectedHour = props.selectedHour; // user selected hour (optional) 
  const handleHourChange = props.handleHourChange; // user changes selection of hour
  const hourOptions = props.hourOptions; // list of all possible hours (9:00, 9:30, ...)
  const availableSlots = props.availableSlots; // list of available slots 
  const handleReservation = props.handleReservation; // function creating a new reservation
  const shouldShowNoSlots = props.shouldShowNoSlots; // "No available slots" message 
  
  return (
    <div className="section-card">
      <h2 className="section-title">Zarezerwuj termin</h2>
      
      <div className="reservation-form-grid">
        <div className="form-field">
          <label className="field-label">Wybierz usługę:</label>
          <select className="field-select" value={selectedResource} onChange={handleResourceChange}>
            <option value="">-- Wybierz usługę --</option>
            
            {/*generate all services as options*/}
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
            min={new Date().toISOString().split('T')[0]} // today minimum
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

      {/* availaiable slots */}
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

      {/* no slots available */}
      {shouldShowNoSlots && (
        <p className="no-slots-message">Brak dostępnych terminów w wybranym dniu.</p>
      )}
    </div>
  );
}

export default ReservationForm;
