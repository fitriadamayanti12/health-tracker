'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Droplet, Heart, Edit2, Trash2, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

export default function HistoryPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [editForm, setEditForm] = useState({
    blood_sugar: '',
    systolic: '',
    diastolic: '',
    notes: '',
  });

  const fetchRecords = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('health_records')
      .select('*')
      .order('recorded_at', { ascending: false });
    setRecords(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (selectedMonth === 'all') {
      setFilteredRecords(records);
    } else {
      const [year, month] = selectedMonth.split('-');
      const filtered = records.filter(record => {
        const date = new Date(record.recorded_at);
        return date.getFullYear() === parseInt(year) &&
          (date.getMonth() + 1) === parseInt(month);
      });
      setFilteredRecords(filtered);
    }
  }, [selectedMonth, records]);

  const getAvailableMonths = () => {
    const months = new Set<string>();
    records.forEach(record => {
      const date = new Date(record.recorded_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    return Array.from(months).sort().reverse();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus catatan ini?')) return;
    const { error } = await supabase.from('health_records').delete().eq('id', id);
    if (error) alert('Gagal menghapus: ' + error.message);
    else fetchRecords();
  };

  const startEdit = (record: any) => {
    setEditingId(record.id);
    setEditForm({
      blood_sugar: record.blood_sugar || '',
      systolic: record.systolic || '',
      diastolic: record.diastolic || '',
      notes: record.notes || '',
    });
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('health_records')
      .update({
        blood_sugar: parseInt(editForm.blood_sugar),
        systolic: parseInt(editForm.systolic) || null,
        diastolic: parseInt(editForm.diastolic) || null,
        notes: editForm.notes || null,
      })
      .eq('id', id);

    if (error) alert('Gagal update: ' + error.message);
    else {
      setEditingId(null);
      fetchRecords();
    }
  };

  const cancelEdit = () => setEditingId(null);

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const getSugarStatus = (value: number) => {
    if (value > 180) return { label: 'Tinggi', color: 'text-red-600 bg-red-50' };
    if (value < 70) return { label: 'Rendah', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'Normal', color: 'text-green-600 bg-green-50' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Riwayat Kesehatan</h1>
            <p className="text-gray-500 mt-1">Semua catatan gula darah dan tekanan darah</p>
          </div>
          {records.length > 0 && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="all">Semua Bulan</option>
              {getAvailableMonths().map(month => (
                <option key={month} value={month}>{formatMonth(month)}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Droplet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">
            {selectedMonth === 'all'
              ? 'Belum ada catatan kesehatan'
              : `Tidak ada catatan untuk ${formatMonth(selectedMonth)}`}
          </p>
          <Link
            href="/add"
            className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            + Tambah Catatan Baru
          </Link>
        </div>
      )}

      {/* List Catatan */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition">
            {editingId === record.id ? (
              // EDIT MODE
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gula Darah (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={editForm.blood_sugar}
                    onChange={(e) => setEditForm({ ...editForm, blood_sugar: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tensi Atas</label>
                    <input
                      type="number"
                      value={editForm.systolic}
                      onChange={(e) => setEditForm({ ...editForm, systolic: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Sistolik"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tensi Bawah</label>
                    <input
                      type="number"
                      value={editForm.diastolic}
                      onChange={(e) => setEditForm({ ...editForm, diastolic: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Diastolik"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    rows={2}
                    placeholder="Tambahkan catatan..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(record.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              // VIEW MODE
              <>
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {new Date(record.recorded_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(record)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Data Kesehatan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`rounded-lg p-4 ${getSugarStatus(record.blood_sugar).color}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Droplet className="w-4 h-4" />
                      <p className="text-sm font-medium">Gula Darah</p>
                    </div>
                    <p className="text-2xl font-bold">
                      {record.blood_sugar} <span className="text-sm font-normal">mg/dL</span>
                    </p>
                    <p className="text-xs mt-1 opacity-75">{getSugarStatus(record.blood_sugar).label}</p>
                  </div>

                  {record.systolic && record.diastolic && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <p className="text-sm font-medium text-gray-700">Tekanan Darah</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {record.systolic}/{record.diastolic} <span className="text-sm font-normal text-gray-500">mmHg</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Catatan */}
                {record.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-500 mb-1">📝 Catatan</p>
                    <p className="text-gray-600 text-sm">{record.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Statistik Ringkasan */}
      {filteredRecords.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Ringkasan</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(filteredRecords.reduce((a, b) => a + (b.blood_sugar || 0), 0) / filteredRecords.length)}
              </p>
              <p className="text-xs text-gray-500">Rata-rata Gula Darah</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{filteredRecords.length}</p>
              <p className="text-xs text-gray-500">Total Catatan</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {filteredRecords.filter(r => r.blood_sugar > 180).length}
              </p>
              <p className="text-xs text-gray-500">Gula Tinggi (&gt;180)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}