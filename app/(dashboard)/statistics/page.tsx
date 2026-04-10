import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Activity, TrendingUp, Droplet, Calendar, AlertCircle, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StatisticsPage() {
  // Ambil semua data gula darah
  const { data: records } = await supabase
    .from('health_records')
    .select('*')
    .order('recorded_at', { ascending: true });

  // Ambil data gejala
  const { data: symptoms } = await supabase
    .from('symptoms')
    .select('*')
    .order('date', { ascending: false });

  // Statistik Gula Darah
  const sugarValues = records?.map(r => r.blood_sugar).filter(Boolean) || [];
  const totalRecords = records?.length || 0;
  const avgSugar = sugarValues.length > 0
    ? Math.round(sugarValues.reduce((a, b) => a + b, 0) / sugarValues.length)
    : 0;
  const maxSugar = sugarValues.length > 0 ? Math.max(...sugarValues) : 0;
  const minSugar = sugarValues.length > 0 ? Math.min(...sugarValues) : 0;

  // Hitung persentase di luar normal
  const highCount = sugarValues.filter(v => v > 180).length;
  const lowCount = sugarValues.filter(v => v < 70).length;
  const normalCount = sugarValues.length - highCount - lowCount;
  const highPercent = sugarValues.length > 0 ? Math.round((highCount / sugarValues.length) * 100) : 0;
  const lowPercent = sugarValues.length > 0 ? Math.round((lowCount / sugarValues.length) * 100) : 0;
  const normalPercent = sugarValues.length > 0 ? Math.round((normalCount / sugarValues.length) * 100) : 0;

  // Statistik per bulan
  const monthlyData: { [key: string]: { total: number; count: number; high: number } } = {};
  records?.forEach(record => {
    const date = new Date(record.recorded_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { total: 0, count: 0, high: 0 };
    }
    monthlyData[monthKey].total += record.blood_sugar;
    monthlyData[monthKey].count++;
    if (record.blood_sugar > 180) monthlyData[monthKey].high++;
  });

  // Gejala paling sering muncul
  const symptomCount = {
    fatigue: symptoms?.filter(s => s.fatigue).length || 0,
    thirsty: symptoms?.filter(s => s.thirsty).length || 0,
    urination: symptoms?.filter(s => s.urination).length || 0,
    blurred_vision: symptoms?.filter(s => s.blurred_vision).length || 0,
    dizziness: symptoms?.filter(s => s.dizziness).length || 0,
    nausea: symptoms?.filter(s => s.nausea).length || 0,
    headache: symptoms?.filter(s => s.headache).length || 0,
  };

  const topSymptom = Object.entries(symptomCount).sort((a, b) => b[1] - a[1])[0];

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const getSymptomName = (key: string) => {
    const symptoms: Record<string, string> = {
      fatigue: 'Mudah lelah',
      thirsty: 'Sering haus',
      urination: 'Sering kencing',
      blurred_vision: 'Pandangan kabur',
      dizziness: 'Pusing',
      nausea: 'Mual',
      headache: 'Sakit kepala',
    };
    return symptoms[key] || key;
  };

  if (totalRecords === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Statistik & Insight</h1>
          <p className="text-gray-500 mt-1">Analisis data kesehatan Anda</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Belum ada data kesehatan</p>
          <Link href="/add" className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-medium">
            + Tambah Catatan Baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Statistik & Insight</h1>
        <p className="text-gray-500 mt-1">Analisis lengkap data kesehatan Anda</p>
      </div>

      {/* Ringkasan Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-sm">
          <Droplet className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl md:text-3xl font-bold">{totalRecords}</p>
          <p className="text-xs opacity-90">Total Catatan</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-sm">
          <TrendingUp className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl md:text-3xl font-bold">{avgSugar}</p>
          <p className="text-xs opacity-90">Rata-rata (mg/dL)</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-sm">
          <Activity className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl md:text-3xl font-bold">{maxSugar}</p>
          <p className="text-xs opacity-90">Tertinggi</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white shadow-sm">
          <Award className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl md:text-3xl font-bold">{minSugar}</p>
          <p className="text-xs opacity-90">Terendah</p>
        </div>
      </div>

      {/* Distribusi Gula Darah */}
      <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Distribusi Gula Darah
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>✅ Normal (70-180 mg/dL)</span>
              <span className="font-medium">{normalPercent}% ({normalCount})</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full transition-all" style={{ width: `${normalPercent}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>⚠️ Tinggi (&gt;180 mg/dL)</span>
              <span className="font-medium">{highPercent}% ({highCount})</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-red-500 h-2.5 rounded-full transition-all" style={{ width: `${highPercent}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>⚠️ Rendah (&lt;70 mg/dL)</span>
              <span className="font-medium">{lowPercent}% ({lowCount})</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-yellow-500 h-2.5 rounded-full transition-all" style={{ width: `${lowPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Rata-rata per Bulan */}
      {Object.keys(monthlyData).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Rata-rata per Bulan
          </h2>
          <div className="space-y-3">
            {Object.entries(monthlyData)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .map(([key, data]) => {
                const avg = Math.round(data.total / data.count);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{getMonthName(key)}</span>
                      <span className={avg > 180 ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                        {avg} mg/dL {data.high > 0 && `(⚠️ ${data.high}x tinggi)`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${avg > 180 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(100, (avg / 300) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Insight Gejala */}
      {topSymptom && topSymptom[1] > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h2 className="font-semibold text-yellow-800">Insight Gejala</h2>
          </div>
          <p className="text-sm text-yellow-800">
            Gejala yang paling sering muncul: <strong>{getSymptomName(topSymptom[0])}</strong> ({topSymptom[1]} hari).
            {topSymptom[0] === 'fatigue' && ' Pastikan ibu cukup istirahat.'}
            {topSymptom[0] === 'thirsty' && ' Perhatikan asupan cairan dan kontrol gula darah.'}
            {topSymptom[0] === 'urination' && ' Ini bisa menjadi tanda gula darah tinggi.'}
            {topSymptom[0] === 'blurred_vision' && ' Segera konsultasikan ke dokter.'}
          </p>
        </div>
      )}

      {/* Rekomendasi */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-blue-800">Rekomendasi</h2>
        </div>
        <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
          {highPercent > 30 && (
            <li>⚠️ Gula darah tinggi cukup sering terjadi ({highPercent}%). Konsultasikan ke dokter.</li>
          )}
          {avgSugar > 180 && (
            <li>⚠️ Rata-rata gula darah di atas normal. Perlu kontrol lebih ketat.</li>
          )}
          {normalPercent > 70 && normalPercent < 100 && (
            <li>✅ Gula darah cukup terkontrol dengan baik. Pertahankan!</li>
          )}
          {normalPercent === 100 && (
            <li>✅ Selamat! Semua catatan gula darah dalam batas normal.</li>
          )}
          <li>📋 Bawa laporan ini saat kontrol ke dokter.</li>
        </ul>
      </div>

      {/* Link ke Riwayat */}
      <div className="mt-6 text-center">
        <Link href="/history" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1">
          Lihat Riwayat Lengkap →
        </Link>
      </div>
    </div>
  );
}