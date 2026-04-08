import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SymptomsHistoryPage() {
    const { data: symptoms } = await supabase
        .from('symptoms')
        .select('*')
        .order('date', { ascending: false });

    return (
        <main className="max-w-2xl mx-auto px-4 py-16">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="text-blue-600 hover:underline">
                    ← Kembali
                </Link>
                <h1 className="text-2xl font-bold">Riwayat Gejala</h1>
            </div>

            {symptoms?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    Belum ada catatan gejala. Mulai catat hari ini!
                </div>
            )}

            <div className="space-y-4">
                {symptoms?.map((record) => {
                    const symptomList = [];
                    if (record.fatigue) symptomList.push('Lelah');
                    if (record.thirsty) symptomList.push('Sering haus');
                    if (record.urination) symptomList.push('Sering kencing');
                    if (record.blurred_vision) symptomList.push('Pandangan kabur');
                    if (record.dizziness) symptomList.push('Pusing');
                    if (record.nausea) symptomList.push('Mual');
                    if (record.headache) symptomList.push('Sakit kepala');
                    if (record.other_symptoms) symptomList.push(record.other_symptoms);

                    return (
                        <div key={record.id} className="border rounded-lg p-4">
                            <p className="font-semibold">
                                {new Date(record.date).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                            {symptomList.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {symptomList.map((s, idx) => (
                                        <span key={idx} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm mt-2">Tidak ada gejala yang dicatat</p>
                            )}
                            {record.notes && (
                                <p className="text-gray-600 text-sm mt-2">{record.notes}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </main>
    );
}