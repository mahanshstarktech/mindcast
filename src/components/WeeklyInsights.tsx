'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { useWellnessStore } from '@/store/useWellnessStore';
import { TRIGGER_LABELS, type TriggerTag } from '@/types';
import { getWeatherEmoji } from '@/lib/weatherLogic';


interface DotProps {
  cx?: number;
  cy?: number;
  payload?: { mood: number; weatherEmoji: string };
}

function CustomWeatherDot({ cx, cy, payload }: DotProps) {
  if (!cx || !cy || !payload) return null;
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={16}
      aria-hidden="true"
    >
      {payload.weatherEmoji || getWeatherEmoji('rainy')}
    </text>
  );
}

interface TooltipPayload {
  date: string;
  mood: number;
  weatherEmoji: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: TooltipPayload }>;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  const labels = ['Hurricane', 'Storm Warning', 'Light Rain', 'Partly Cloudy', 'Clear Skies'];
  return (
    <div className="glass-card px-4 py-3 text-sm">
      <p className="font-medium text-[#F1F5F9]">{data.date}</p>
      <p className="text-[#94A3B8]">
        {data.weatherEmoji} {labels[(data.mood || 3) - 1]} ({data.mood}/5)
      </p>
    </div>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

export default function WeeklyInsights() {
  const prefersReduced = useReducedMotion();
  const entries = useWellnessStore((s) => s.entries);
  const getWeeklyStats = useWellnessStore((s) => s.getWeeklyStats);
  const getWeeklyEntries = useWellnessStore((s) => s.getWeeklyEntries);

  const weeklyEntries = getWeeklyEntries();
  const stats = useMemo(() => getWeeklyStats(), [entries]); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerChartData = useMemo(() => {
    return stats.topTriggers.map((t) => ({
      name: TRIGGER_LABELS[t.tag as TriggerTag]?.label ?? t.tag,
      count: t.count,
    }));
  }, [stats.topTriggers]);

  const bestDay = useMemo(() => {
    if (weeklyEntries.length === 0) return '';
    const best = weeklyEntries.reduce((max, e) =>
      e.mood > max.mood ? e : max
    );
    const date = new Date(best.date + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { weekday: 'long' });
  }, [weeklyEntries]);

  if (weeklyEntries.length === 0) {
    return (
      <div className="glass-card p-8 md:p-12 text-center max-w-4xl mx-auto">
        <span
          className="text-5xl block mb-4"
          role="img"
          aria-label="chart"
        >
          📊
        </span>
        <h2 className="text-xl font-semibold text-[#F1F5F9] mb-2">
          Your 7-Day Climate Report
        </h2>
        <p className="text-[#64748B]">
          Start logging your mood daily to see your weekly insights!
        </p>
      </div>
    );
  }

  const trendEmoji = stats.avgMood >= 3.5 ? '↑' : stats.avgMood >= 2.5 ? '→' : '↓';
  const avgWeatherEmoji = getWeatherEmoji(
    stats.avgMood >= 4.5
      ? 'sunny'
      : stats.avgMood >= 3.5
        ? 'partly-cloudy'
        : stats.avgMood >= 2.5
          ? 'rainy'
          : stats.avgMood >= 1.5
            ? 'stormy'
            : 'hurricane'
  );



  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        <span role="img" aria-label="chart">📊</span> Your 7-Day Climate Report
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          className="glass-card p-5 text-center"
          variants={prefersReduced ? undefined : itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-3xl font-bold text-[#F1F5F9] mb-1">
            {avgWeatherEmoji} {stats.avgMood}
            <span className="text-lg ml-1">{trendEmoji}</span>
          </p>
          <p className="text-sm text-[#64748B]">Average Mood</p>
        </motion.div>

        <motion.div
          className="glass-card p-5 text-center"
          variants={prefersReduced ? undefined : itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-3xl font-bold text-[#F97316] mb-1">
            ⛈ {stats.peakStressDay}
          </p>
          <p className="text-sm text-[#64748B]">Peak Stress Day</p>
        </motion.div>

        <motion.div
          className="glass-card p-5 text-center"
          variants={prefersReduced ? undefined : itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-3xl font-bold text-[#22C55E] mb-1">
            🔥 {stats.recoveryStreak}
          </p>
          <p className="text-sm text-[#64748B]">Recovery Streak (days)</p>
        </motion.div>
      </div>

      {/* Mood Area Chart */}
      {stats.moodTrend.length > 0 && (
        <div className="glass-card p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-[#F1F5F9]">
            Mood Trend
          </h3>
          <div
            aria-label="Mood trend chart for the past 7 days"
            role="img"
          >
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={stats.moodTrend}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#7C3AED"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="#7C3AED"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="#7C3AED"
                  fill="url(#moodGrad)"
                  strokeWidth={2}
                  dot={<CustomWeatherDot />}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.07)' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.07)' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Screen reader text summary */}
          <p className="sr-only">
            Your average mood was {stats.avgMood} out of 5. Your best day
            was {bestDay}.
          </p>
          <p className="text-sm text-[#64748B] mt-2 text-center">
            Your average mood was{' '}
            <span className="font-semibold text-[#F1F5F9]">
              {stats.avgMood}/5
            </span>
            . Your best day was{' '}
            <span className="font-semibold text-[#F1F5F9]">{bestDay}</span>.
          </p>
        </div>
      )}

      {/* Top Triggers Bar Chart */}
      {weeklyEntries.length >= 2 && triggerChartData.length > 0 ? (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#F1F5F9]">
            Top Triggers This Week
          </h3>
          <div
            aria-label="Top stress triggers bar chart"
            role="img"
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={triggerChartData}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <XAxis
                  type="number"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.07)' }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0E0E1A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {triggerChartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        i === 0
                          ? '#7C3AED'
                          : i === 1
                            ? '#8B5CF6'
                            : '#06B6D4'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="sr-only">
            Top triggers:{' '}
            {triggerChartData
              .map((t) => `${t.name}: ${t.count} times`)
              .join(', ')}
          </p>
        </div>
      ) : (
        <div className="glass-card p-6 text-center">
          <p className="text-[#64748B]">
            Not enough data yet — check in daily!
          </p>
        </div>
      )}
    </div>
  );
}
