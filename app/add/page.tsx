'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AddRecord() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bloodSugar, setBloodSugar] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [notes, setNotes] = useState('');
  const [warning, setWarning] = useState('');
  const [target, setTarget] = useState({ min: 70, max: 180 });

  // Ambil target dari localStorage
  useEffect(() => {
    const savedMin = localStorage.getItem('sugarTargetMin');
    const savedMax = localStorage.getItem('sugarTargetMax');
    if (savedMin && savedMax) {
      setTarget({ min: parseInt(savedMin), max: parseInt(savedMax) });
    }
  }, []);

  const getSugarStatus = (value: number) => {
    if (value > target.max) {
      return { text: `⚠️ Tinggi! (di atas ${target.max} mg/dL)`, color: 'text-red-600' };
    }
    if (value > 140) {
      return { text: `⚠️ Di atas normal (140-${target.max} mg/dL)`, color: 'text-orange-500' };
    }
    if (value < target.min) {
      return { text: `⚠️ Rendah! (di bawah ${target.min} mg/dL)`, color: 'text-yellow-600' };
    }
    return { text: '✅ Normal', color: 'text-green-600' };
  };

  const handleBloodSugarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBloodSugar(value);
    if (value) {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        const status = getSugarStatus(numValue);
        setWarning(status.text);
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
      router.push('/');
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold">Tambah Catatan Kesehatan</h1>
      </div>

      {/* Target Gula Darah Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">📊 Target Gula Darah</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-green-100 rounded p-2 text-center">
            <p className="text-green-800 font-medium">Puas / Sebelum Makan</p>
            <p className="text-xl font-bold text-green-700">70-130 mg/dL</p>
          </div>
          <div className="bg-blue-100 rounded p-2 text-center">
            <p className="text-blue-800 font-medium">Setelah Makan (1-2 jam)</p>
            <p className="text-xl font-bold text-blue-700">&lt; 180 mg/dL</p>
          </div>
        </div>
        <div className="mt-3 text-xs text-blue-700 text-center">
          Target pribadi: {target.min} - {target.max} mg/dL
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Gula Darah (mg/dL) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            value={bloodSugar}
            onChange={handleBloodSugarChange}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Contoh: 140"
          />
          {warning && (
            <p className={`text-sm mt-1 font-medium ${warning.includes('Normal') ? 'text-green-600' : warning.includes('Tinggi') ? 'text-red-600' : warning.includes('Rendah') ? 'text-yellow-600' : 'text-orange-500'}`}>
              {warning}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Tekanan Darah (Atas)
            </label>
            <input
              type="number"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Sistolik"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tekanan Darah (Bawah)
            </label>
            <input
              type="number"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Diastolik"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Catatan</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            rows={3}
            placeholder="Contoh: Setelah makan, atau ibu merasa pusing..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <Link
            href="/"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Batal
          </Link>
        </div>
      </form>
    </main>
  );
}