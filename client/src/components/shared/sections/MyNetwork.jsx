import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Send, Inbox, UserPlus, Grid3x3, List, MoreVertical, Eye, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/auth';
import { connectionAPI, userAPI } from '@/services/api';

const MyNetwork = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('connections');
  const [viewMode, setViewMode] = useState('grid');
  
  // State for data
  const [connections, setConnections] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  
  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // Pagination state
  const [displayCountConnections, setDisplayCountConnections] = useState(15);
  const [displayCountIncoming, setDisplayCountIncoming] = useState(15);
  const [displayCountSent, setDisplayCountSent] = useState(15);

  // Helper function to generate random gradient
  const getRandomGradient = () => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-green-400 to-teal-500',
      'from-red-500 to-orange-500',
      'from-yellow-400 to-orange-500',
      'from-indigo-500 to-blue-600',
      'from-teal-400 to-cyan-500',
      'from-orange-400 to-rose-500',
      'from-slate-700 to-slate-900',
      'from-pink-400 to-purple-500',
      'from-amber-400 to-orange-600',
      'from-cyan-400 to-blue-600',
      'from-violet-500 to-purple-700'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // Helper function to transform connection data
  const transformConnectionData = (connectionData, isCurrentUserSender) => {
    const otherUserId = isCurrentUserSender ? connectionData.receiverId : connectionData.senderId;
    const otherUserName = isCurrentUserSender ? connectionData.receiverName : connectionData.senderName;
    const otherUserEmail = isCurrentUserSender ? connectionData.receiverEmail : connectionData.senderEmail;

    return {
      id: connectionData.id,
      userId: otherUserId,
      name: otherUserName,
      email: otherUserEmail,
      title: 'Alumni',
      batch: null,
      badge: 'ALUMNI',
      badgeColor: 'bg-blue-500',
      location: null,
      image: null,
      online: false,
      bgColor: getRandomGradient()
    };
  };

  // Fetch user details and enrich connection data
  const enrichWithUserDetails = async (connectionData) => {
    try {
      const response = await userAPI.getUserById(connectionData.userId);
      if (response.success && response.data) {
        const userData = response.data;
        
        console.log('User data for enrichment:', userData);
        console.log('User batch:', userData.batch);
        console.log('User role:', userData.role);
        
        // Format role for display
        const roleFormatted = userData.role ? 
          userData.role.charAt(0).toUpperCase() + userData.role.slice(1).toLowerCase() : 
          'Alumni';
        
        // Format badge based on role and batch
        let badge = '';
        let badgeColor = 'bg-blue-500';
        
        if (userData.role === 'STUDENT') {
          badge = 'STUDENT';
          badgeColor = 'bg-green-500';
        } else if (userData.role === 'TEACHER') {
          badge = 'TEACHER';
          badgeColor = 'bg-purple-500';
        } else {
          // Alumni
          if (userData.batch) {
            const batchYear = userData.batch.toString();
            const shortYear = batchYear.length >= 2 ? batchYear.substring(batchYear.length - 2) : batchYear;
            badge = `ALUMNI '${shortYear}`;
          } else {
            badge = 'ALUMNI';
          }
          badgeColor = 'bg-blue-500';
        }
        
        return {
          ...connectionData,
          title: roleFormatted,
          batch: userData.batch || null,
          badge: badge,
          badgeColor: badgeColor,
          location: userData.location || userData.city || null,
          image: userData.profilePicture || null
        };
      }
      return connectionData;
    } catch (err) {
      console.error('Error enriching user details:', err);
      return connectionData;
    }
  };

  // Fetch all network data
  const fetchNetworkData = async () => {
    if (!user || !user.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all connection types in parallel
      const [acceptedRes, receivedRes, sentRes] = await Promise.all([
        connectionAPI.getAcceptedConnections(user.id),
        connectionAPI.getPendingRequestsReceived(user.id),
        connectionAPI.getPendingRequestsSent(user.id)
      ]);

      // Process accepted connections
      if (acceptedRes.success) {
        const transformedConnections = acceptedRes.data.map(conn => {
          const isCurrentUserSender = conn.senderId === user.id;
          return transformConnectionData(conn, isCurrentUserSender);
        });
        
        // Enrich with user details
        const enrichedConnections = await Promise.all(
          transformedConnections.map(conn => enrichWithUserDetails(conn))
        );
        setConnections(enrichedConnections);
      } else {
        console.error('Failed to fetch connections:', acceptedRes.error);
      }

      // Process pending received requests (invitations)
      if (receivedRes.success) {
        const transformedInvitations = receivedRes.data.map(conn => 
          transformConnectionData(conn, false)
        );
        
        // Enrich with user details
        const enrichedInvitations = await Promise.all(
          transformedInvitations.map(inv => enrichWithUserDetails(inv))
        );
        setInvitations(enrichedInvitations);
      } else {
        console.error('Failed to fetch invitations:', receivedRes.error);
      }

      // Process pending sent requests
      if (sentRes.success) {
        const transformedSent = sentRes.data.map(conn => 
          transformConnectionData(conn, true)
        );
        
        // Enrich with user details
        const enrichedSent = await Promise.all(
          transformedSent.map(req => enrichWithUserDetails(req))
        );
        setSentRequests(enrichedSent);
      } else {
        console.error('Failed to fetch sent requests:', sentRes.error);
      }

    } catch (err) {
      console.error('Error fetching network data:', err);
      setError('Failed to load network data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchNetworkData();
  }, [user]);

  // Handle accepting a connection request
  const handleAccept = async (connectionId) => {
    if (!user || !user.id) return;

    setActionLoading(prev => ({ ...prev, [connectionId]: true }));
    try {
      const response = await connectionAPI.acceptConnectionRequest(connectionId, user.id);
      
      if (response.success) {
        // Refresh data to update UI
        await fetchNetworkData();
      } else {
        console.error('Failed to accept connection:', response.error);
        alert('Failed to accept connection. Please try again.');
      }
    } catch (err) {
      console.error('Error accepting connection:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [connectionId]: false }));
    }
  };

  // Handle rejecting/ignoring a connection request
  const handleIgnore = async (connectionId) => {
    if (!user || !user.id) return;

    setActionLoading(prev => ({ ...prev, [connectionId]: true }));
    try {
      const response = await connectionAPI.rejectConnectionRequest(connectionId, user.id);
      
      if (response.success) {
        // Refresh data to update UI
        await fetchNetworkData();
      } else {
        console.error('Failed to reject connection:', response.error);
        alert('Failed to reject connection. Please try again.');
      }
    } catch (err) {
      console.error('Error rejecting connection:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [connectionId]: false }));
    }
  };

  // Handle withdrawing a sent connection request
  const handleWithdraw = async (connectionId) => {
    if (!user || !user.id) return;

    setActionLoading(prev => ({ ...prev, [connectionId]: true }));
    try {
      const response = await connectionAPI.withdrawConnectionRequest(connectionId, user.id);
      
      if (response.success) {
        // Refresh data to update UI
        await fetchNetworkData();
      } else {
        console.error('Failed to withdraw connection request:', response.error);
        alert('Failed to withdraw connection request. Please try again.');
      }
    } catch (err) {
      console.error('Error withdrawing connection request:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [connectionId]: false }));
    }
  };

  // Handle load more for each tab
  const handleLoadMoreConnections = () => {
    setDisplayCountConnections(prevCount => prevCount + 15);
  };

  const handleLoadMoreIncoming = () => {
    setDisplayCountIncoming(prevCount => prevCount + 15);
  };

  const handleLoadMoreSent = () => {
    setDisplayCountSent(prevCount => prevCount + 15);
  };

  // Stats calculation
  const stats = {
    totalConnections: connections.length,
    pendingRequests: invitations.length,
    sentRequests: sentRequests.length
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error if fetch failed
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchNetworkData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-transparent">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Network</h1>
              <p className="mt-2 text-slate-600">Manage your professional relationships and connect with alumni.</p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard/directory')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Find Alumni
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="border-b border-slate-200 flex items-center justify-between">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('connections')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'connections'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Connections
              </button>
              <button
                onClick={() => setActiveTab('incoming')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors relative ${
                  activeTab === 'incoming'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Incoming
                {stats.pendingRequests > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                    {stats.pendingRequests}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'sent'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Sent
              </button>
            </div>
            {/* View Toggle */}
            <div className="flex items-center space-x-1 px-6">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'connections' && (
              <div>
                {connections.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No connections yet</h3>
                    <p className="text-slate-600 mb-6">Start connecting with alumni to grow your network!</p>
                    <Button 
                      onClick={() => navigate('/dashboard/directory')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Find Alumni
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Header with count and sort */}
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {stats.totalConnections} Connections
                      </h2>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <span>Sort by:</span>
                        <button className="flex items-center space-x-1 font-medium text-slate-900 hover:text-slate-700">
                          <span>Recently Added</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Grid View */}
                    {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {connections.slice(0, displayCountConnections).map((connection) => (
                      <div
                        key={connection.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                      >
                        {/* Colored Header */}
                        <div className={`h-24 bg-gradient-to-br ${connection.bgColor}`}></div>
                        
                        {/* Profile Picture */}
                        <div className="relative px-6 -mt-14">
                          <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-gray-300 flex items-center justify-center">
                            <UserAvatar
                              user={{ name: connection.name, profilePicture: connection.image }}
                              size="full"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4 flex-1 flex flex-col">
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{connection.name}</h3>
                            <p className="text-sm text-gray-600">{connection.title}</p>
                            {(connection.title === 'Alumni' || connection.title === 'Student') && connection.batch && (
                              <p className="text-xs text-blue-600 font-medium mt-1">Batch {connection.batch}</p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="mt-auto">
                            <Button 
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-4">
                    {connections.slice(0, displayCountConnections).map((connection) => (
                      <div
                        key={connection.id}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                            <UserAvatar
                              user={{ name: connection.name, profilePicture: connection.image }}
                              size="lg"
                            />
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">
                              {connection.name}
                            </h3>
                            <p className="text-sm text-slate-600">{connection.title}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${connection.badgeColor} text-white`}>
                                {connection.badge}
                              </span>
                              <span className="text-xs text-slate-500 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {connection.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            size="sm"
                          >
                            Message
                          </Button>
                          <button className="p-2 border border-slate-300 rounded-md hover:bg-slate-50 text-slate-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                    {/* Load More Button */}
                    {connections.length > displayCountConnections && (
                    <div className="flex justify-center mt-8">
                      <button 
                        onClick={handleLoadMoreConnections}
                        className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                      >
                        <span>Load more connections</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'incoming' && (
              <div>
                {invitations.length === 0 ? (
                  <div className="text-center py-16">
                    <Inbox className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No pending requests</h3>
                    <p className="text-slate-600">You don't have any connection requests at the moment.</p>
                  </div>
                ) : (
                  <>
                    {/* Invitations Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-slate-900">
                        Connection Request ({stats.pendingRequests})
                      </h2>
                      <div className="flex items-center space-x-2">
                        <button className="text-sm text-slate-600 hover:text-slate-700 font-medium">
                          Ignore all
                        </button>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Accept all
                        </button>
                      </div>
                    </div>

                    {/* Grid View */}
                    {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {invitations.slice(0, displayCountIncoming).map((invitation) => (
                      <div
                        key={invitation.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                      >
                        {/* Colored Header */}
                        <div className={`h-24 bg-gradient-to-br ${invitation.bgColor}`}></div>
                        
                        {/* Profile Picture */}
                        <div className="relative px-6 -mt-14">
                          <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-gray-300 flex items-center justify-center">
                            <UserAvatar
                              user={{ name: invitation.name, profilePicture: invitation.image }}
                              size="full"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4 flex-1 flex flex-col">
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{invitation.name}</h3>
                            <p className="text-sm text-gray-600">{invitation.title}</p>
                            {(invitation.title === 'Alumni' || invitation.title === 'Student') && invitation.batch && (
                              <p className="text-xs text-blue-600 font-medium mt-1">Batch {invitation.batch}</p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="mt-auto flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleIgnore(invitation.id)}
                              className="flex-1 text-slate-700 border-slate-300 hover:bg-slate-100"
                            >
                              Ignore
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAccept(invitation.id)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-4">
                    {invitations.slice(0, displayCountIncoming).map((invitation) => (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <UserAvatar
                            user={{ name: invitation.name, profilePicture: invitation.image }}
                            size="lg"
                          />
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">
                              {invitation.name}
                            </h3>
                            <p className="text-sm text-slate-600">{invitation.title}</p>
                            {(invitation.title === 'Alumni' || invitation.title === 'Student') && invitation.batch && (
                              <p className="text-xs text-blue-600 font-medium mt-1">Batch {invitation.batch}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleIgnore(invitation.id)}
                            className="text-slate-700 border-slate-300 hover:bg-slate-100"
                          >
                            Ignore
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(invitation.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                    {/* Load More Button for Incoming */}
                    {invitations.length > displayCountIncoming && (
                    <div className="flex justify-center mt-8">
                      <button 
                        onClick={handleLoadMoreIncoming}
                        className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                      >
                        <span>Load more requests</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    )}                  </>
                )}
              </div>
            )}

            {activeTab === 'sent' && (
              <div>
                {sentRequests.length === 0 ? (
                  <div className="text-center py-16">
                    <Send className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No sent requests</h3>
                    <p className="text-slate-600 mb-6">You haven't sent any connection requests yet.</p>
                    <Button 
                      onClick={() => navigate('/dashboard/directory')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Find Alumni
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Sent Requests Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-slate-900">
                        Sent Requests ({stats.sentRequests})
                      </h2>
                    </div>

                    {/* Grid View */}
                    {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sentRequests.slice(0, displayCountSent).map((request) => (
                      <div
                        key={request.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                      >
                        {/* Colored Header */}
                        <div className={`h-24 bg-gradient-to-br ${request.bgColor}`}></div>
                        
                        {/* Profile Picture */}
                        <div className="relative px-6 -mt-14">
                          <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-gray-300 flex items-center justify-center">
                            <UserAvatar
                              user={{ name: request.name, profilePicture: request.image }}
                              size="full"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4 flex-1 flex flex-col">
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.name}</h3>
                            <p className="text-sm text-gray-600">{request.title}</p>
                            {(request.title === 'Alumni' || request.title === 'Student') && request.batch && (
                              <p className="text-xs text-blue-600 font-medium mt-1">Batch {request.batch}</p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="mt-auto">
                            <Button 
                              variant="outline"
                              onClick={() => handleWithdraw(request.id)}
                              disabled={actionLoading[request.id]}
                              className="w-full text-slate-700 border-slate-300 hover:bg-slate-100"
                            >
                              {actionLoading[request.id] ? 'Withdrawing...' : 'Withdraw'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-4">
                    {sentRequests.slice(0, displayCountSent).map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <UserAvatar
                            user={{ name: request.name, profilePicture: request.image }}
                            size="lg"
                          />
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">
                              {request.name}
                            </h3>
                            <p className="text-sm text-slate-600">{request.title}</p>
                            {(request.title === 'Alumni' || request.title === 'Student') && request.batch && (
                              <p className="text-xs text-blue-600 font-medium mt-1">Batch {request.batch}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleWithdraw(request.id)}
                            disabled={actionLoading[request.id]}
                            className="text-slate-700 border-slate-300 hover:bg-slate-100"
                          >
                            {actionLoading[request.id] ? 'Withdrawing...' : 'Withdraw'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                    {/* Load More Button for Sent Requests */}
                    {sentRequests.length > displayCountSent && (
                    <div className="flex justify-center mt-8">
                      <button 
                        onClick={handleLoadMoreSent}
                        className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                      >
                        <span>Load more requests</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    )}                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNetwork;