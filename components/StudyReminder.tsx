'use client';

import { useState, useEffect } from 'react';
import './StudyReminder.css';

interface ReminderSettings {
    enabled: boolean;
    time: string;
    days: string[];
    message: string;
}

interface StudyReminderProps {
    onClose: () => void;
}

export default function StudyReminder({ onClose }: StudyReminderProps) {
    const [settings, setSettings] = useState<ReminderSettings>({
        enabled: false,
        time: '09:00',
        days: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
        message: '📚 Çalışma zamanı! Bugünkü hedefine ulaşmak için harekete geç!'
    });
    const [permissionStatus, setPermissionStatus] = useState<'default' | 'granted' | 'denied'>('default');
    const [testSent, setTestSent] = useState(false);

    const allDays = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

    // Load settings from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('visi-reminder-settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }

        // Check notification permission
        if ('Notification' in window) {
            setPermissionStatus(Notification.permission as any);
        }
    }, []);

    // Save settings to localStorage
    const saveSettings = (newSettings: ReminderSettings) => {
        setSettings(newSettings);
        localStorage.setItem('visi-reminder-settings', JSON.stringify(newSettings));
    };

    // Request notification permission
    const requestPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            setPermissionStatus(permission as any);
            if (permission === 'granted') {
                saveSettings({ ...settings, enabled: true });
            }
        }
    };

    // Toggle day selection
    const toggleDay = (day: string) => {
        const newDays = settings.days.includes(day)
            ? settings.days.filter(d => d !== day)
            : [...settings.days, day];
        saveSettings({ ...settings, days: newDays });
    };

    // Send test notification
    const sendTestNotification = () => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('VİSİ AI Hatırlatıcı 🎓', {
                body: settings.message,
                icon: '/icon.png',
                badge: '/icon.png'
            });
            setTestSent(true);
            setTimeout(() => setTestSent(false), 3000);
        }
    };

    // Toggle enabled state
    const toggleEnabled = () => {
        if (!settings.enabled && permissionStatus !== 'granted') {
            requestPermission();
        } else {
            saveSettings({ ...settings, enabled: !settings.enabled });
        }
    };

    return (
        <div className="reminder-modal-overlay" onClick={onClose}>
            <div className="reminder-modal" onClick={e => e.stopPropagation()}>
                <div className="reminder-header">
                    <h2>🔔 Çalışma Hatırlatıcısı</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {/* Permission Warning */}
                {permissionStatus === 'denied' && (
                    <div className="permission-warning">
                        ⚠️ Bildirimler engellendi. Tarayıcı ayarlarından izin verin.
                    </div>
                )}

                {/* Main Toggle */}
                <div className="reminder-toggle-section">
                    <div className="toggle-info">
                        <span className="toggle-label">Hatırlatıcıları Aç</span>
                        <span className="toggle-desc">Belirlediğin saatte bildirim alırsın</span>
                    </div>
                    <button
                        className={`toggle-btn ${settings.enabled ? 'active' : ''}`}
                        onClick={toggleEnabled}
                    >
                        <span className="toggle-circle"></span>
                    </button>
                </div>

                {settings.enabled && (
                    <>
                        {/* Time Picker */}
                        <div className="reminder-section">
                            <label>⏰ Hatırlatma Saati</label>
                            <input
                                type="time"
                                value={settings.time}
                                onChange={e => saveSettings({ ...settings, time: e.target.value })}
                                className="time-input"
                            />
                        </div>

                        {/* Day Selector */}
                        <div className="reminder-section">
                            <label>📅 Hangi Günler?</label>
                            <div className="days-grid">
                                {allDays.map(day => (
                                    <button
                                        key={day}
                                        className={`day-btn ${settings.days.includes(day) ? 'selected' : ''}`}
                                        onClick={() => toggleDay(day)}
                                    >
                                        {day.substring(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Message */}
                        <div className="reminder-section">
                            <label>💬 Hatırlatma Mesajı</label>
                            <textarea
                                value={settings.message}
                                onChange={e => saveSettings({ ...settings, message: e.target.value })}
                                className="message-input"
                                rows={2}
                            />
                        </div>

                        {/* Test Button */}
                        <button
                            className={`test-btn ${testSent ? 'sent' : ''}`}
                            onClick={sendTestNotification}
                            disabled={permissionStatus !== 'granted'}
                        >
                            {testSent ? '✅ Bildirim Gönderildi!' : '🧪 Test Bildirimi Gönder'}
                        </button>
                    </>
                )}

                {/* Info */}
                <div className="reminder-info">
                    <p>💡 Hatırlatıcılar tarayıcı açıkken çalışır.</p>
                    <p>📱 Mobil uygulama için yakında!</p>
                </div>
            </div>
        </div>
    );
}

// Hook for scheduling notifications
export function useStudyReminder() {
    useEffect(() => {
        const checkReminder = () => {
            const saved = localStorage.getItem('visi-reminder-settings');
            if (!saved) return;

            const settings: ReminderSettings = JSON.parse(saved);
            if (!settings.enabled) return;

            const now = new Date();
            const dayName = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][now.getDay()];

            if (!settings.days.includes(dayName)) return;

            const [hours, minutes] = settings.time.split(':').map(Number);
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();

            if (currentHours === hours && currentMinutes === minutes) {
                const lastNotified = localStorage.getItem('visi-last-notified');
                const today = now.toDateString();

                if (lastNotified !== today) {
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('VİSİ AI Hatırlatıcı 🎓', {
                            body: settings.message,
                            icon: '/icon.png'
                        });
                        localStorage.setItem('visi-last-notified', today);
                    }
                }
            }
        };

        // Check every minute
        const interval = setInterval(checkReminder, 60000);
        checkReminder(); // Initial check

        return () => clearInterval(interval);
    }, []);
}
