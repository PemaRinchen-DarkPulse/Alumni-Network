interface StatCardData {
  label: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon?: string
  showFilter?: boolean
}

interface StatsRowProps {
  stats: StatCardData[]
}

const StatsRow = ({ stats }: StatsRowProps) => {
  const getIcon = (index: number) => {
    return index === 0 ? '🌐' : index === 1 ? '👨‍🎓' : '👨‍🏫'
  }

  return (
    <div className="stats-row">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">
              {stat.icon || getIcon(index)}
            </span>
            <span className="stat-label">{stat.label}</span>
            {stat.showFilter && (
              <select className="stat-filter">
                <option>All</option>
                <option>Alumni</option>
                <option>Students</option>
              </select>
            )}
          </div>
          <div className="stat-value">{stat.value}</div>
          <div className={`stat-change ${stat.changeType}`}>
            <span>{stat.change}</span>
            <span className="change-text">from last month</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsRow
