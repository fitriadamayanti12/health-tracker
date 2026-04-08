'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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

    return (
        <main className="max-w-4xl mx-auto px-4 py-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-blue-600 hover:underline">
                        ← Kembali
                    </Link>
                    <h1 className="text-3xl font-bold">Riwayat Lengkap</h1>
                </div>

                {records.length > 0 && (
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border rounded-lg px-4 py-2 text-base"
                    >
                        <option value="all">Semua Bulan</option>
                        {getAvailableMonths().map(month => (
                            <option key={month} value={month}>{formatMonth(month)}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-500">Memuat data...</p>
                </div>
            )}

            {/* Empty */}
            {!loading && filteredRecords.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                        {selectedMonth === 'all'
                            ? 'Belum ada catatan kesehatan. Yuk tambahkan!'
                            : `Tidak ada catatan untuk ${formatMonth(selectedMonth)}`}
                    </p>
                    <Link href="/add" className="inline-block mt-4 text-blue-600 hover:underline">
                        + Tambah Catatan Baru
                    </Link>
                </div>
            )}

            {/* Grid Riwayat - 1 kolom, card besar */}
            <div className="space-y-4">
                {filteredRecords.map((record) => (
                    <div key={record.id} className="border rounded-xl p-6 shadow-sm bg-white">
                        {editingId === record.id ? (
                            // EDIT MODE
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-base font-medium mb-2">Gula Darah (mg/dL)</label>
                                    <input
                                        type="number"
                                        value={editForm.blood_sugar}
                                        onChange={(e) => setEditForm({ ...editForm, blood_sugar: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-3 text-base"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-base font-medium mb-2">Tensi Atas</label>
                                        <input
                                            type="number"
                                            value={editForm.systolic}
                                            onChange={(e) => setEditForm({ ...editForm, systolic: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-3 text-base"
                                            placeholder="Sistolik"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-base font-medium mb-2">Tensi Bawah</label>
                                        <input
                                            type="number"
                                            value={editForm.diastolic}
                                            onChange={(e) => setEditForm({ ...editForm, diastolic: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-3 text-base"
                                            placeholder="Diastolik"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-base font-medium mb-2">Catatan</label>
                                    <textarea
                                        value={editForm.notes}
                                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-3 text-base"
                                        rows={2}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleUpdate(record.id)}
                                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // VIEW MODE
                            <>
                                {/* Header: Tanggal + Aksi */}
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-base text-gray-500">
                                        📅 {new Date(record.recorded_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => startEdit(record)}
                                            className="text-blue-600 hover:text-blue-800 text-base"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(record.id)}
                                            className="text-red-600 hover:text-red-800 text-base"
                                        >
                                            🗑️ Hapus
                                        </button>
                                    </div>
                                </div>

                                {/* Body: Data Kesehatan */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-1">Gula Darah</p>
                                        <p className={`text-2xl font-bold ${record.blood_sugar > 180 ? 'text-red-600' :
                                                record.blood_sugar < 70 ? 'text-yellow-600' : 'text-gray-900'
                                            }`}>
                                            {record.blood_sugar} <span className="text-base font-normal text-gray-500">mg/dL</span>
                                        </p>
                                    </div>
                                    {record.systolic && record.diastolic && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-500 mb-1">Tekanan Darah</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {record.systolic}/{record.diastolic} <span className="text-base font-normal text-gray-500">mmHg</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Catatan */}
                                {record.notes && (
                                    <div className="mt-3 pt-3 border-t">
                                        <p className="text-sm text-gray-500 mb-1">📝 Catatan</p>
                                        <p className="text-gray-700">{record.notes}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Statistik */}
            {!loading && filteredRecords.length > 0 && (
                <div className="mt-8 p-5 bg-blue-50 rounded-xl">
                    <h3 className="font-semibold text-blue-800 mb-3 text-lg">📊 Ringkasan</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-blue-600">
                                {Math.round(filteredRecords.reduce((a, b) => a + (b.blood_sugar || 0), 0) / filteredRecords.length)}
                            </p>
                            <p className="text-sm text-gray-600">Rata-rata Gula Darah</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-600">
                                {filteredRecords.length}
                            </p>
                            <p className="text-sm text-gray-600">Total Catatan</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-600">
                                {filteredRecords.filter(r => r.blood_sugar > 180).length}
                            </p>
                            <p className="text-sm text-gray-600">Gula Tinggi (&gt;180)</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}