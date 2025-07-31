import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    timestamp: Date;
    isRead: boolean;
  };
  currentUserId: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, currentUserId }) => {
  const isOwnMessage = message.senderId === currentUserId;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        {!isOwnMessage && (
          <div className="flex-shrink-0">
            <img
              src={message.senderAvatar || 'https://i.pravatar.cc/32?u=' + message.senderId}
              alt={message.senderName}
              className="w-8 h-8 rounded-full"
            />
          </div>
        )}
        
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          {!isOwnMessage && (
            <span className="text-xs text-white/60 mb-1">{message.senderName}</span>
          )}
          
          <div className={`px-4 py-2 rounded-2xl ${
            isOwnMessage 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : 'bg-slate-700/50 text-white border border-slate-600'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
          
          <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-xs text-white/40">
              {format(message.timestamp, 'HH:mm', { locale: es })}
            </span>
            {isOwnMessage && (
              <span className="text-xs">
                {message.isRead ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 