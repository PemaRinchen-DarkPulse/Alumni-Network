import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

/**
 * UserAvatar component that displays user profile picture with fallback to initials
 * @param {Object} user - User object containing name and profilePicture
 * @param {string} user.name - User's name
 * @param {string} user.profilePicture - URL to user's profile picture
 * @param {string} className - Additional CSS classes for the Avatar
 * @param {string} size - Size preset for the avatar (sm, md, lg, xl)
 * @param {string} fallbackImage - Fallback image URL (deprecated - only shows initials now)
 */
export function UserAvatar({ 
  user, 
  className = "", 
  size = "md",
  fallbackImage = null
}) {
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Size presets
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };  // Determine which image to display: only profilePicture from DB (no random fallbacks)
  const getImageSrc = () => {
    // If user has a profile picture in the database, use it
    if (user?.profilePicture) {
      return user.profilePicture;
    }
    // Otherwise, no image (will show initials)
    return null;
  };

  const imageSrc = getImageSrc();

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {imageSrc && (
        <AvatarImage 
          src={imageSrc} 
          alt={user?.name || 'User'} 
          className="object-cover"
        />
      )}
      <AvatarFallback className={size === 'xl' ? 'text-lg font-medium' : 'text-sm font-medium'}>
        {getUserInitials()}
      </AvatarFallback>
    </Avatar>
  );
}
