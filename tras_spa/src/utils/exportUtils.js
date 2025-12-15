export const exportReservationsToCSV = (reservations, resources, users) => {
  // CSV header
  const header = 'Data,Godzina rozpoczęcia,Godzina zakończenia,Usługa,Klient,Email,Status\n';

  // convert reservations to CSV rows
  const rows = reservations
    .map((reservation) => {
      const resource = resources.find((r) => r.id === reservation.resourceId);
      const user = users.find((u) => u.id === reservation.userId);

      const startDate = new Date(reservation.startTime);
      const endDate = new Date(reservation.endTime);

      const date = startDate.toLocaleDateString('pl-PL');
      const startTime = startDate.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const endTime = endDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
      const serviceName = resource.name;
      const userName = user.name;
      const userEmail = user.email;
      const status = reservation.status;

      return `${date},${startTime},${endTime},"${serviceName}","${userName}",${userEmail},${status}`;
    })
    .join('\n');

  // header and rows
  const csvContent = header + rows;

  // create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `rezerwacje.csv`;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // clean up the url
  URL.revokeObjectURL(url);
};

export const exportAllReservations = (reservations, resources, users) => {
  exportReservationsToCSV(reservations, resources, users);
};
