import React from 'react';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';

interface ChatHeaderProps {
  participant: {
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
    lastSeen?: Date;
  };
  onBack: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onMoreOptions?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  participant,
  onBack,
  onCall,
  onVideoCall,
  onMoreOptions
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={participant.avatar || `https://i.pravatar.cc/40?u=${participant.id}`}
              alt={participant.name}
              className="w-10 h-10 rounded-full"
            />
            {participant.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-white">{participant.name}</h3>
            <p className="text-xs text-white/60">
              {participant.isOnline 
                ? 'En línea' 
                : participant.lastSeen 
                  ? `Visto ${participant.lastSeen.toLocaleTimeString('es-CO', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}`
                  : 'Desconectado'
              }
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {onCall && (
          <button
            onClick={onCall}
            className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
          >
            <Phone className="w-5 h-5 text-white" />
          </button>
        )}
        
        {onVideoCall && (
          <button
            onClick={onVideoCall}
            className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
          >
            <Video className="w-5 h-5 text-white" />
          </button>
        )}
        
        {onMoreOptions && (
          <button
            onClick={onMoreOptions}
            className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader; 