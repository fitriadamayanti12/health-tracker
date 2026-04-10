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
      <div className="bg-white rounded-xl p-8 text-center text-gray-500 border">
        Belum ada data gula darah untuk ditampilkan
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Tren Gula Darah (7 Hari Terakhir)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[50, 300]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="blood_sugar"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Nilai normal: 70-140 mg/dL (puasa) | 70-180 mg/dL (setelah makan)
      </p>
    </div>
  );
}