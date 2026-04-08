'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import BloodSugarChart from './components/BloodSugarChart';
import SugarTarget from './components/SugarTarget';
import { useState, useEffect } from 'react';

export default function Home() {
  const [records, setRecords] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Ambil data untuk riwayat (10 terbaru)
      const { data: historyData } = await supabase
        .from('health_records')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(10);

      // Ambil data untuk grafik (7 terakhir, urutan ascending)
      const { data: graphData } = await supabase
        .from('health_records')
        .select('blood_sugar, recorded_at')
        .order('recorded_at', { ascending: true })
        .limit(7);

      setRecords(historyData || []);
      setChartData(graphData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const exportToCSV = async () => {
    // Ambil semua data untuk export
    const { data: allData } = await supabase
      .from('health_records')
      .select('*')
      .order('recorded_at', { ascending: false });

    if (!allData || allData.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    const headers = ['Tanggal', 'Gula Darah (mg/dL)', 'Tekanan Darah (Sistolik)', 'Tekanan Darah (Diastolik)', 'Catatan'];

    const rows = allData.map(record => [
      new Date(record.recorded_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      record.blood_sugar,
      record.systolic || '',
      record.diastolic || '',
      record.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data-kesehatan-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Format data untuk grafik
  const formattedChartData = chartData.map((record) => ({
    date: new Date(record.recorded_at).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    }),
    blood_sugar: record.blood_sugar,
  }));

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p>Memuat data...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Health Tracker</h1>
      <p className="text-gray-600 mb-8">Mencatat kesehatan ibu, merawat dengan hati</p>

      <SugarTarget records={records} />
      {/* Tombol aksi */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Tambah Catatan
        </Link>
        <Link
          href="/history"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Riwayat
        </Link>
        <Link
          href="/statistics"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Statistik
        </Link>
        <Link
          href="/reminder"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Pengingat
        </Link>
        <Link
          href="/symptoms"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Gejala
        </Link>
        <Link
          href="/report"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Laporan Dokter
        </Link>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Grafik Tren */}
      {formattedChartData.length > 0 && (
        <div className="mb-8">
          <BloodSugarChart data={formattedChartData} />
        </div>
      )}

      {/* Riwayat Terbaru */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Riwayat Terbaru</h2>
        {records.length === 0 && (
          <p className="text-gray-500 text-center py-8">Belum ada catatan kesehatan. Yuk tambahkan!</p>
        )}
        {records.map((record) => (
          <div key={record.id} className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              {new Date(record.recorded_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <p className={`text-lg font-semibold ${record.blood_sugar > 180 ? 'text-red-600' :
                record.blood_sugar < 70 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                {record.blood_sugar} mg/dL
              </p>
              {record.systolic && record.diastolic && (
                <p>
                  <span className="font-medium">Tekanan Darah:</span> {record.systolic}/{record.diastolic}
                </p>
              )}
            </div>
            {record.notes && (
              <p className="text-gray-600 text-sm mt-2">{record.notes}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}