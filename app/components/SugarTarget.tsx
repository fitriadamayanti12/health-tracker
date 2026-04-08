'use client';

import { useState, useEffect } from 'react';

interface SugarTargetProps {
    records?: any[];
}

export default function SugarTarget({ records = [] }: SugarTargetProps) {
    const [target, setTarget] = useState({ min: 70, max: 180 });
    const [isEditing, setIsEditing] = useState(false);
    const [tempMin, setTempMin] = useState(70);
    const [tempMax, setTempMax] = useState(180);
    const [warningCount, setWarningCount] = useState(0);

    useEffect(() => {
        const savedMin = localStorage.getItem('sugarTargetMin');
        const savedMax = localStorage.getItem('sugarTargetMax');
        if (savedMin && savedMax) {
            const min = parseInt(savedMin);
            const max = parseInt(savedMax);
            setTarget({ min, max });
            setTempMin(min);
            setTempMax(max);
        }
    }, []);

    useEffect(() => {
        const count = records.filter(r => r.blood_sugar > target.max || r.blood_sugar < target.min).length;
        setWarningCount(count);
    }, [records, target]);

    const saveTarget = () => {
        if (tempMin >= tempMax) {
            alert('Nilai minimal harus kurang dari maksimal');
            return;
        }
        const newTarget = { min: tempMin, max: tempMax };
        setTarget(newTarget);
        localStorage.setItem('sugarTargetMin', tempMin.toString());
        localStorage.setItem('sugarTargetMax', tempMax.toString());
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-xl border p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-700">🎯 Target Gula Darah</h3>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        ✏️ Ubah
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Minimal (mg/dL)</label>
                            <input
                                type="number"
                                value={tempMin}
                                onChange={(e) => setTempMin(parseInt(e.target.value) || 0)}
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Maksimal (mg/dL)</label>
                            <input
                                type="number"
                                value={tempMax}
                                onChange={(e) => setTempMax(parseInt(e.target.value) || 0)}
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={saveTarget}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                            Simpan
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-blue-600">
                                {target.min} - {target.max}
                            </p>
                            <p className="text-xs text-gray-500">mg/dL</p>
                        </div>
                        <div className="text-right text-sm">
                            <p className="text-gray-600">Normal: 70-140 (puasa)</p>
                            <p className="text-gray-600">Normal: &lt;180 (post-meal)</p>
                        </div>
                    </div>
                    {warningCount > 0 && (
                        <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-yellow-600">
                                ⚠️ {warningCount} catatan di luar target ({target.min}-{target.max} mg/dL)
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}