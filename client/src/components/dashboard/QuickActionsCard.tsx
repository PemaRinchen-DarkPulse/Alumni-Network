interface QuickActionsCardProps {
  userBatch?: string
  userRole?: string
  onConnectClick?: () => void
  onMentorshipClick?: () => void
  onEditProfileClick?: () => void
}

const QuickActionsCard = ({ 
  userBatch,
  userRole,
  onConnectClick, 
  onMentorshipClick,
  onEditProfileClick 
}: QuickActionsCardProps) => {
  const displayBatch = userBatch ? `Class of ${userBatch}` : 'Not specified'
  const isMentor = userRole?.toLowerCase() === 'teacher' || userRole?.toLowerCase() === 'alumni'
  
  return (
    <div className="quick-actions-card">
      <div className="card-header">
        <h3>Quick Actions</h3>
      </div>
      <div className="action-buttons">
        <button className="action-btn primary" onClick={onConnectClick}>
          <span>🤝</span> Connect
        </button>
        <button className="action-btn secondary" onClick={onMentorshipClick}>
          <span>📧</span> Request Mentorship
        </button>
      </div>
      
      <div className="my-profile">
        <h4>My Profile</h4>
        <span className="add-new" onClick={onEditProfileClick}>+ Edit Profile</span>
      </div>
      
      <div className="profile-cards">
        <div className="profile-card active">
          <span className="profile-flag">🎓</span>
          <div className="profile-info">
            <span className="profile-type">{displayBatch}</span>
            <span className="profile-status">Active</span>
          </div>
        </div>
        {isMentor && (
          <div className="profile-card">
            <span className="profile-flag">💼</span>
            <div className="profile-info">
              <span className="profile-type">Mentor</span>
              <span className="profile-status">Available</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuickActionsCard
