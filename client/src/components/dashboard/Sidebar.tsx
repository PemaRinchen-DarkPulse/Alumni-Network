import { GraduationCap, LogOut } from 'lucide-react'

interface MenuItem {
  name: string
  icon: string
  badge?: string
}

interface SidebarProps {
  activeMenu: string
  onMenuClick: (menuName: string) => void
  mainMenuItems: MenuItem[]
  featureMenuItems: MenuItem[]
  generalMenuItems: MenuItem[]
}

const Sidebar = ({ 
  activeMenu, 
  onMenuClick, 
  mainMenuItems, 
  featureMenuItems, 
  generalMenuItems 
}: SidebarProps) => {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <GraduationCap className="logo-icon" size={24} />
          <span className="logo-text">DGI Alumni</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">MAIN MENU</span>
          {mainMenuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${activeMenu === item.name ? 'active' : ''}`}
              onClick={() => onMenuClick(item.name)}
            >
              <span className="nav-label">{item.name}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </div>

        <div className="nav-section">
          <span className="nav-section-title">FEATURES</span>
          {featureMenuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${activeMenu === item.name ? 'active' : ''}`}
              onClick={() => onMenuClick(item.name)}
            >
              <span className="nav-label">{item.name}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </div>

        <div className="nav-section">
          <span className="nav-section-title">GENERAL</span>
          {generalMenuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${activeMenu === item.name ? 'active' : ''}`}
              onClick={() => onMenuClick(item.name)}
            >
              {item.name === 'Log out' && <LogOut size={20} />}
              <span className="nav-label">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
