'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Pill, Plus, Trash2 } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule_time: string;
  notes: string;
}

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    schedule_time: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    const { data } = await supabase
      .from('medications')
      .select('*')
      .order('created_at', { ascending: false });
    setMedications(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('medications').insert([
      {
        name: formData.name,
        dosage: formData.dosage,
        schedule_time: formData.schedule_time,
        notes: formData.notes,
      },
    ]);

    setSubmitting(false);

    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    } else {
      setFormData({ name: '', dosage: '', schedule_time: '', notes: '' });
      setShowForm(false);
      fetchMedications();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus obat ini?')) {
      await supabase.from('medications').delete().eq('id', id);
      fetchMedications();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Memuat data...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Jadwal Obat</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-teal-700 transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Obat
        </button>
      </div>

      {/* Form Tambah Obat */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Tambah Obat Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Obat *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Contoh: Metformin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dosis</label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Contoh: 500mg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Waktu Minum</label>
              <input
                type="time"
                value={formData.schedule_time}
                onChange={(e) => setFormData({ ...formData, schedule_time: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Catatan</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={2}
                placeholder="Contoh: Diminum sebelum makan"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daftar Obat */}
      {medications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Belum ada data obat</p>
          <p className="text-sm mt-1">Klik "Tambah Obat" untuk menambahkan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map((med) => (
            <div key={med.id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{med.name}</h3>
                  {med.dosage && (
                    <p className="text-sm text-gray-500">Dosis: {med.dosage}</p>
                  )}
                  {med.schedule_time && (
                    <p className="text-sm text-gray-500">Waktu: {med.schedule_time}</p>
                  )}
                  {med.notes && (
                    <p className="text-sm text-gray-400 mt-1">{med.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(med.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}