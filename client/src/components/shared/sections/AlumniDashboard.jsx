import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  BookOpen, 
  Users, 
  PenTool, 
  Calendar, 
  Briefcase, 
  Heart,
  TrendingUp,
  MapPin,
  Clock,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const StatCard = ({ icon: Icon, label, value, change, iconBg, iconColor }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -5 }}
    className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          <p className="text-sm text-gray-600">{label}</p>
        </div>
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="w-3 h-3 text-green-500" />
          <span className="text-xs font-medium text-green-500">{change}</span>
        </div>
      </div>
      <div className={`p-3 rounded-lg ${iconBg}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  </motion.div>
);

const ActionCard = ({ icon: Icon, title, description, iconColor, iconBg }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -5 }}
    className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 cursor-pointer transition-all hover:shadow-md hover:border-blue-200"
  >
    <div className={`inline-flex p-3 rounded-lg ${iconBg} mb-4`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </motion.div>
);

const ActivityPost = ({ user, avatar, time, content, badge }) => (
  <motion.div
    variants={itemVariants}
    className="border-b border-gray-100 pb-4 last:border-0"
  >
    <div className="flex gap-3">
      <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
        {avatar ? (
          <AvatarImage src={avatar} />
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            {user.charAt(0)}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{user}</span>
              {badge && <span className="text-xs text-blue-600">• {badge}</span>}
            </div>
            <span className="text-sm text-gray-500">{time}</span>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">{content}</p>
        
        {/* React and Share Actions */}
        <div className="flex items-center gap-4 pt-3">
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm font-medium">React</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Comment</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const UpcomingEvent = ({ month, day, title, location, time }) => (
  <motion.div
    variants={itemVariants}
    className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
  >
    <div className="flex flex-col items-center justify-center bg-blue-600 text-white rounded-lg p-3 min-w-[60px]">
      <span className="text-xs font-medium uppercase">{month}</span>
      <span className="text-2xl font-bold">{day}</span>
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const AlumniDashboard = () => {
  const { user } = useAuth();
  const userName = user?.name?.split(' ')[0] || 'Alex';

  // Mock data - replace with actual API calls
  const stats = [
    { 
      icon: Eye, 
      label: 'Profile Views', 
      value: 1240, 
      change: '+12%',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      icon: BookOpen, 
      label: 'Blog Reads', 
      value: 450, 
      change: '+5%',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    { 
      icon: Users, 
      label: 'Students Mentored', 
      value: 12, 
      change: '+2%',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  const quickActions = [
    {
      icon: PenTool,
      title: 'Write a Blog',
      description: 'Share your expertise',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50'
    },
    {
      icon: Calendar,
      title: 'Create Event',
      description: 'Host a meetup',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50'
    },
    {
      icon: Briefcase,
      title: 'Post a Job',
      description: 'Hire graduates',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50'
    },
    {
      icon: Heart,
      title: 'Give Back',
      description: 'Donate to fund',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50'
    }
  ];

  const activities = [
    {
      user: 'Sonam Tshering',
      badge: 'Class of 2015',
      time: '2 hours ago',
      content: 'Just finished hosting the annual "Tech in Finance" webinar! It was amazing to see so many current students interested in fintech. If anyone wants the slides, feel free to connect and DM me. 🚀'
    },
    {
      user: 'Tashi Dorji',
      badge: 'Class of 2018',
      time: '5 hours ago',
      content: 'Excited to announce that our startup just closed Series A funding! Looking to hire talented developers from our alma mater. Check out the careers page!'
    }
  ];

  const upcomingEvents = [
    {
      month: 'OCT',
      day: '15',
      title: 'Annual Alumni Gala Dinner',
      location: 'Grand Hall',
      time: '7:00 PM'
    },
    {
      month: 'NOV',
      day: '02',
      title: 'Regional Networking Night',
      location: 'Downtown Center',
      time: '6:30 PM'
    },
    {
      month: 'NOV',
      day: '10',
      title: 'Webinar: Future of AI',
      location: 'Online',
      time: '1:00 PM'
    }
  ];

  return (
    <motion.div
      className="max-w-7xl mx-auto p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Welcome back, {userName}
          </h1>
          <p className="text-gray-600">Here's what's happening with your network today.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          + Share Update
        </Button>
      </motion.div>

      {/* Main Content Grid: Shortcuts + Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Shortcuts Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="p-2 rounded-lg bg-blue-50">
                  <PenTool className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Write a Blog</p>
                  <p className="text-xs text-gray-500">Share your expertise</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Create Event</p>
                  <p className="text-xs text-gray-500">Host a meetup</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="p-2 rounded-lg bg-green-50">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Post a Job</p>
                  <p className="text-xs text-gray-500">Hire graduates</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="p-2 rounded-lg bg-orange-50">
                  <Heart className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Give Back</p>
                  <p className="text-xs text-gray-500">Donate to fund</p>
                </div>
              </button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mentorship Program Banner */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-3 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg"
        >
        <div className="flex flex-col md:flex-row items-stretch h-full">
          <div className="w-full md:w-2/5 h-full">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
              alt="Students collaborating"
              className="rounded-l-2xl w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-white p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-3">
              Reconnect with your roots
            </h2>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Join the new mentorship program and guide the next generation of students. 
              Your experience can shape their future.
            </p>
            <div className="flex gap-3">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                Join Program
              </Button>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
      </div>

      {/* Happening Now & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Happening Now */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl">Happening Now</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {activities.map((activity, index) => (
                <ActivityPost key={index} {...activity} />
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Upcoming Events</CardTitle>
              <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingEvents.map((event, index) => (
                <UpcomingEvent key={index} {...event} />
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AlumniDashboard;
