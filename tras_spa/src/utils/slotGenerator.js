export function generateFreeTimeSlots(selectedDate, selectedResource, selectedHour, allReservations, allResources) {
  // no date/resource selected
  if (selectedDate === '' || selectedResource === '') {
    return [];
  }

  const slots = [];
  
  const parsedResourceId = parseInt(selectedResource);
  
  // find resource
  const selectedResourceData = allResources.find(function(resource) {
    return resource.id === parsedResourceId;
  });
  
  if (!selectedResourceData) {
    return [];
  }

  const date = new Date(selectedDate);
  const currentDateTime = new Date();
  
  // closing at 18:00
  const closingTime = new Date(date);
  closingTime.setHours(18, 0, 0, 0);
  
  // generate slots 9:00-18:00 (every 30 min)
  for (let hour = 9; hour < 18; hour = hour + 0.5) {
    const startTime = new Date(date);
    startTime.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
    
    // calculate end time
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + selectedResourceData.duration);

    // skip if after closing
    const isAfterClosingTime = endTime > closingTime;
    
    if (isAfterClosingTime) {
      continue;
    }

    // skip if in the past (min 15 min advance)
    const isSameDay = date.getFullYear() === currentDateTime.getFullYear() &&
                      date.getMonth() === currentDateTime.getMonth() &&
                      date.getDate() === currentDateTime.getDate();
    
    const isInPast = isSameDay && startTime <= new Date(currentDateTime.getTime() + 900000);
    
    if (isInPast) {
      continue;
    }

    // check if occupied
    const isOccupied = allReservations.some(function(reservation) {
      if (reservation.status === 'rejected') {
        return false;
      }
      
      const reservationStart = new Date(reservation.startTime);
      const reservationEnd = new Date(reservation.endTime);
      
      // check overlap
      return (startTime < reservationEnd && endTime > reservationStart);
    });

    const slot = {
      startTime: startTime,
      endTime: endTime,
      isOccupied: isOccupied,
      display: hour + ':00 - ' + hour + ':' + selectedResourceData.duration
    };
    
    slots.push(slot);
  }

  // filter free slots
  const freeSlots = slots.filter(function(slot) {
    return slot.isOccupied === false;
  });

  // return first 4 if no hour filter
  if (selectedHour === '') {
    const firstFourSlots = freeSlots.slice(0, 4);
    return firstFourSlots;
  }
  
  // filter by hour using binary search
  return filterSlotsByHour(freeSlots, selectedHour, date);
}

// filter slots by hour using binary search
function filterSlotsByHour(freeSlots, selectedHour, date) {
  const selectedHourParts = selectedHour.split(':');
  const selectedHourNumber = parseInt(selectedHourParts[0]);
  const selectedMinuteNumber = parseInt(selectedHourParts[1]);
  
  const selectedDateTime = new Date(date);
  selectedDateTime.setHours(selectedHourNumber, selectedMinuteNumber, 0, 0);
  const selectedTime = selectedDateTime.getTime();
  
  // find split point
  const splitIndex = findFirstSlotAtOrAfter(freeSlots, selectedTime);
  
  const slotsAtOrAfter = freeSlots.slice(splitIndex);
  const slotsBefore = freeSlots.slice(0, splitIndex);
  
  const selectedSlots = [];
  
  // add slots >= selected time (max 4)
  for (let i = 0; i < slotsAtOrAfter.length && selectedSlots.length < 4; i = i + 1) {
    selectedSlots.push(slotsAtOrAfter[i]);
  }
  
  // fill with earlier slots if needed
  for (let i = slotsBefore.length - 1; i >= 0 && selectedSlots.length < 4; i = i - 1) {
    selectedSlots.push(slotsBefore[i]);
  }
  
  // sort chronologically
  selectedSlots.sort(function(a, b) {
    return a.startTime.getTime() - b.startTime.getTime();
  });
  
  return selectedSlots;
}

// binary search - find first slot >= target time
function findFirstSlotAtOrAfter(slots, targetTime) {
  let left = 0;
  let right = slots.length - 1;
  let result = slots.length; // default: all before target
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midTime = slots[mid].startTime.getTime();
    
    if (midTime >= targetTime) {
      result = mid; // found
      right = mid - 1; // search left
    } else {
      left = mid + 1; // search right
    }
  }
  
  return result;
}
