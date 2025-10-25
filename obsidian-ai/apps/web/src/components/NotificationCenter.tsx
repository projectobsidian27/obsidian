import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'zombie_deal' | 'deal_milestone' | 'pipeline_health' | 'system' | 'action_required';
  level: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  is_read: boolean;
  is_dismissed: boolean;
  action_url?: string;
  action_label?: string;
  created_at: string;
}

interface NotificationCenterProps {
  userId?: string;
}

export default function NotificationCenter({ userId }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');

  // Fetch notifications
  useEffect(() => {
    if (isOpen && userId) {
      fetchNotifications();
    }
  }, [isOpen, userId, filter]);

  // Update unread count
  useEffect(() => {
    if (userId) {
      fetchUnreadCount();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications?filter=${filter}`);
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications/count');
      const data = await response.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const dismissNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/dismiss`, { method: 'POST' });
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'var(--color-crimson-alert)';
      case 'warning':
        return 'var(--color-signal-amber)';
      case 'success':
        return 'var(--color-success)';
      default:
        return 'var(--color-deep-teal)';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'zombie_deal':
        return 'ZOMBIE ALERT';
      case 'deal_milestone':
        return 'DEAL UPDATE';
      case 'pipeline_health':
        return 'PIPELINE';
      case 'action_required':
        return 'ACTION REQUIRED';
      case 'system':
        return 'SYSTEM';
      default:
        return 'NOTIFICATION';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Notification Bell */}
      <div style={{ position: 'relative' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'relative',
            padding: '8px 12px',
            fontSize: '16px',
          }}
        >
          🔔
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--color-crimson-alert)',
                color: 'var(--color-bg)',
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '10px',
                minWidth: '20px',
                textAlign: 'center',
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className="command-panel"
            style={{
              position: 'fixed',
              top: '60px',
              right: '24px',
              width: '420px',
              maxHeight: '600px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-elevated)',
            }}
          >
            {/* Header */}
            <div
              className="command-panel-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
              }}
            >
              <span>NOTIFICATIONS</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {unreadCount > 0 && (
                  <button
                    className="btn btn-secondary"
                    onClick={markAllAsRead}
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '0',
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Filters */}
            <div style={{ padding: '0 20px 16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter('all')}
                  style={{ flex: 1, padding: '6px 12px', fontSize: '13px' }}
                >
                  All
                </button>
                <button
                  className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter('unread')}
                  style={{ flex: 1, padding: '6px 12px', fontSize: '13px' }}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            <hr className="separator" style={{ margin: 0 }} />

            {/* Notifications List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className="card"
                    style={{
                      padding: '12px',
                      borderLeft: `3px solid ${getLevelColor(notification.level)}`,
                      background: notification.is_read ? 'var(--color-surface)' : 'var(--color-surface-elevated)',
                      cursor: 'pointer',
                      transition: 'var(--transition-base)',
                    }}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{getLevelIcon(notification.level)}</span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: getLevelColor(notification.level),
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {getTypeLabel(notification.type)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-text-muted)',
                          cursor: 'pointer',
                          fontSize: '16px',
                          padding: '0',
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {/* Title */}
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                      {notification.title}
                    </div>

                    {/* Message */}
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px', lineHeight: '1.4' }}>
                      {notification.message}
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {formatTimestamp(notification.created_at)}
                      </span>
                      {notification.action_url && notification.action_label && (
                        <a
                          href={notification.action_url}
                          className="btn btn-primary"
                          style={{ padding: '4px 12px', fontSize: '12px', textDecoration: 'none' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {notification.action_label}
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
