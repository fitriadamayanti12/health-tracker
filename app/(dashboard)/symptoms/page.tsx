'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Activity, Droplet, Moon, Eye, Brain, Heart, AlertCircle, Save, X } from 'lucide-react';

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

  const SymptomCard = ({ icon, label, checked, onChange }: { icon: React.ReactNode; label: string; checked: boolean; onChange: () => void }) => (
    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
      checked 
        ? 'border-blue-400 bg-blue-50 shadow-sm' 
        : 'border-gray-200 hover:bg-gray-50'
    }`}>
      <div className="flex items-center gap-3 flex-1">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          checked ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
        }`}>
          {icon}
        </div>
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
    </label>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Catatan Gejala Harian</h1>
        <p className="text-gray-500 mt-1">Catat gejala yang dirasakan untuk membantu diagnosis dokter</p>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          Catat gejala yang dirasakan ibu hari ini. Data ini sangat membantu dokter saat kontrol.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gejala Grid */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Gejala yang Dirasakan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SymptomCard
                icon={<Moon className="w-5 h-5" />}
                label="Mudah lelah / lemas"
                checked={formData.fatigue}
                onChange={() => setFormData({ ...formData, fatigue: !formData.fatigue })}
              />
              <SymptomCard
                icon={<Droplet className="w-5 h-5" />}
                label="Sering haus"
                checked={formData.thirsty}
                onChange={() => setFormData({ ...formData, thirsty: !formData.thirsty })}
              />
              <SymptomCard
                icon={<Activity className="w-5 h-5" />}
                label="Sering kencing"
                checked={formData.urination}
                onChange={() => setFormData({ ...formData, urination: !formData.urination })}
              />
              <SymptomCard
                icon={<Eye className="w-5 h-5" />}
                label="Pandangan kabur"
                checked={formData.blurred_vision}
                onChange={() => setFormData({ ...formData, blurred_vision: !formData.blurred_vision })}
              />
              <SymptomCard
                icon={<Brain className="w-5 h-5" />}
                label="Pusing"
                checked={formData.dizziness}
                onChange={() => setFormData({ ...formData, dizziness: !formData.dizziness })}
              />
              <SymptomCard
                icon={<Heart className="w-5 h-5" />}
                label="Mual"
                checked={formData.nausea}
                onChange={() => setFormData({ ...formData, nausea: !formData.nausea })}
              />
              <SymptomCard
                icon={<Activity className="w-5 h-5" />}
                label="Sakit kepala"
                checked={formData.headache}
                onChange={() => setFormData({ ...formData, headache: !formData.headache })}
              />
            </div>
          </div>

          {/* Gejala Lain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gejala lain (jika ada)
            </label>
            <input
              type="text"
              value={formData.other_symptoms}
              onChange={(e) => setFormData({ ...formData, other_symptoms: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Contoh: kesemutan, gatal, nyeri dada, dll"
            />
          </div>

          {/* Catatan Tambahan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan Tambahan
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              rows={3}
              placeholder="Contoh: Gejala muncul setelah makan, atau saat cuaca panas, dll"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {todaySymptoms ? 'Update Catatan' : 'Simpan Catatan'}
                </>
              )}
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              <X className="w-4 h-4" />
              Batal
            </Link>
          </div>
        </form>
      </div>

      {/* Link ke Riwayat */}
      <div className="mt-6 text-center">
        <Link href="/symptoms-history" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1">
          Lihat Riwayat Gejala →
        </Link>
      </div>
    </div>
  );
}