export function generateFreeTimeSlots(selectedDate, selectedResource, selectedHour, allReservations, allResources) {
  // if no date selected -> no slots
  if (selectedDate === '' || selectedResource === '') {
    return [];
  }

  // empty slots array 
  const slots = []; 
  
  // bug fix - parse resourceId to integer
  const parsedResourceId = parseInt(selectedResource); 
  
  // get selected resource data
  const selectedResourceData = allResources.find(function(resource) {
    return resource.id === parsedResourceId;
  });
  
  // empty if resource not found
  if (!selectedResourceData) {
    return [];
  }

  // date object from selected date
  const date = new Date(selectedDate);
  
  // current date and time
  const currentDateTime = new Date();
  
  // closing time to 18:00
  const closingTime = new Date(date);
  closingTime.setHours(18, 0, 0, 0);
  
  // generate all possible slots from 9:00 to 18:00 (every 30 minutes)
  for (let hour = 9; hour < 18; hour = hour + 0.5) {
    const startTime = new Date(date);
    // 9.0 = 9:00, 9.5 = 9:30
    startTime.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
    
    // calculate end time (start + service duration)
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + selectedResourceData.duration);

    // skip if slot ends after close
    const isAfterClosingTime = endTime > closingTime;
    
    if (isAfterClosingTime) {
      continue;
    }

    // skip if slot is in the past (minimum 15 minutes in advance)
    const isSameDay = date.getFullYear() === currentDateTime.getFullYear() &&
                      date.getMonth() === currentDateTime.getMonth() &&
                      date.getDate() === currentDateTime.getDate();
    
    const isInPast = isSameDay && startTime <= new Date(currentDateTime.getTime() + 900000);
    
    if (isInPast) {
      continue;
    }

    // check if slot is occupied by another reservation
    const isOccupied = allReservations.some(function(reservation) {
      if (reservation.status === 'rejected') {
        return false;
      }
      
      // convert reservation times to Date objects
      const reservationStart = new Date(reservation.startTime);
      const reservationEnd = new Date(reservation.endTime);
      
      // check if slots overlap
      return (startTime < reservationEnd && endTime > reservationStart);
    });

    // create slot object
    const slot = {
      startTime: startTime,
      endTime: endTime,
      isOccupied: isOccupied,
      display: hour + ':00 - ' + hour + ':' + selectedResourceData.duration
    };
    
    // add slot to array
    slots.push(slot);
  }

  // filter only free slots (not occupied)
  const freeSlots = slots.filter(function(slot) {
    return slot.isOccupied === false;
  });

  // return first 4 slots if no hour filter selected
  if (selectedHour === '') {
    const firstFourSlots = freeSlots.slice(0, 4);
    return firstFourSlots;
  }
  
  // filter by selected hour using divide and conquer algorithm
  return filterSlotsByHour(freeSlots, selectedHour, date);
}

// filter slots by selected hour using binary search
function filterSlotsByHour(freeSlots, selectedHour, date) {
  // parse selected hour (e.g., "14:30" -> 14 and 30)
  const selectedHourParts = selectedHour.split(':');
  const selectedHourNumber = parseInt(selectedHourParts[0]);
  const selectedMinuteNumber = parseInt(selectedHourParts[1]);
  
  // create Date object for selected hour
  const selectedDateTime = new Date(date);
  selectedDateTime.setHours(selectedHourNumber, selectedMinuteNumber, 0, 0);
  const selectedTime = selectedDateTime.getTime();
  
  // find split point using binary search
  const splitIndex = findFirstSlotAtOrAfter(freeSlots, selectedTime);
  
  // divide into slots >= selected time and < selected time
  const slotsAtOrAfter = freeSlots.slice(splitIndex); // From selected time onwards
  const slotsBefore = freeSlots.slice(0, splitIndex); // Before selected time
  
  // select max 4 slots, preferring slots >= selected time
  const selectedSlots = [];
  
  // first add slots >= selected time (max 4)
  for (let i = 0; i < slotsAtOrAfter.length && selectedSlots.length < 4; i = i + 1) {
    selectedSlots.push(slotsAtOrAfter[i]);
  }
  
  // if less than 4, fill with slots before selected time
  for (let i = slotsBefore.length - 1; i >= 0 && selectedSlots.length < 4; i = i - 1) {
    selectedSlots.push(slotsBefore[i]);
  }
  
  // sort result chronologically (earliest to latest)
  selectedSlots.sort(function(a, b) {
    return a.startTime.getTime() - b.startTime.getTime();
  });
  
  return selectedSlots;
}

// binary search - find index of first slot >= selected time
function findFirstSlotAtOrAfter(slots, targetTime) {
  let left = 0;
  let right = slots.length - 1;
  let result = slots.length; // default: all slots are before target
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midTime = slots[mid].startTime.getTime();
    
    if (midTime >= targetTime) {
      result = mid; // found slot >= targetTime
      right = mid - 1; // search left half (earlier slots)
    } else {
      left = mid + 1; // search right half (later slots)
    }
  }
  
  return result;
}
