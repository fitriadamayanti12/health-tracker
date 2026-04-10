'use client';

import { useState, useEffect } from 'react';
import { Target, Save, AlertCircle } from 'lucide-react';

export default function TargetPage() {
  const [targetMin, setTargetMin] = useState(70);
  const [targetMax, setTargetMax] = useState(180);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedMin = localStorage.getItem('sugarTargetMin');
    const savedMax = localStorage.getItem('sugarTargetMax');
    if (savedMin && savedMax) {
      setTargetMin(parseInt(savedMin));
      setTargetMax(parseInt(savedMax));
    }
  }, []);

  const handleSave = () => {
    if (targetMin >= targetMax) {
      setError('Nilai minimal harus kurang dari maksimal');
      return;
    }
    if (targetMin < 0 || targetMax < 0) {
      setError('Nilai tidak boleh negatif');
      return;
    }

    localStorage.setItem('sugarTargetMin', targetMin.toString());
    localStorage.setItem('sugarTargetMax', targetMax.toString());
    
    setError('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Target Gula Darah</h1>
        <p className="text-gray-500 mt-1">Atur target gula darah pribadi untuk peringatan</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Target Pribadi</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimal (mg/dL)
            </label>
            <input
              type="number"
              value={targetMin}
              onChange={(e) => setTargetMin(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">Nilai di bawah ini akan dianggap rendah</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maksimal (mg/dL)
            </label>
            <input
              type="number"
              value={targetMax}
              onChange={(e) => setTargetMax(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">Nilai di atas ini akan dianggap tinggi</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-600">Target berhasil disimpan!</p>
          </div>
        )}

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition"
        >
          <Save className="w-4 h-4" />
          Simpan Target
        </button>
      </div>

      {/* Standar Medis */}
      <div className="bg-blue-50 rounded-xl p-5 mt-6 border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2">📋 Standar Medis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-lg p-3">
            <p className="text-gray-500">Puasa / Sebelum Makan</p>
            <p className="text-lg font-bold text-green-600">70-130 mg/dL</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-gray-500">Setelah Makan (1-2 jam)</p>
            <p className="text-lg font-bold text-blue-600">&lt; 180 mg/dL</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Target pribadi dapat disesuaikan dengan rekomendasi dokter
        </p>
      </div>
    </div>
  );
}