'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Droplet, Heart, Save, X, Target, Activity, AlertCircle } from 'lucide-react';

export default function AddRecord() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bloodSugar, setBloodSugar] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [notes, setNotes] = useState('');
  const [warning, setWarning] = useState('');
  const [warningBg, setWarningBg] = useState('');
  const [target, setTarget] = useState({ min: 70, max: 180 });

  useEffect(() => {
    const savedMin = localStorage.getItem('sugarTargetMin');
    const savedMax = localStorage.getItem('sugarTargetMax');
    if (savedMin && savedMax) {
      setTarget({ min: parseInt(savedMin), max: parseInt(savedMax) });
    }
  }, []);

  const getSugarStatus = (value: number) => {
    if (value > target.max) {
      return { 
        text: `⚠️ Tinggi! (di atas ${target.max} mg/dL)`, 
        bg: 'bg-red-50 border-red-200 text-red-700'
      };
    }
    if (value > 140) {
      return { 
        text: `⚠️ Di atas normal (140-${target.max} mg/dL)`, 
        bg: 'bg-orange-50 border-orange-200 text-orange-700'
      };
    }
    if (value < target.min) {
      return { 
        text: `⚠️ Rendah! (di bawah ${target.min} mg/dL)`, 
        bg: 'bg-yellow-50 border-yellow-200 text-yellow-700'
      };
    }
    return { 
      text: '✅ Normal', 
      bg: 'bg-green-50 border-green-200 text-green-700'
    };
  };

  const handleBloodSugarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBloodSugar(value);
    if (value) {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        const status = getSugarStatus(numValue);
        setWarning(status.text);
        setWarningBg(status.bg);
      } else {
        setWarning('');
      }
    } else {
      setWarning('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('health_records').insert([
      {
        blood_sugar: parseInt(bloodSugar),
        systolic: parseInt(systolic) || null,
        diastolic: parseInt(diastolic) || null,
        notes: notes || null,
      },
    ]);

    setLoading(false);

    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tambah Catatan Kesehatan</h1>
        <p className="text-gray-500 mt-1">Catat gula darah, tekanan darah, dan gejala harian</p>
      </div>

      {/* Form Utama */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Gula Darah */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gula Darah <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                required
                value={bloodSugar}
                onChange={handleBloodSugarChange}
                className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Contoh: 140"
              />
            </div>
            {warning && (
              <div className={`mt-2 px-4 py-2 rounded-lg border ${warningBg}`}>
                <p className="text-sm font-medium">{warning}</p>
              </div>
            )}
          </div>

          {/* Tekanan Darah - Grid 2 kolom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tekanan Darah
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Sistolik (atas)"
                />
              </div>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Diastolik (bawah)"
                />
              </div>
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              rows={4}
              placeholder="Contoh: Setelah makan, atau ibu merasa pusing..."
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
                  Simpan Catatan
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

      {/* Target Gula Darah Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mt-6 border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Target Gula Darah</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-500">Puasa / Sebelum Makan</p>
            <p className="text-lg font-bold text-green-600">70-130 mg/dL</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-gray-500">Setelah Makan (1-2 jam)</p>
            <p className="text-lg font-bold text-blue-600">&lt; 180 mg/dL</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-gray-500 text-center">
            Target pribadi: {target.min} - {target.max} mg/dL
          </p>
        </div>
      </div>

      {/* Tips Kesehatan */}
      <div className="bg-white rounded-xl p-5 mt-6 border shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-800">Tips Kesehatan</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="flex gap-2">📝 Catat gula darah secara rutin setiap hari</div>
          <div className="flex gap-2">⏰ Usahakan cek di jam yang sama</div>
          <div className="flex gap-2">🍽️ Catat juga kondisi sebelum/sesudah makan</div>
          <div className="flex gap-2">💊 Jangan lupa catat konsumsi obat</div>
        </div>
      </div>

      {/* Catatan Penting */}
      <div className="bg-yellow-50 rounded-xl p-4 mt-6 border border-yellow-200">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-700">
            <span className="font-semibold">Catatan:</span> Data kesehatan ini bersifat pribadi. 
            Konsultasikan hasil dengan dokter untuk penanganan lebih lanjut.
          </p>
        </div>
      </div>
    </div>
  );
}