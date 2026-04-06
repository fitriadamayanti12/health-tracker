'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function AddRecord() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        blood_sugar: '',
        systolic: '',
        diastolic: '',
        notes: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('health_records').insert([
            {
                blood_sugar: parseInt(formData.blood_sugar),
                systolic: parseInt(formData.systolic) || null,
                diastolic: parseInt(formData.diastolic) || null,
                notes: formData.notes || null,
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
            <h1 className="text-3xl font-bold mb-8">Tambah Catatan Kesehatan</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Gula Darah (mg/dL) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        required
                        value={formData.blood_sugar}
                        onChange={(e) => setFormData({ ...formData, blood_sugar: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Contoh: 140"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Tekanan Darah (Atas)
                        </label>
                        <input
                            type="number"
                            value={formData.systolic}
                            onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
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
                            value={formData.diastolic}
                            onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Diastolik"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Catatan</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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