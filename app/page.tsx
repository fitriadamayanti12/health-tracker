import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function Home() {
  const { data: records, error } = await supabase
    .from('health_records')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(10);

  // Jika error, tampilkan pesan tanpa console.error
  if (error) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Mom's Keeper</h1>
        <p className="text-gray-600 mb-8">Mencatat kesehatan ibu, merawat dengan hati</p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">Gagal memuat data</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Health Tracker for Mom</h1>
      <p className="text-gray-600 mb-8">Mencatat kesehatan ibu, merawat dengan hati</p>

      <div className="flex gap-4 mb-6">
        <Link
          href="/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Tambah Catatan Baru
        </Link>
        <Link
          href="/history"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Lihat Riwayat Lengkap
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Riwayat Terbaru</h2>
        {records?.length === 0 && (
          <p className="text-gray-500">Belum ada catatan kesehatan. Yuk tambahkan!</p>
        )}
        {records?.map((record) => (
          <div key={record.id} className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              {new Date(record.recorded_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="mt-2">
              <span className="font-medium">Gula Darah:</span> {record.blood_sugar} mg/dL
            </p>
            {record.systolic && record.diastolic && (
              <p>
                <span className="font-medium">Tekanan Darah:</span> {record.systolic}/{record.diastolic}
              </p>
            )}
            {record.notes && (
              <p className="text-gray-600 text-sm mt-2">{record.notes}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}