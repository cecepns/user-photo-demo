import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800 mb-1.5 capitalize">{item.name}</p>
      <p className="text-gray-600 text-xs mb-1">
        <span className="font-medium text-gray-700">Jumlah Client:</span> {item.value}
      </p>
    </div>
  );
};

const ReferenceChart = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const prettify = (name) => {
      if (!name) return 'Lainnya';
      const lowercase = name.toLowerCase().trim();
      if (lowercase === 'instagram' || lowercase === 'ig') return 'Instagram';
      if (lowercase === 'tiktok') return 'TikTok';
      if (lowercase === 'facebook' || lowercase === 'fb') return 'Facebook';
      if (lowercase === 'google') return 'Google';
      if (lowercase === 'teman' || lowercase === 'rekomendasi') return 'Rekomendasi Teman';
      return name.charAt(0).toUpperCase() + name.slice(1);
    };

    return data.map((item) => ({
      ...item,
      displayName: prettify(item.name),
      value: Number(item.value) || 0,
    })).sort((a, b) => b.value - a.value);
  }, [data]);

  const maxVal = useMemo(() => {
    const highest = chartData.reduce((max, d) => Math.max(max, d.value), 0);
    return Math.max(5, highest + 1);
  }, [chartData]);

  return (
    <div className="h-60 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="referenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="displayName"
            tick={{ fill: '#4b5563', fontSize: 11 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
          />
          <YAxis
            type="number"
            domain={[0, maxVal]}
            tick={{ fill: '#4b5563', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => Math.round(val)}
          />
          <Tooltip
            cursor={{ fill: 'rgba(236, 72, 153, 0.04)' }}
            content={(props) => <ChartTooltip {...props} />}
          />
          <Bar
            dataKey="value"
            fill="url(#referenceGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReferenceChart;
