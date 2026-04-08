'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  date: string;
  blood_sugar: number;
}

interface BloodSugarChartProps {
  data: ChartData[];
}

export default function BloodSugarChart({ data }: BloodSugarChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
        Belum ada data untuk ditampilkan
      </div>
    );
  }

  const getLineColor = () => {
    const lastValue = data[data.length - 1]?.blood_sugar;
    if (!lastValue) return '#2563eb';
    if (lastValue > 180) return '#dc2626';
    if (lastValue < 70) return '#eab308';
    return '#2563eb';
  };

  return (
    <div className="bg-white rounded-lg p-4 border shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-lg font-semibold">Tren Gula Darah 7 Hari Terakhir</h3>
        <div className="flex flex-wrap gap-3 mt-2 sm:mt-0 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Normal (70-140)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>Tinggi {`(>180)`}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Rendah {`(<70)`}</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[50, 300]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="blood_sugar"
            stroke={getLineColor()}
            strokeWidth={2}
            dot={{ fill: getLineColor(), r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400 mt-3 text-center">
        *Nilai normal: 70-140 mg/dL (puasa) | 70-180 mg/dL (setelah makan)
      </p>
    </div>
  );
}