'use client';

import { useState, useEffect } from 'react';

export default function BrowserNotification() {
    const [isSupported, setIsSupported] = useState(false);
    const [isGranted, setIsGranted] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsReady(true);

            const isNotificationAvailable = typeof window !== 'undefined' &&
                'Notification' in window;

            setIsSupported(isNotificationAvailable);

            if (isNotificationAvailable) {
                const NotifAPI = (window as any).Notification;
                if (NotifAPI) {
                    setIsGranted(NotifAPI.permission === 'granted');
                }
            }
        }
    }, []);

    const requestPermission = async () => {
        if (typeof window === 'undefined') {
            alert('Notifikasi hanya tersedia di browser');
            return;
        }

        if (!('Notification' in window)) {
            alert('Browser Anda tidak mendukung notifikasi');
            return;
        }

        try {
            const NotifAPI = (window as any).Notification;
            const permission = await NotifAPI.requestPermission();
            setIsGranted(permission === 'granted');

            if (permission === 'granted') {
                new NotifAPI('Health Tracker', {
                    body: 'Notifikasi berhasil diaktifkan!',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Gagal mengaktifkan notifikasi');
        }
    };

    const sendTestNotification = () => {
        if (typeof window === 'undefined') return;

        if (!('Notification' in window)) {
            alert('Browser tidak mendukung notifikasi');
            return;
        }

        if (isGranted) {
            const NotifAPI = (window as any).Notification;
            new NotifAPI('Health Tracker', {
                body: 'Test notifikasi berhasil!',
            });
        } else {
            alert('Notifikasi belum diaktifkan.');
        }
    };

    if (!isReady) {
        return <div className="text-sm text-gray-500">Loading...</div>;
    }

    if (!isSupported) {
        return (
            <div className="text-sm text-orange-600">
                ⚠️ Notifikasi tidak tersedia. Gunakan HTTPS atau localhost.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {!isGranted ? (
                <button
                    onClick={requestPermission}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                    🔔 Aktifkan Notifikasi
                </button>
            ) : (
                <button
                    onClick={sendTestNotification}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                    🔔 Kirim Test Notifikasi
                </button>
            )}
        </div>
    );
}