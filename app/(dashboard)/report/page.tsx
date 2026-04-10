import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Activity, TrendingUp, Droplet, Calendar, FileText, Printer, Eye } from 'lucide-react';
import ExportPDF from '@/components/ExportPDF';

export const dynamic = 'force-dynamic';

export default async function ReportPage() {
  // Ambil data gula darah
  const { data: bloodData } = await supabase
    .from('health_records')
    .select('*')
    .order('recorded_at', { ascending: false });

  // Ambil data gejala
  const { data: symptoms } = await supabase
    .from('symptoms')
    .select('*')
    .order('date', { ascending: false })
    .limit(14);

  // Statistik gula darah
  const sugarValues = bloodData?.map(r => r.blood_sugar).filter(Boolean) || [];
  const avgSugar = sugarValues.length > 0
    ? Math.round(sugarValues.reduce((a, b) => a + b, 0) / sugarValues.length)
    : 0;
  const maxSugar = sugarValues.length > 0 ? Math.max(...sugarValues) : 0;
  const minSugar = sugarValues.length > 0 ? Math.min(...sugarValues) : 0;
  const totalRecords = bloodData?.length || 0;

  // Hitung gejala yang sering muncul
  const symptomCount = {
    fatigue: 0, thirsty: 0, urination: 0, blurred_vision: 0,
    dizziness: 0, nausea: 0, headache: 0
  };
  symptoms?.forEach(s => {
    if (s.fatigue) symptomCount.fatigue++;
    if (s.thirsty) symptomCount.thirsty++;
    if (s.urination) symptomCount.urination++;
    if (s.blurred_vision) symptomCount.blurred_vision++;
    if (s.dizziness) symptomCount.dizziness++;
    if (s.nausea) symptomCount.nausea++;
    if (s.headache) symptomCount.headache++;
  });

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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Laporan Kesehatan</h1>
            <p className="text-gray-500 mt-1">Ringkasan data untuk konsultasi dengan dokter</p>
          </div>
          <ExportPDF records={bloodData || []} symptoms={symptoms || []} />
        </div>
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
          <FileText className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-2xl md:text-3xl font-bold">{minSugar}</p>
          <p className="text-xs opacity-90">Terendah</p>
        </div>
      </div>

      {/* Data Gula Darah Terbaru */}
      <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Data Gula Darah Terbaru
        </h2>
        {bloodData?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Belum ada data gula darah</p>
        ) : (
          <div className="space-y-2">
            {bloodData?.slice(0, 5).map((record) => (
              <div key={record.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="text-gray-600">
                  {new Date(record.recorded_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                <span className={`font-semibold ${
                  record.blood_sugar > 180 ? 'text-red-600' :
                  record.blood_sugar < 70 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {record.blood_sugar} mg/dL
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gejala yang Sering Muncul */}
      <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-500" />
          Gejala yang Sering Muncul
        </h2>
        <p className="text-sm text-gray-500 mb-3">2 minggu terakhir</p>
        {Object.values(symptomCount).every(v => v === 0) ? (
          <p className="text-gray-500 text-center py-4">Tidak ada gejala yang dicatat</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(symptomCount).map(([key, count]) => (
              count > 0 && (
                <div key={key} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-700">{getSymptomName(key)}</span>
                  <span className="font-semibold text-blue-600">{count}x</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {/* Cara Menggunakan Laporan */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h2 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Cara Menggunakan Laporan Ini
        </h2>
        <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
          <li>Klik tombol <span className="font-medium">"Export ke PDF"</span> di atas</li>
          <li>Print file PDF yang sudah diunduh</li>
          <li>Atau tunjukkan langsung di HP ke dokter saat kontrol</li>
          <li>Diskusikan hasil dengan dokter untuk penanganan lebih lanjut</li>
        </ol>
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