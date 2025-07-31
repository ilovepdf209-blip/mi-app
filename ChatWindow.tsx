import React, { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '../../hooks/useChat';
import { useNotification } from '../../hooks/useNotification';

interface ChatWindowProps {
  tripId: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
    lastSeen?: Date;
  };
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  tripId,
  participant,
  currentUser,
  onBack
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showError, showSuccess } = useNotification();
  const { messages, loading, sending, sendMessage, markAllAsRead } = useChat(tripId, currentUser.id);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (messages.length > 0) {
      try {
        markAllAsRead();
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  }, [messages, markAllAsRead]);

  const handleSendMessage = (text: string) => {
    try {
      sendMessage(text, currentUser.name, currentUser.avatar);
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Error', 'No se pudo enviar el mensaje');
    }
  };

  const handleCall = () => {
    // Implementar llamada telefónica
    showSuccess('Llamada', 'Función de llamada en desarrollo');
  };

  const handleVideoCall = () => {
    // Implementar videollamada
    showSuccess('Videollamada', 'Función de videollamada en desarrollo');
  };

  const handleMoreOptions = () => {
    // Implementar menú de opciones
    showSuccess('Opciones', 'Menú de opciones en desarrollo');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <ChatHeader
        participant={participant}
        onBack={onBack}
        onCall={handleCall}
        onVideoCall={handleVideoCall}
        onMoreOptions={handleMoreOptions}
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white/60">Cargando mensajes...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white/60">
              <p className="text-lg font-medium mb-2">No hay mensajes aún</p>
              <p className="text-sm">¡Sé el primero en escribir!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              currentUserId={currentUser.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={sending}
        placeholder={sending ? "Enviando..." : "Escribe un mensaje..."}
      />
    </div>
  );
};

export default ChatWindow; 