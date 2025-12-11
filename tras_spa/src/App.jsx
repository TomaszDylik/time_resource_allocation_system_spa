import { useDatabase } from './context/DatabaseContext';

function App() {
  const { users, resources, reservations } = useDatabase();

  return (
    <div>
      <h1>Test bazy</h1>

      <div>
        <h3>Użytkownicy ({users.length})</h3>
        <ul>
          {users.map(u => (
            <li key={u.id}>
              {u.name} ({u.role})
            </li>
          ))}
        </ul>

        <h3>Zasoby ({resources.length})</h3>
        <ul>
          {resources.map(r => (
            <li key={r.id}>
              {r.name} ({r.type})
            </li>
          ))}
        </ul>

        <h3>Rezerwacje ({reservations.length})</h3>
        <ul>
          {reservations.map(res => (
            <li key={res.id}>
              ID: {res.id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;