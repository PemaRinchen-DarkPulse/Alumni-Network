import { HelpCircle, Bell, MessageCircle } from 'lucide-react'

interface DashboardHeaderProps {
  userName?: string
  userRole?: string
  userAvatar?: string
}

const DashboardHeader = ({ 
  userName = 'John Doe', 
  userRole = 'Class of 2020',
  userAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
}: DashboardHeaderProps) => {
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
          <img src={userAvatar} alt="Profile" />
          <div className="profile-info">
            <span className="profile-name">{userName}</span>
            <span className="profile-role">{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
