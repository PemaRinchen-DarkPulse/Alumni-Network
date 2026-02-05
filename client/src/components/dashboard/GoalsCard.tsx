interface Goal {
  label: string
  value: string
  progress: number
  icon: string
  color: 'green' | 'gold' | 'blue'
}

interface GoalsCardProps {
  goals: Goal[]
}

const GoalsCard = ({ goals }: GoalsCardProps) => {
  return (
    <div className="goals-card">
      <div className="card-header">
        <h3>🎯 My Goals</h3>
      </div>
      
      {goals.map((goal, index) => (
        <div key={index} className="goal-item">
          <div className={`goal-icon ${goal.color}`}>{goal.icon}</div>
          <div className="goal-info">
            <span className="goal-label">{goal.label}</span>
            <span className="goal-value">{goal.value}</span>
          </div>
          <div className="goal-progress">
            <div className="progress-bar">
              <div 
                className={`progress-fill ${goal.color}`} 
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{goal.progress}%</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default GoalsCard
