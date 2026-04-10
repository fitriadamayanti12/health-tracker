'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Calendar, Clock, Save, PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';
import BrowserNotification from '@/components/BrowserNotification';

export default function ReminderPage() {
  const [nextCheckDate, setNextCheckDate] = useState<string>('');
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [reminderTime, setReminderTime] = useState<string>('08:00');
  const [reminderActive, setReminderActive] = useState<boolean>(false);
  const [savedDate, setSavedDate] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nextCheckDate');
    const savedTime = localStorage.getItem('reminderTime');
    const savedActive = localStorage.getItem('reminderActive');

    if (saved) {
      setNextCheckDate(saved);
      calculateDaysLeft(saved);
      setSavedDate(true);
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
      setSavedDate(true);
      alert('Jadwal cek gula darah disimpan!');

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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          ← Kembali ke Dashboard
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Pengingat Cek Gula Darah</h1>
        <p className="text-gray-500 mt-1">Atur jadwal dan pengingat rutin untuk cek gula darah</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri - Jadwal */}
        <div className="space-y-6">
          {/* Notifikasi Browser */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-800">Notifikasi Browser</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Aktifkan notifikasi untuk mendapatkan pengingat otomatis di browser Anda.
            </p>
            <BrowserNotification />
          </div>

          {/* Jadwal Cek */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-800">Jadwal Cek Berikutnya</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Cek gula darah dilakukan setiap <span className="font-medium">2 minggu sekali</span>. Atur jadwal berikutnya agar tidak lupa.
            </p>
            <form onSubmit={handleSetDate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Cek Berikutnya
                </label>
                <input
                  type="date"
                  value={nextCheckDate}
                  onChange={(e) => setNextCheckDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition"
              >
                <Save className="w-4 h-4" />
                Simpan Jadwal
              </button>
            </form>
          </div>

          {/* Status Jadwal */}
          {savedDate && daysLeft > 0 && (
            <div className={`rounded-xl p-5 border ${
              daysLeft <= 3 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-3">
                {daysLeft <= 3 ? (
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-semibold ${daysLeft <= 3 ? 'text-orange-800' : 'text-green-800'}`}>
                    Status Jadwal
                  </h3>
                  <p className="text-2xl font-bold mt-2 text-gray-800">
                    {new Date(nextCheckDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className={`text-lg mt-1 ${daysLeft <= 3 ? 'text-orange-700' : 'text-green-700'}`}>
                    {daysLeft === 0 ? 'Hari ini!' : `${daysLeft} hari lagi`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan - Pengaturan Pengingat */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-800">Pengaturan Pengingat Harian</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu Pengingat
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <p className="text-xs text-gray-400 mt-1">Pilih jam untuk menerima pengingat harian</p>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={reminderActive}
                  onChange={(e) => setReminderActive(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label className="text-gray-700">
                  Aktifkan pengingat harian untuk cek gula darah
                </label>
              </div>

              <button
                onClick={handleSaveReminder}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-3 rounded-lg font-medium hover:bg-gray-200 transition w-full justify-center"
              >
                <Save className="w-4 h-4" />
                Simpan Pengaturan
              </button>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Tips</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Usahakan cek gula darah di jam yang sama</li>
                  <li>• Catat hasil cek segera setelah dilakukan</li>
                  <li>• Bawa catatan saat kontrol ke dokter</li>
                  <li>• Jangan lupa makan sebelum cek jika diperlukan</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Link ke Tambah Catatan */}
          <div className="text-center">
            <Link
              href="/add"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
            >
              <PlusCircle className="w-4 h-4" />
              Tambah Catatan Hasil Cek
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}