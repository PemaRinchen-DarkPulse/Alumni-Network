import React from 'react';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Icon } from '@/components/shared/icons/Icon';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';

/**
 * ForumSection component for discussion forums.
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 * @param {Array} props.discussions - Array of discussion thread objects
 * @param {boolean} props.canModerate - Whether the user can moderate discussions
 * @param {boolean} props.canCreateThreads - Whether the user can create new discussion threads
 * @param {Function} props.onCreateThread - Function called when a new thread is created
 * @param {Function} props.onViewThread - Function called when a thread is clicked
 * @param {Function} props.onPinThread - Function called when a thread is pinned
 */
const ForumSection = ({
  title = "Discussion Forum",
  description = "Engage in discussions with fellow alumni on various topics.",
  discussions = [],
  canModerate = false,
  canCreateThreads = true,
  onCreateThread = () => console.log('Create thread'),
  onViewThread = (thread) => console.log('View thread:', thread),
  onPinThread = (thread) => console.log('Pin thread:', thread)
}) => {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
      />
      
      <div className="mt-6 space-y-6">
        {canCreateThreads && (
          <ContentCard>            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Start a New Discussion</h2>
              <PrimaryButton onClick={onCreateThread}>
                New Thread
              </PrimaryButton>
            </div>
          </ContentCard>
        )}
        
        {discussions.length > 0 ? (
          <div className="space-y-4">
            {discussions.map((thread, index) => (
              <ContentCard key={index}>
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h3 
                      className="font-semibold text-lg hover:text-primary cursor-pointer"
                      onClick={() => onViewThread(thread)}
                    >                      {thread.pinned && (
                        <span className="mr-2 text-primary">
                          <Icon name="pin" size={16} />
                        </span>
                      )}
                      {thread.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Started by {thread.author} • {thread.date} • {thread.replies} replies
                    </p>
                  </div>
                  
                  {canModerate && (
                    <div>                      <button
                        onClick={() => onPinThread(thread)}
                        className="text-slate-400 hover:text-primary"
                        title={thread.pinned ? "Unpin thread" : "Pin thread"}
                      >
                        <Icon name="pin" size={20} />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 text-slate-600 dark:text-slate-400">
                  {thread.preview}
                </div>
                
                <div className="mt-4 flex gap-2">
                  {thread.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="inline-block bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded dark:bg-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </ContentCard>
            ))}
          </div>
        ) : (
          <ContentCard>
            <p className="text-slate-600 dark:text-slate-400">
              No discussions have been started yet. Start a new thread to begin the conversation!
            </p>
          </ContentCard>
        )}
      </div>
    </>
  );
};

export default ForumSection;
