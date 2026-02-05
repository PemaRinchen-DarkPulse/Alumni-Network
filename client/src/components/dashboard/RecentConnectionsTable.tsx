interface Connection {
  name: string
  role: string
  date: string
  status: 'Connected' | 'Pending'
}

interface RecentConnectionsTableProps {
  connections: Connection[]
  onFilterClick?: () => void
}

const RecentConnectionsTable = ({ connections, onFilterClick }: RecentConnectionsTableProps) => {
  return (
    <div className="transactions-card">
      <div className="card-header">
        <h3>🔗 Recent Connections</h3>
        <button className="filter-btn" onClick={onFilterClick}>
          Filter <span>🔽</span>
        </button>
      </div>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Date</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((connection, index) => (
            <tr key={index}>
              <td>
                <div className="member-cell">
                  <span className="member-avatar">
                    {connection.name.split(' ').map(n => n[0]).join('')}
                  </span>
                  <span>{connection.name}</span>
                </div>
              </td>
              <td>{connection.date}</td>
              <td className="role-cell">{connection.role}</td>
              <td>
                <span className={`status-badge ${connection.status.toLowerCase()}`}>
                  ● {connection.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentConnectionsTable
