import React, { useState } from 'react';
import Card from '../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock Data
const data = [
  { time: '00:00', temp: 80, pressure: 1010, rpm: 3400 },
  { time: '04:00', temp: 82, pressure: 1015, rpm: 3450 },
  { time: '08:00', temp: 85, pressure: 1020, rpm: 3500 },
  { time: '12:00', temp: 88, pressure: 1025, rpm: 3600 },
  { time: '16:00', temp: 84, pressure: 1018, rpm: 3480 },
  { time: '20:00', temp: 81, pressure: 1012, rpm: 3420 },
  { time: '24:00', temp: 83, pressure: 1014, rpm: 3440 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy/90 backdrop-blur-md border border-glass-border p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 mb-2">{`Time: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SensorData = () => {
  const [timeRange, setTimeRange] = useState('24h');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Sensor Telemetry
        </h1>
        
        <div className="flex bg-navy-light/50 p-1 rounded-lg border border-glass-border">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-electric-blue text-navy shadow-[0_0_10px_rgba(0,210,255,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Last {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="h-[400px] flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">Temperature vs Time (°C)</h2>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  name="Temperature"
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: 'rgba(239,68,68,0.3)', strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="h-[400px] flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">Pressure vs Time (PSI)</h2>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="pressure" 
                  name="Pressure"
                  stroke="#00d2ff" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#00d2ff', strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: 'rgba(0,210,255,0.3)', strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="h-[400px] xl:col-span-2 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">RPM vs Time</h2>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="rpm" 
                  name="RPM"
                  stroke="#9a4edd" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#9a4edd', strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: 'rgba(154,78,221,0.3)', strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SensorData;
