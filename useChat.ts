import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNotification } from './useNotification';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export const useChat = (tripId: string, currentUserId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [participants, setParticipants] = useState<ChatParticipant[]>([]);
  const { showError, showSuccess } = useNotification();

  // Listen to messages in real-time
  useEffect(() => {
    if (!tripId) {
      setLoading(false);
      return;
    }

    try {
      const chatId = `trip_${tripId}`;
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages: Message[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          newMessages.push({
            id: doc.id,
            text: data.text || '',
            senderId: data.senderId || '',
            senderName: data.senderName || 'Usuario',
            senderAvatar: data.senderAvatar,
            timestamp: data.timestamp?.toDate() || new Date(),
            isRead: data.isRead || false
          });
        });
        setMessages(newMessages);
        setLoading(false);
      }, (error) => {
        console.error('Error listening to messages:', error);
        // Don't show error to user, just set loading to false
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up chat listener:', error);
      setLoading(false);
    }
  }, [tripId]);

  const sendMessage = useCallback(async (text: string, senderName: string, senderAvatar?: string) => {
    if (!text.trim() || !tripId) return;

    setSending(true);
    try {
      const chatId = `trip_${tripId}`;
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      
      await addDoc(messagesRef, {
        text: text.trim(),
        senderId: currentUserId,
        senderName,
        senderAvatar,
        timestamp: serverTimestamp(),
        isRead: false
      });

      // Don't show success message for every message to avoid spam
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Error', 'No se pudo enviar el mensaje');
    } finally {
      setSending(false);
    }
  }, [tripId, currentUserId, showError]);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      const chatId = `trip_${tripId}`;
      const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
      await updateDoc(messageRef, { isRead: true });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }, [tripId]);

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadMessages = messages.filter(
        msg => !msg.isRead && msg.senderId !== currentUserId
      );

      if (unreadMessages.length === 0) return;

      const chatId = `trip_${tripId}`;
      const updatePromises = unreadMessages.map(msg => {
        const messageRef = doc(db, 'chats', chatId, 'messages', msg.id);
        return updateDoc(messageRef, { isRead: true });
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking all messages as read:', error);
    }
  }, [messages, currentUserId, tripId]);

  const getUnreadCount = useCallback(() => {
    return messages.filter(
      msg => !msg.isRead && msg.senderId !== currentUserId
    ).length;
  }, [messages, currentUserId]);

  return {
    messages,
    loading,
    sending,
    participants,
    sendMessage,
    markAsRead,
    markAllAsRead,
    getUnreadCount
  };
}; 