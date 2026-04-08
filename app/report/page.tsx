import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import ExportPDF from '../components/ExportPDF';

export const dynamic = 'force-dynamic';

export default async function ReportPage() {
    // Ambil data gula darah - ganti nama variabel
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

    return (
        <main className="max-w-2xl mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-blue-600 hover:underline">
                        ← Kembali
                    </Link>
                    <h1 className="text-2xl font-bold">Laporan untuk Dokter</h1>
                </div>
                <ExportPDF records={bloodData || []} symptoms={symptoms || []} />
            </div>

            {/* Ringkasan Gula Darah */}
            <div className="bg-white rounded-lg border p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">📊 Ringkasan Gula Darah</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-blue-600">{avgSugar}</p>
                        <p className="text-xs text-gray-500">Rata-rata (mg/dL)</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-600">{maxSugar}</p>
                        <p className="text-xs text-gray-500">Tertinggi</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-600">{minSugar}</p>
                        <p className="text-xs text-gray-500">Terendah</p>
                    </div>
                </div>
            </div>

            {/* Gejala yang Sering Muncul */}
            <div className="bg-white rounded-lg border p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">🩺 Gejala yang Sering Muncul (2 minggu terakhir)</h2>
                <div className="space-y-2">
                    {symptomCount.fatigue > 0 && (
                        <div className="flex justify-between items-center">
                            <span>😴 Mudah lelah</span>
                            <span className="font-semibold">{symptomCount.fatigue}x</span>
                        </div>
                    )}
                    {symptomCount.thirsty > 0 && (
                        <div className="flex justify-between items-center">
                            <span>💧 Sering haus</span>
                            <span className="font-semibold">{symptomCount.thirsty}x</span>
                        </div>
                    )}
                    {symptomCount.urination > 0 && (
                        <div className="flex justify-between items-center">
                            <span>🚽 Sering kencing</span>
                            <span className="font-semibold">{symptomCount.urination}x</span>
                        </div>
                    )}
                    {symptomCount.blurred_vision > 0 && (
                        <div className="flex justify-between items-center">
                            <span>👁️ Pandangan kabur</span>
                            <span className="font-semibold">{symptomCount.blurred_vision}x</span>
                        </div>
                    )}
                    {Object.values(symptomCount).every(v => v === 0) && (
                        <p className="text-gray-500">Tidak ada gejala yang dicatat</p>
                    )}
                </div>
            </div>

            {/* Data Terbaru */}
            <div className="bg-white rounded-lg border p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">📋 Data Gula Darah Terbaru</h2>
                <div className="space-y-2">
                    {bloodData?.slice(0, 5).map((record) => (
                        <div key={record.id} className="flex justify-between text-sm border-b pb-2">
                            <span>{new Date(record.recorded_at).toLocaleDateString('id-ID')}</span>
                            <span className="font-medium">{record.blood_sugar} mg/dL</span>
                        </div>
                    ))}
                    {bloodData?.length === 0 && (
                        <p className="text-gray-500">Belum ada data gula darah</p>
                    )}
                </div>
            </div>

            {/* Cara Membawa Laporan ke Dokter */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="font-semibold mb-2">📌 Cara Menggunakan Laporan Ini</h2>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Klik tombol "Export ke PDF" di atas</li>
                    <li>Print file PDF yang sudah diunduh</li>
                    <li>Atau tunjukkan langsung di HP ke dokter saat kontrol</li>
                </ol>
            </div>

            <div className="mt-6 text-center">
                <Link href="/history" className="text-blue-600 hover:underline">
                    Lihat Riwayat Lengkap →
                </Link>
            </div>
        </main>
    );
}