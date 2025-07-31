import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNotification } from '../../hooks/useNotification';

interface ChatNotification {
  tripId: string;
  tripName: string;
  lastMessage: string;
  unreadCount: number;
  timestamp: Date;
}

const ChatIndicator: React.FC = () => {
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const { showInfo } = useNotification();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) return;

    // Listen to unread messages for the current user
    // Simplified query to avoid complex Firestore structure issues
    const messagesRef = collection(db, 'chats');
    
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const chatNotifications: ChatNotification[] = [];
      let total = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Check if this chat involves the current user
        const participants = data.participants || [];
        if (!participants.includes(user.uid)) return;

        // Count unread messages
        const messages = data.messages || [];
        const unreadMessages = messages.filter((msg: any) => 
          !msg.isRead && msg.senderId !== user.uid
        );

        if (unreadMessages.length > 0) {
          const lastMessage = unreadMessages[unreadMessages.length - 1];
          chatNotifications.push({
            tripId: doc.id.replace('trip_', ''),
            tripName: data.tripName || 'Viaje',
            lastMessage: lastMessage.text || 'Nuevo mensaje',
            unreadCount: unreadMessages.length,
            timestamp: lastMessage.timestamp?.toDate() || new Date()
          });
          total += unreadMessages.length;
        }
      });

      setNotifications(chatNotifications);
      setTotalUnread(total);
    }, (error) => {
      console.error('Error listening to chat notifications:', error);
      // Don't show error to user, just log it
    });

    return () => unsubscribe();
  }, []);

  const handleNotificationClick = (notification: ChatNotification) => {
    // Navigate to chat
    window.location.href = `/chat/${notification.tripId}`;
    setShowDropdown(false);
  };

  const handleMarkAllAsRead = () => {
    showInfo('Marcar como leído', 'Función en desarrollo');
    setShowDropdown(false);
  };

  // Don't render anything if no unread messages
  if (totalUnread === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-white/80 hover:text-white transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Mensajes no leídos</h3>
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Marcar todo como leído
              </button>
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-white/60">
                No hay mensajes nuevos
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.tripId}
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full p-4 hover:bg-slate-700/50 transition-colors text-left border-b border-slate-700 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {notification.tripName}
                      </p>
                      <p className="text-sm text-white/60 truncate mt-1">
                        {notification.lastMessage}
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        {notification.timestamp.toLocaleTimeString('es-CO', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {notification.unreadCount > 9 ? '9+' : notification.unreadCount}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ChatIndicator; 