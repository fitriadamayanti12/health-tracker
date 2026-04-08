'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BrowserNotification from '../components/BrowserNotification';

export default function ReminderPage() {
    const [nextCheckDate, setNextCheckDate] = useState<string>('');
    const [daysLeft, setDaysLeft] = useState<number>(0);
    const [reminderTime, setReminderTime] = useState<string>('08:00');
    const [reminderActive, setReminderActive] = useState<boolean>(false);

    // Load saved data
    useEffect(() => {
        const saved = localStorage.getItem('nextCheckDate');
        const savedTime = localStorage.getItem('reminderTime');
        const savedActive = localStorage.getItem('reminderActive');

        if (saved) {
            setNextCheckDate(saved);
            calculateDaysLeft(saved);
        }
        if (savedTime) setReminderTime(savedTime);
        if (savedActive) setReminderActive(savedActive === 'true');
    }, []);

    const calculateDaysLeft = (date: string) => {
        const today = new Date();
        const target = new Date(date);
        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysLeft(diffDays);
    };

    const handleSetDate = (e: React.FormEvent) => {
        e.preventDefault();
        if (nextCheckDate) {
            localStorage.setItem('nextCheckDate', nextCheckDate);
            calculateDaysLeft(nextCheckDate);
            alert('Jadwal cek gula darah disimpan!');

            // Kirim notifikasi jika diizinkan (hanya di browser)
            if (typeof window !== 'undefined' && reminderActive && 'Notification' in window && Notification.permission === 'granted') {
                new Notification('Health Tracker', {
                    body: `Jadwal cek gula darah telah disimpan. ${daysLeft > 0 ? daysLeft : 0} hari lagi.`,
                    icon: '/icon.png',
                });
            }
        }
    };

    const handleSaveReminder = () => {
        localStorage.setItem('reminderTime', reminderTime);
        localStorage.setItem('reminderActive', String(reminderActive));
        alert('Pengaturan pengingat disimpan!');
    };

    return (
        <main className="max-w-2xl mx-auto px-4 py-16">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="text-blue-600 hover:underline">
                    ← Kembali
                </Link>
                <h1 className="text-2xl font-bold">Pengingat Cek Gula Darah</h1>
            </div>

            {/* Notifikasi Browser */}
            <div className="bg-white rounded-lg border p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">🔔 Notifikasi Browser</h2>
                <p className="text-sm text-gray-600 mb-3">
                    Aktifkan notifikasi untuk mendapatkan pengingat otomatis.
                </p>
                <BrowserNotification />
            </div>

            {/* Jadwal Cek */}
            <div className="bg-white rounded-lg border p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">📅 Jadwal Cek Berikutnya</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Karena cek gula darah dilakukan setiap 2 minggu sekali, atur jadwal berikutnya agar kamu tidak lupa.
                </p>
                <form onSubmit={handleSetDate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Tanggal Cek Berikutnya
                        </label>
                        <input
                            type="date"
                            value={nextCheckDate}
                            onChange={(e) => setNextCheckDate(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Simpan Jadwal
                    </button>
                </form>
            </div>

            {/* Pengaturan Pengingat */}
            <div className="bg-white rounded-lg border p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">⏰ Pengaturan Pengingat Harian</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Waktu Pengingat
                        </label>
                        <input
                            type="time"
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={reminderActive}
                            onChange={(e) => setReminderActive(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <label className="text-sm">
                            Aktifkan pengingat harian untuk cek gula darah
                        </label>
                    </div>
                    <button
                        onClick={handleSaveReminder}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                        Simpan Pengaturan
                    </button>
                </div>
            </div>

            {/* Status Jadwal */}
            {daysLeft > 0 && (
                <div className={`p-6 rounded-lg text-center ${daysLeft <= 3 ? 'bg-orange-100 border border-orange-300' : 'bg-green-50 border border-green-200'
                    }`}>
                    <h2 className="text-lg font-semibold mb-2">📢 Status Jadwal</h2>
                    <p className="text-3xl font-bold mb-2">
                        {new Date(nextCheckDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                    <p className={`text-lg ${daysLeft <= 3 ? 'text-orange-700 font-semibold' : 'text-gray-600'}`}>
                        {daysLeft === 0 ? 'Hari ini!' : `${daysLeft} hari lagi`}
                    </p>
                </div>
            )}

            <div className="mt-6 text-center">
                <Link href="/add" className="text-blue-600 hover:underline">
                    + Tambah Catatan Hasil Cek
                </Link>
            </div>
        </main>
    );
}