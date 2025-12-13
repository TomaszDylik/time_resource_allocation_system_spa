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
    <div>
      <h2>Zarezerwuj termin</h2>
      
      <div>
        <label>Wybierz usługę:</label>
        <select value={selectedResource} onChange={handleResourceChange}>
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


      <div>
        <label>Wybierz datę:</label>
        <input 
          type="date" 
          value={selectedDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]} // today minimum
        />
      </div>

      <div>
        <label>Wybierz godzinę (opcjonalnie):</label>
        <select value={selectedHour} onChange={handleHourChange}>
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

      {/* availaiable slots */}
      {availableSlots.length > 0 && (
        <div>
          <h3>Dostępne terminy (4 najbliższe {selectedHour !== '' ? 'dla godziny ' + selectedHour : ''}):</h3>
          <div>
            {availableSlots.map(function(slot, index) {
              function handleSlotReservation() {
                handleReservation(slot);
              }
              
              return (
                <div key={index}>
                  <span>
                    {slot.startTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} - {slot.endTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button onClick={handleSlotReservation}>Zarezerwuj</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* no slots available */}
      {shouldShowNoSlots && (
        <p>Brak dostępnych terminów w wybranym dniu.</p>
      )}
    </div>
  );
}

export default ReservationForm;
