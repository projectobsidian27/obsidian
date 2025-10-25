import { useState, useEffect } from 'react';

interface Announcement {
  id: string;
  type: 'maintenance' | 'feature' | 'update' | 'alert' | 'sales';
  level: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  is_active: boolean;
  start_date: string;
  end_date?: string;
}

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAnnouncements();
    // Rotate announcements every 10 seconds if multiple
    const interval = setInterval(() => {
      if (announcements.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements/active');
      const data = await response.json();
      if (data.success && data.announcements) {
        // Filter out dismissed announcements
        const dismissedArray = JSON.parse(localStorage.getItem('dismissed_announcements') || '[]') as string[];
        const dismissedIds = new Set<string>(dismissedArray);
        setDismissed(dismissedIds);
        setAnnouncements(
          data.announcements.filter((a: Announcement) => !dismissedIds.has(a.id))
        );
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const dismissAnnouncement = async (announcementId: string) => {
    try {
      // Optimistically update UI
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId));

      // Save to local storage
      const dismissedIds = Array.from(dismissed);
      dismissedIds.push(announcementId);
      localStorage.setItem('dismissed_announcements', JSON.stringify(dismissedIds));
      setDismissed(new Set(dismissedIds));

      // Persist to backend
      await fetch(`/api/announcements/${announcementId}/dismiss`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error dismissing announcement:', error);
    }
  };

  if (announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];
  if (!currentAnnouncement) {
    return null;
  }

  const getBackgroundColor = () => {
    switch (currentAnnouncement.level) {
      case 'critical':
        return 'var(--color-crimson-alert)';
      case 'warning':
        return 'var(--color-signal-amber)';
      default:
        return 'var(--color-deep-teal)';
    }
  };

  const getIcon = () => {
    switch (currentAnnouncement.type) {
      case 'maintenance':
        return '🔧';
      case 'feature':
        return '✨';
      case 'update':
        return '📢';
      case 'alert':
        return '⚠️';
      case 'sales':
        return '🎯';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      style={{
        background: getBackgroundColor(),
        color: 'var(--color-bg)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        fontSize: '14px',
        fontWeight: '500',
        position: 'relative',
        zIndex: 90,
      }}
    >
      {/* Icon and Message */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <span style={{ fontSize: '20px' }}>{getIcon()}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>
            {currentAnnouncement.title}
          </span>
          <span>—</span>
          <span>{currentAnnouncement.message}</span>
        </div>
      </div>

      {/* Pagination Dots (if multiple announcements) */}
      {announcements.length > 1 && (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {announcements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: index === currentIndex ? 'var(--color-bg)' : 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'var(--transition-base)',
              }}
              aria-label={`View announcement ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Dismiss Button */}
      <button
        onClick={() => dismissAnnouncement(currentAnnouncement.id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-bg)',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '0',
          lineHeight: '1',
          opacity: 0.8,
          transition: 'var(--transition-base)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
        aria-label="Dismiss announcement"
      >
        ×
      </button>
    </div>
  );
}
