'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

export default function BrowserNotification() {
  const [isSupported, setIsSupported] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsReady(true);
      const isNotificationAvailable = 'Notification' in window;
      setIsSupported(isNotificationAvailable);
      if (isNotificationAvailable) {
        setIsGranted(Notification.permission === 'granted');
      }
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) {
      alert('Browser Anda tidak mendukung notifikasi');
      return;
    }
    const permission = await Notification.requestPermission();
    setIsGranted(permission === 'granted');
    if (permission === 'granted') {
      new Notification('Health Tracker', {
        body: 'Notifikasi berhasil diaktifkan!',
      });
    }
  };

  const sendTestNotification = () => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) {
      alert('Browser tidak mendukung notifikasi');
      return;
    }
    if (isGranted) {
      new Notification('Health Tracker', {
        body: 'Test notifikasi berhasil!',
      });
    } else {
      alert('Notifikasi belum diaktifkan.');
    }
  };

  if (!isReady) return <div className="text-sm text-gray-500">Loading...</div>;
  if (!isSupported) return <div className="text-sm text-orange-600">⚠️ Notifikasi tidak didukung browser ini.</div>;

  return (
    <div className="flex flex-col gap-2">
      {!isGranted ? (
        <button
          onClick={requestPermission}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Bell className="w-4 h-4" />
          Aktifkan Notifikasi
        </button>
      ) : (
        <button
          onClick={sendTestNotification}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Bell className="w-4 h-4" />
          Kirim Test Notifikasi
        </button>
      )}
    </div>
  );
}