import { HelpCircle, Bell, MessageCircle } from 'lucide-react'

interface DashboardHeaderProps {
  userName: string
  userRole: string
  userBatch?: string
  userAvatar?: string | null
}

const DashboardHeader = ({ 
  userName, 
  userRole,
  userBatch,
  userAvatar
}: DashboardHeaderProps) => {
  const displayRole = userBatch ? `Class of ${userBatch}` : userRole
  const avatarLetter = userName.charAt(0).toUpperCase()
  
  return (
    <header className="dashboard-header">
      <div className="header-actions">
        <div className="header-icons">
          <button className="icon-btn">
            <HelpCircle size={24} />
          </button>
          <button className="icon-btn">
            <Bell size={24} />
          </button>
          <button className="icon-btn">
            <MessageCircle size={24} />
          </button>
        </div>
        <div className="header-profile">
          {userAvatar ? (
            <img src={userAvatar} alt="Profile" />
          ) : (
            <div className="profile-avatar-letter">
              {avatarLetter}
            </div>
          )}
          <div className="profile-info">
            <span className="profile-name">{userName}</span>
            <span className="profile-role">{displayRole}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
