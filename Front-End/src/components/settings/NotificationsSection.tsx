"use client";

import { useState, useEffect } from 'react';
import Checkbox from '../ui/Checkbox';

interface NotificationSettings {
  newChapter: boolean;
  weeklyNewsletter: boolean;
  systemUpdates: boolean;
}

function NotificationsSection() {
  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem('mangahub_notifications');
      return saved ? JSON.parse(saved) : { newChapter: true, weeklyNewsletter: false, systemUpdates: true };
    } catch {
      return { newChapter: true, weeklyNewsletter: false, systemUpdates: true };
    }
  });

  useEffect(() => {
    localStorage.setItem('mangahub_notifications', JSON.stringify(notifications));
  }, [notifications]);

  return (
    <div className="space-y-4">
      <Checkbox
        id="notif-new-chapter"
        checked={notifications.newChapter}
        onChange={() =>
          setNotifications((n) => ({ ...n, newChapter: !n.newChapter }))
        }
        label="New chapter alerts"
        labelAction="for saved manga"
      />
      <Checkbox
        id="notif-newsletter"
        checked={notifications.weeklyNewsletter}
        onChange={() =>
          setNotifications((n) => ({ ...n, weeklyNewsletter: !n.weeklyNewsletter }))
        }
        label="Weekly recommendations"
        labelAction="newsletter"
      />
      <Checkbox
        id="notif-system"
        checked={notifications.systemUpdates}
        onChange={() =>
          setNotifications((n) => ({ ...n, systemUpdates: !n.systemUpdates }))
        }
        label="System updates"
        labelAction="platform announcements"
      />
    </div>
  );
}

export default NotificationsSection;
