import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import BackButton from '../components/BackButton';

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

    return (
        <main className="max-w-4xl mx-auto px-4 py-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <h1 className="text-2xl font-bold">Statistik & Insight</h1>
                </div>
            </div>

            {totalRecords === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Belum ada data kesehatan. Yuk tambahkan catatan!</p>
                    <Link href="/add" className="inline-block mt-4 text-blue-600 hover:underline">
                        + Tambah Catatan Baru
                    </Link>
                </div>
            ) : (
                <>
                    {/* Ringkasan - Grid 2 kolom di mobile, 4 kolom di desktop */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center">
                            <p className="text-2xl md:text-3xl font-bold">{totalRecords}</p>
                            <p className="text-xs md:text-sm opacity-90">Total Catatan</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 text-center">
                            <p className="text-2xl md:text-3xl font-bold">{avgSugar}</p>
                            <p className="text-xs md:text-sm opacity-90">Rata-rata</p>
                        </div>
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-4 text-center">
                            <p className="text-2xl md:text-3xl font-bold">{maxSugar}</p>
                            <p className="text-xs md:text-sm opacity-90">Tertinggi</p>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-4 text-center">
                            <p className="text-2xl md:text-3xl font-bold">{minSugar}</p>
                            <p className="text-xs md:text-sm opacity-90">Terendah</p>
                        </div>
                    </div>

                    {/* Distribusi Gula Darah */}
                    <div className="bg-white rounded-xl border p-5 mb-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">📈 Distribusi Gula Darah</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>✅ Normal (70-180 mg/dL)</span>
                                    <span className="font-medium">{normalPercent}% ({normalCount})</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${normalPercent}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>⚠️ Tinggi (&gt;180 mg/dL)</span>
                                    <span className="font-medium">{highPercent}% ({highCount})</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${highPercent}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>⚠️ Rendah (&lt;70 mg/dL)</span>
                                    <span className="font-medium">{lowPercent}% ({lowCount})</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${lowPercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rata-rata per Bulan */}
                    {Object.keys(monthlyData).length > 0 && (
                        <div className="bg-white rounded-xl border p-5 mb-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">📅 Rata-rata per Bulan</h2>
                            <div className="space-y-3">
                                {Object.entries(monthlyData)
                                    .sort((a, b) => b[0].localeCompare(a[0]))
                                    .map(([key, data]) => {
                                        const avg = Math.round(data.total / data.count);
                                        const date = new Date(parseInt(key.split('-')[0]), parseInt(key.split('-')[1]) - 1);
                                        const monthName = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                                        return (
                                            <div key={key}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>{monthName}</span>
                                                    <span className={avg > 180 ? 'text-red-600 font-semibold' : ''}>
                                                        {avg} mg/dL {data.high > 0 && `(⚠️ ${data.high}x tinggi)`}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${avg > 180 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${Math.min(100, (avg / 300) * 100)}%` }}
                                                    ></div>
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
                            <h2 className="font-semibold text-yellow-800 mb-2">💡 Insight Gejala</h2>
                            <p className="text-sm text-yellow-800">
                                Gejala yang paling sering muncul: <strong>{topSymptom[0] === 'fatigue' ? 'Mudah lelah' :
                                    topSymptom[0] === 'thirsty' ? 'Sering haus' :
                                        topSymptom[0] === 'urination' ? 'Sering kencing' :
                                            topSymptom[0] === 'blurred_vision' ? 'Pandangan kabur' :
                                                topSymptom[0] === 'dizziness' ? 'Pusing' :
                                                    topSymptom[0] === 'nausea' ? 'Mual' : 'Sakit kepala'}</strong> ({topSymptom[1]} hari).
                                {topSymptom[0] === 'fatigue' && ' Pastikan ibu cukup istirahat.'}
                                {topSymptom[0] === 'thirsty' && ' Perhatikan asupan cairan dan kontrol gula darah.'}
                                {topSymptom[0] === 'urination' && ' Ini bisa menjadi tanda gula darah tinggi.'}
                                {topSymptom[0] === 'blurred_vision' && ' Segera konsultasikan ke dokter.'}
                            </p>
                        </div>
                    )}

                    {/* Rekomendasi */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <h2 className="font-semibold text-blue-800 mb-2">📌 Rekomendasi</h2>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
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
                </>
            )}

            <div className="mt-6 text-center">
                <Link href="/history" className="text-blue-600 hover:underline">
                    Lihat Riwayat Lengkap →
                </Link>
            </div>
        </main>
    );
}