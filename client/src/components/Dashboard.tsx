import { useState } from 'react'
import {HelpCircle, Bell, GraduationCap, MessageCircle, ChevronLeft, LogOut } from 'lucide-react'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard')

  const mainMenuItems = [
    { name: 'Dashboard', icon: 'LayoutDashboard' },
    { name: 'Network', icon: 'Globe', badge: '24' },
    { name: 'Mentorship', icon: 'GraduationCap' },
    { name: 'Events', icon: 'Calendar' },
  ]

  const featureMenuItems = [
    { name: 'Messages', icon: 'MessageCircle', badge: '16' },
    { name: 'Opportunities', icon: 'Briefcase' },
    { name: 'Resources', icon: 'BookOpen' },
  ]

  const generalMenuItems = [
    { name: 'Settings', icon: 'Settings' },
    { name: 'Help Center', icon: 'HelpCircle' },
    { name: 'Log out', icon: 'LogOut' },
  ]

  const connectionStats = [
    { label: 'Total Connections', value: '1,248', change: '+12%', changeType: 'positive' },
    { label: 'Mentees', value: '8', change: '+2', changeType: 'positive' },
    { label: 'Mentors', value: '3', change: '+1', changeType: 'positive' },
  ]

  const recentConnections = [
    { name: 'Sarah Johnson', role: 'Software Engineer at Google', date: 'Wed, 12 Feb 2026', status: 'Connected' },
    { name: 'Michael Chen', role: 'Product Manager at Meta', date: 'Tue, 11 Feb 2026', status: 'Connected' },
    { name: 'Emily Williams', role: 'UX Designer at Apple', date: 'Sun, 09 Feb 2026', status: 'Pending' },
  ]

  const upcomingEvents = [
    { name: 'Alumni Networking Mixer', date: 'Feb 15, 2026', attendees: 45 },
    { name: 'Career Workshop: Tech Industry', date: 'Feb 20, 2026', attendees: 32 },
    { name: 'Mentorship Kickoff Session', date: 'Feb 25, 2026', attendees: 28 },
  ]

  const networkActivity = [
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 35 },
    { month: 'Mar', value: 25 },
    { month: 'Apr', value: 40 },
    { month: 'May', value: 30 },
    { month: 'Jun', value: 45 },
    { month: 'Jul', value: 55 },
    { month: 'Aug', value: 65 },
    { month: 'Sep', value: 50 },
    { month: 'Oct', value: 45 },
    { month: 'Nov', value: 40 },
    { month: 'Dec', value: 35 },
  ]

  const maxValue = Math.max(...networkActivity.map(item => item.value))

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <GraduationCap className="logo-icon" size={24} />
            <span className="logo-text">DGI Alumni</span>
          </div>
          <button className="sidebar-collapse"><ChevronLeft size={20} /></button>
        </div>


        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">MAIN MENU</span>
            {mainMenuItems.map((item) => {
              return (
                <button
                  key={item.name}
                  className={`nav-item ${activeMenu === item.name ? 'active' : ''}`}
                  onClick={() => setActiveMenu(item.name)}
                >
                  <span className="nav-label">{item.name}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </button>
              )
            })}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">FEATURES</span>
            {featureMenuItems.map((item) => {
              return (
                <button
                  key={item.name}
                  className={`nav-item ${activeMenu === item.name ? 'active' : ''}`}
                  onClick={() => setActiveMenu(item.name)}
                >
                  <span className="nav-label">{item.name}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </button>
              )
            })}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">GENERAL</span>
            {generalMenuItems.map((item) => {
              return (
                <button
                  key={item.name}
                  className={`nav-item ${activeMenu === item.name ? 'active' : ''}`}
                  onClick={() => setActiveMenu(item.name)}
                >
                  {item.name === 'Log out' && <LogOut size={20} />}
                  <span className="nav-label">{item.name}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-actions">
            <div className="header-icons">
              <button className="icon-btn"><HelpCircle size={24} /></button>
              <button className="icon-btn"><Bell size={24} /></button>
              <button className="icon-btn"><MessageCircle size={24} /></button>
            </div>
            <div className="header-profile">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Profile" />
              <div className="profile-info">
                <span className="profile-name">John Doe</span>
                <span className="profile-role">Class of 2020</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-row">
          {connectionStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">
                  {index === 0 ? '🌐' : index === 1 ? '👨‍🎓' : '👨‍🏫'}
                </span>
                <span className="stat-label">{stat.label}</span>
                {index === 0 && (
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

        {/* Quick Actions & Chart Row */}
        <div className="content-row">
          <div className="quick-actions-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="action-buttons">
              <button className="action-btn primary">
                <span>🤝</span> Connect
              </button>
              <button className="action-btn secondary">
                <span>📧</span> Request Mentorship
              </button>
            </div>
            
            <div className="my-profile">
              <h4>My Profile</h4>
              <span className="add-new">+ Edit Profile</span>
            </div>
            
            <div className="profile-cards">
              <div className="profile-card active">
                <span className="profile-flag">🎓</span>
                <div className="profile-info">
                  <span className="profile-type">Class of 2020</span>
                  <span className="profile-status">Active</span>
                </div>
              </div>
              <div className="profile-card">
                <span className="profile-flag">💼</span>
                <div className="profile-info">
                  <span className="profile-type">Mentor</span>
                  <span className="profile-status">Available</span>
                </div>
              </div>
            </div>
          </div>

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
                <span className="highlight-value">1,248</span>
              </div>
              <div className="bar-chart">
                {networkActivity.map((item, index) => (
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
        </div>

        {/* Goals & Transactions Row */}
        <div className="content-row">
          <div className="goals-card">
            <div className="card-header">
              <h3>🎯 My Goals</h3>
            </div>
            
            <div className="goal-item">
              <div className="goal-icon green">🎯</div>
              <div className="goal-info">
                <span className="goal-label">Networking Goal</span>
                <span className="goal-value">50/100 Connections</span>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '50%' }}></div>
                </div>
                <span className="progress-text">50%</span>
              </div>
            </div>

            <div className="goal-item">
              <div className="goal-icon gold">🏆</div>
              <div className="goal-info">
                <span className="goal-label">Mentorship Sessions</span>
                <span className="goal-value">8/12 Sessions</span>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div className="progress-fill gold" style={{ width: '67%' }}></div>
                </div>
                <span className="progress-text">67%</span>
              </div>
            </div>

            <div className="goal-item">
              <div className="goal-icon blue">📅</div>
              <div className="goal-info">
                <span className="goal-label">Events Attended</span>
                <span className="goal-value">5/10 Events</span>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div className="progress-fill blue" style={{ width: '50%' }}></div>
                </div>
                <span className="progress-text">50%</span>
              </div>
            </div>
          </div>

          <div className="transactions-card">
            <div className="card-header">
              <h3>🔗 Recent Connections</h3>
              <button className="filter-btn">
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
                {recentConnections.map((connection, index) => (
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
        </div>

        {/* Upcoming Events */}
        <div className="events-row">
          <div className="events-card">
            <div className="card-header">
              <h3>📅 Upcoming Events</h3>
              <button className="view-all-btn">View All →</button>
            </div>
            <div className="events-list">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="event-item">
                  <div className="event-icon">📅</div>
                  <div className="event-info">
                    <span className="event-name">{event.name}</span>
                    <span className="event-date">{event.date}</span>
                  </div>
                  <div className="event-attendees">
                    <span className="attendees-count">{event.attendees}</span>
                    <span className="attendees-label">attending</span>
                  </div>
                  <button className="event-join-btn">Join</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
