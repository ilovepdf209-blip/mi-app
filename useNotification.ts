import { useState, useCallback } from 'react';
import type { NotificationType } from '../components/Notification';


interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    duration: number = 5000
  ) => {
    const id = Date.now().toString();
    const notification: NotificationData = {
      id,
      type,
      title,
      message
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    addNotification('success', title, message, duration);
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    addNotification('error', title, message, duration);
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    addNotification('warning', title, message, duration);
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    addNotification('info', title, message, duration);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}; 