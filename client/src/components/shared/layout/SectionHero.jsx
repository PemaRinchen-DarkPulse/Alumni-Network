import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Icon from '@/components/shared/icons/Icon';

/**
 * Standardized hero section component for consistent design across pages
 * Based on the Collaboration section hero design
 */
const SectionHero = ({ 
  title, 
  description, 
  actionButton, 
  icon,
  gradient = "from-blue-600 to-purple-600",
  className = ""
}) => {
  return (
    <motion.div 
      className={`bg-gradient-to-r ${gradient} rounded-xl p-6 text-white mb-6 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name={icon} className="text-white" size={28} />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-blue-100 max-w-2xl">
              {description}
            </p>
          </div>
        </div>
        {actionButton && (
          <Button 
            onClick={actionButton.onClick}
            className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {actionButton.icon && (
              <Icon name={actionButton.icon} size={16} className="mr-2" />
            )}
            {actionButton.label}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default SectionHero;
