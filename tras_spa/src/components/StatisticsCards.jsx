import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function StatisticsCards({ reservations, resources }) {
  // monthly occupancy analytics - memoized
  const analytics = useMemo(function() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // filter current month
    const monthReservations = reservations.filter(function(r) {
      const resDate = new Date(r.startTime);
      return resDate.getMonth() === currentMonth && 
             resDate.getFullYear() === currentYear &&
             (r.status === 'pending' || r.status === 'approved' || r.status === 'completed');
    });
    
    // total hours (days * 9h per day)
    const totalAvailableHours = daysInMonth * 9;
    
    const occupiedHours = monthReservations.length;
    
    // percentages
    const occupancyRate = Math.round((occupiedHours / totalAvailableHours) * 100);
    const freeRate = 100 - occupancyRate;
    
    return {
      occupancyRate,
      freeRate,
      occupiedHours,
      totalAvailableHours
    };
  }, [reservations]);

  const chartData = [
    { name: 'Zajęte', value: analytics.occupancyRate },
    { name: 'Wolne', value: analytics.freeRate }
  ];

  return (
    <div className="analytics-module">
      <h3>Obłożenie w miesiącu</h3>
      <div className="analytics-chart">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label={function(entry) { return entry.name + ': ' + entry.value + '%'; }}
            >
              <Cell fill="#10b981" />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <p className="analytics-info">
          {analytics.occupiedHours} / {analytics.totalAvailableHours} godzin ({analytics.occupancyRate}%)
        </p>
      </div>
    </div>
  );
}

export default StatisticsCards;
