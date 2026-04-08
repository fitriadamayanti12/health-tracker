'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SymptomsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [todaySymptoms, setTodaySymptoms] = useState<any>(null);
  const [formData, setFormData] = useState({
    fatigue: false,
    thirsty: false,
    urination: false,
    blurred_vision: false,
    dizziness: false,
    nausea: false,
    headache: false,
    other_symptoms: '',
    notes: '',
  });

  // Cek apakah sudah ada catatan untuk hari ini
  useEffect(() => {
    const checkTodayRecord = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('symptoms')
        .select('*')
        .eq('date', today)
        .single();
      
      if (data) {
        setTodaySymptoms(data);
        setFormData({
          fatigue: data.fatigue,
          thirsty: data.thirsty,
          urination: data.urination,
          blurred_vision: data.blurred_vision,
          dizziness: data.dizziness,
          nausea: data.nausea,
          headache: data.headache,
          other_symptoms: data.other_symptoms || '',
          notes: data.notes || '',
        });
      }
    };
    checkTodayRecord();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const today = new Date().toISOString().split('T')[0];

    if (todaySymptoms) {
      // Update existing
      const { error } = await supabase
        .from('symptoms')
        .update(formData)
        .eq('date', today);
      
      if (error) {
        alert('Gagal update: ' + error.message);
      } else {
        alert('Catatan gejala berhasil diupdate!');
        router.refresh();
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('symptoms')
        .insert([{ ...formData, date: today }]);
      
      if (error) {
        alert('Gagal menyimpan: ' + error.message);
      } else {
        alert('Catatan gejala berhasil disimpan!');
        router.refresh();
      }
    }
    setLoading(false);
  };

  const SymptomCheckbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 text-blue-600"
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold">Catatan Gejala Harian</h1>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          📝 Catat gejala yang dirasakan ibu hari ini. Data ini sangat membantu dokter saat kontrol.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Gejala yang Dirasakan</h2>
          <SymptomCheckbox
            label="😴 Mudah lelah / lemas"
            checked={formData.fatigue}
            onChange={() => setFormData({ ...formData, fatigue: !formData.fatigue })}
          />
          <SymptomCheckbox
            label="💧 Sering haus"
            checked={formData.thirsty}
            onChange={() => setFormData({ ...formData, thirsty: !formData.thirsty })}
          />
          <SymptomCheckbox
            label="🚽 Sering kencing"
            checked={formData.urination}
            onChange={() => setFormData({ ...formData, urination: !formData.urination })}
          />
          <SymptomCheckbox
            label="👁️ Pandangan kabur"
            checked={formData.blurred_vision}
            onChange={() => setFormData({ ...formData, blurred_vision: !formData.blurred_vision })}
          />
          <SymptomCheckbox
            label="😵 Pusing"
            checked={formData.dizziness}
            onChange={() => setFormData({ ...formData, dizziness: !formData.dizziness })}
          />
          <SymptomCheckbox
            label="🤢 Mual"
            checked={formData.nausea}
            onChange={() => setFormData({ ...formData, nausea: !formData.nausea })}
          />
          <SymptomCheckbox
            label="🤕 Sakit kepala"
            checked={formData.headache}
            onChange={() => setFormData({ ...formData, headache: !formData.headache })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Gejala lain (jika ada)
          </label>
          <input
            type="text"
            value={formData.other_symptoms}
            onChange={(e) => setFormData({ ...formData, other_symptoms: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Contoh: kesemutan, gatal, dll"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Catatan Tambahan
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            rows={3}
            placeholder="Contoh: Setelah makan, aktivitas hari ini, dll"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : todaySymptoms ? 'Update Catatan' : 'Simpan Catatan'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/symptoms-history" className="text-blue-600 hover:underline">
          Lihat Riwayat Gejala →
        </Link>
      </div>
    </main>
  );
}