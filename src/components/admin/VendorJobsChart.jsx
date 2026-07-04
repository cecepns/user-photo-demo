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

const truncateLabel = (label, max = 22) => {
  const text = String(label || '');
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800 mb-1.5 max-w-[220px]">{item.vendor_name}</p>
      <p className="text-gray-600 text-xs mb-1">
        <span className="font-medium text-gray-700">Total Tugas/Job:</span> {item.job_count}
      </p>
    </div>
  );
};

const VendorJobsChart = ({ data = [] }) => {
  const chartData = useMemo(
    () =>
      data.map((item) => {
        const count = Number(item.job_count) || 0;
        return {
          ...item,
          vendor_name: item.vendor_name || 'Tanpa nama vendor',
          job_count: count,
          short_name: truncateLabel(item.vendor_name),
        };
      }),
    [data],
  );

  const chartHeight = Math.max(280, chartData.length * 52 + 40);

  const yAxisWidth = useMemo(() => {
    const longest = chartData.reduce(
      (max, d) => Math.max(max, String(d.short_name || '').length),
      4,
    );
    return Math.min(160, Math.max(44, longest * 7 + 12));
  }, [chartData]);

  const maxVal = useMemo(() => {
    const highest = chartData.reduce((max, d) => Math.max(max, d.job_count), 0);
    return Math.max(5, highest + 1);
  }, [chartData]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={chartHeight} className="-ml-1">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 0, bottom: 4 }}
          barCategoryGap="20%"
        >
          <defs>
            <linearGradient id="vendorJobsGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
          <XAxis
            type="number"
            domain={[0, maxVal]}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            tickFormatter={(val) => Math.round(val)}
          />
          <YAxis
            type="category"
            dataKey="short_name"
            width={yAxisWidth}
            tick={{ fill: '#374151', fontSize: 12 }}
            tickMargin={4}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(79, 70, 229, 0.06)' }}
            content={(props) => <ChartTooltip {...props} />}
          />
          <Bar
            dataKey="job_count"
            fill="url(#vendorJobsGradient)"
            radius={[0, 6, 6, 0]}
            maxBarSize={28}
            animationDuration={600}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VendorJobsChart;
