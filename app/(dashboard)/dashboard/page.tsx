'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Activity, Droplet, Heart, Calendar } from 'lucide-react';
import BloodSugarChart from '@/components/BloodSugarChart';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    avgBloodSugar: 0,
    lastCheck: '',
    totalRecords: 0,
    highCount: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Ambil data untuk statistik
      const { data: records } = await supabase
        .from('health_records')
        .select('*')
        .order('recorded_at', { ascending: false });

      if (records && records.length > 0) {
        const avg = records.reduce((sum, r) => sum + r.blood_sugar, 0) / records.length;
        const high = records.filter(r => r.blood_sugar > 180).length;
        
        setStats({
          avgBloodSugar: Math.round(avg),
          lastCheck: new Date(records[0].recorded_at).toLocaleDateString('id-ID'),
          totalRecords: records.length,
          highCount: high,
        });
      }

      // Ambil data untuk grafik (7 hari terakhir, urutan ascending)
      const { data: chartRecords } = await supabase
        .from('health_records')
        .select('blood_sugar, recorded_at')
        .order('recorded_at', { ascending: true })
        .limit(7);

      if (chartRecords && chartRecords.length > 0) {
        const formatted = chartRecords.map((record) => ({
          date: new Date(record.recorded_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
          }),
          blood_sugar: record.blood_sugar,
        }));
        setChartData(formatted);
      }

      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Memuat data...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rata-rata Gula Darah</p>
              <p className="text-2xl font-bold text-gray-800">{stats.avgBloodSugar} mg/dL</p>
            </div>
            <Droplet className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Terakhir Cek</p>
              <p className="text-2xl font-bold text-gray-800">{stats.lastCheck || '-'}</p>
            </div>
            <Calendar className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Catatan</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalRecords}</p>
            </div>
            <Activity className="w-10 h-10 text-purple-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Gula Darah Tinggi</p>
              <p className="text-2xl font-bold text-gray-800">{stats.highCount}</p>
            </div>
            <Heart className="w-10 h-10 text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Grafik */}
      {chartData.length > 0 && (
        <div className="mb-8">
          <BloodSugarChart data={chartData} />
        </div>
      )}

      {/* Welcome Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Selamat Datang!</h2>
        <p className="text-gray-600">
          Pantau kesehatan ibu secara rutin. Catat gula darah dan tekanan darah untuk melihat perkembangan.
        </p>
        <button className="mt-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-teal-700 transition">
          + Tambah Catatan Baru
        </button>
      </div>
    </div>
  );
}