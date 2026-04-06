import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function HistoryPage() {
    const { data: records } = await supabase
        .from('health_records')
        .select('*')
        .order('recorded_at', { ascending: false });

    return (
        <main className="max-w-2xl mx-auto px-4 py-16">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="text-blue-600 hover:underline">
                    ← Kembali
                </Link>
                <h1 className="text-2xl font-bold">Riwayat Lengkap</h1>
            </div>

            <div className="space-y-3">
                {records?.map((record) => (
                    <div key={record.id} className="border-b pb-3">
                        <p className="text-sm text-gray-500">
                            {new Date(record.recorded_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                        <p>Gula Darah: {record.blood_sugar} mg/dL</p>
                        {record.systolic && record.diastolic && (
                            <p>Tensi: {record.systolic}/{record.diastolic}</p>
                        )}
                        {record.notes && (
                            <p className="text-gray-500 text-sm">{record.notes}</p>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}