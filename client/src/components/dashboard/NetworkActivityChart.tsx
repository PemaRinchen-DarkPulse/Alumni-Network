interface NetworkActivityData {
  month: string
  value: number
}

interface NetworkActivityChartProps {
  data: NetworkActivityData[]
  totalConnections?: string
}

const NetworkActivityChart = ({ 
  data, 
  totalConnections = '1,248' 
}: NetworkActivityChartProps) => {
  const maxValue = Math.max(...data.map(item => item.value))

  return (
    <div className="chart-card">
      <div className="card-header">
        <h3>Network Activity</h3>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot connections"></span>
            Connections
          </span>
          <select className="chart-filter">
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>
      <div className="chart-container">
        <div className="chart-highlight">
          <span className="highlight-label">Connections</span>
          <span className="highlight-value">{totalConnections}</span>
        </div>
        <div className="bar-chart">
          {data.map((item, index) => (
            <div key={index} className="bar-column">
              <div 
                className={`bar ${index === 7 ? 'highlighted' : ''}`}
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              >
                {index === 7 && (
                  <div className="bar-tooltip">
                    <span className="tooltip-value">{item.value}</span>
                  </div>
                )}
              </div>
              <span className="bar-label">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NetworkActivityChart
