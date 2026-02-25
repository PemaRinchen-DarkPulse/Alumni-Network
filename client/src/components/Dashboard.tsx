import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './dashboard/Sidebar'
import DashboardHeader from './dashboard/DashboardHeader'
import StatsRow from './dashboard/StatsRow'
import QuickActionsCard from './dashboard/QuickActionsCard'
import NetworkActivityChart from './dashboard/NetworkActivityChart'
import GoalsCard from './dashboard/GoalsCard'
import RecentConnectionsTable from './dashboard/RecentConnectionsTable'
import UpcomingEventsCard from './dashboard/UpcomingEventsCard'
import Events from './Events'
import Tributes from './Tributes'
import Networking from './Networking'
import Mentorship from './Mentorship'
import Blog from './Blog'
import Settings from './Settings'
import Nexus from './Nexus'
import { useAuth } from '../context/AuthContext'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleMenuClick = (menuName: string) => {
    if (menuName === 'Log out') {
      navigate('/', { replace: true })
      setTimeout(() => {
        logout()
      }, 100)
    } else {
      setActiveMenu(menuName)
    }
  }

  // Dynamically generate menu items based on user role
  const mainMenuItems = useMemo(() => {
    const role = user?.role?.toLowerCase()
    
    const baseItems = [
      { name: 'Dashboard', icon: 'LayoutDashboard' },
      { name: 'Networking', icon: 'Globe', badge: '24' },
    ]

    if (role === 'student' || role === 'alumni') {
      return [
        ...baseItems,
        { name: 'Community Mentorship', icon: 'GraduationCap' },
        { name: 'Events', icon: 'Calendar' },
      ]
    } else if (role === 'teacher') {
      return [
        ...baseItems,
        { name: 'Events', icon: 'Calendar' },
      ]
    }

    // Default menu items
    return baseItems
  }, [user?.role])

  const featureMenuItems = useMemo(() => {
    const role = user?.role?.toLowerCase()
    
    const baseItems = [
      { name: 'Nexus', icon: 'Network' },
      { name: 'Blogs', icon: 'BookOpen' },
      { name: 'Tribute', icon: 'Heart' },
    ]

    if (role === 'teacher') {
      return [
        ...baseItems,
        { name: 'Feedback', icon: 'MessageSquare' },
      ]
    }

    // For students and alumni, return base items
    return baseItems
  }, [user?.role])

  const generalMenuItems = [
    { name: 'Settings', icon: 'Settings' },
    { name: 'Help Center', icon: 'HelpCircle' },
    { name: 'Log out', icon: 'LogOut' },
  ]

  const connectionStats = [
    { label: 'Total Connections', value: '1,248', change: '+12%', changeType: 'positive' as const, showFilter: true },
    { label: 'Mentees', value: '8', change: '+2', changeType: 'positive' as const },
    { label: 'Mentors', value: '3', change: '+1', changeType: 'positive' as const },
  ]

  const recentConnections = [
    { name: 'Sarah Johnson', role: 'Software Engineer at Google', date: 'Wed, 12 Feb 2026', status: 'Connected' as const },
    { name: 'Michael Chen', role: 'Product Manager at Meta', date: 'Tue, 11 Feb 2026', status: 'Connected' as const },
    { name: 'Emily Williams', role: 'UX Designer at Apple', date: 'Sun, 09 Feb 2026', status: 'Pending' as const },
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

  const goals = [
    { label: 'Networking Goal', value: '50/100 Connections', progress: 50, icon: '🎯', color: 'green' as const },
    { label: 'Mentorship Sessions', value: '8/12 Sessions', progress: 67, icon: '🏆', color: 'gold' as const },
    { label: 'Events Attended', value: '5/10 Events', progress: 50, icon: '📅', color: 'blue' as const },
  ]

  return (
    <div className="dashboard">
      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
        mainMenuItems={mainMenuItems}
        featureMenuItems={featureMenuItems}
        generalMenuItems={generalMenuItems}
      />

      <main className="dashboard-main">
        <DashboardHeader 
          userName={user?.name || 'User'}
          userRole={user?.role || 'Member'}
          userBatch={user?.batch}
        />

        {activeMenu === 'Events' ? (
          <Events />
        ) : activeMenu === 'Tribute' ? (
          <Tributes />
        ) : activeMenu === 'Networking' ? (
          <Networking />
        ) : activeMenu === 'Community Mentorship' ? (
          <Mentorship />
        ) : activeMenu === 'Blogs' ? (
          <Blog />
        ) : activeMenu === 'Nexus' ? (
          <Nexus />
        ) : activeMenu === 'Settings' ? (
          <Settings />
        ) : (
          <>
            <StatsRow stats={connectionStats} />

            <div className="content-row">
              <QuickActionsCard 
                userBatch={user?.batch}
                userRole={user?.role}
              />
              <NetworkActivityChart data={networkActivity} />
            </div>

            <div className="content-row">
              <GoalsCard goals={goals} />
              <RecentConnectionsTable connections={recentConnections} />
            </div>

            <UpcomingEventsCard events={upcomingEvents} />
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard
