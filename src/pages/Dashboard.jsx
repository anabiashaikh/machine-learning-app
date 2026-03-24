import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Cpu } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import API_URL from '../config';

const Dashboard = () => {
  const [failureProbability, setFailureProbability] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Form state tracking 6 parameters
  const [inputs, setInputs] = useState({
    machine_type: 'M',
    air_temp: 298.1,
    process_temp: 308.6,
    rotational_speed: 1551,
    torque: 42.8,
    tool_wear: 0
  });

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      const data = await response.json();
      if (data.failure_probability_percent !== undefined) {
        const prob = parseFloat(data.failure_probability_percent.toFixed(1));
        setFailureProbability(prob);
        
        if (prob > 50) {
           toast.error(`High Failure Risk Detected: ${prob}%! Immediate repair recommended.`, {
             duration: 6000,
             style: { background: '#1e293b', color: '#f87171', border: '1px solid #ef4444' }
           });
        }
      }
    } catch (error) {
      console.error("Failed to fetch from backend API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial prediction
    fetchPrediction();
  }, []); // Run only once to get initial state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ 
        ...prev, 
        [name]: name === 'machine_type' ? value : Number(value) 
    }));
  };

  const handlePredictClick = (e) => {
    e.preventDefault();
    fetchPrediction();
  };

  const gaugeData = [
    { name: 'Risk', value: failureProbability },
    { name: 'Safe', value: 100 - failureProbability }
  ];
  const COLORS = ['#ef4444', '#00d2ff']; // Red for risk, cyan for safe

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Dashboard Summary
        </h1>
        <div className="text-sm text-slate-400">Live AI Analysis Active</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Machine Health Card */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">System Overview Target</h2>
              <p className="text-sm text-slate-400">Model: predictive_maintenance</p>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-electric-blue/10 border border-electric-blue/20 rounded-full">
              <Cpu size={16} className="text-electric-blue" />
              <span className="text-sm text-electric-blue font-medium">Model Active</span>
            </div>
          </div>
          
          <form onSubmit={handlePredictClick} className="mt-4">
            <h3 className="text-md font-medium text-white mb-4">Interactive Telemetry Input</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Machine Type</label>
                <select 
                  name="machine_type" 
                  value={inputs.machine_type} 
                  onChange={handleInputChange}
                  className="w-full bg-navy/50 border border-glass-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-electric-blue"
                >
                  <option value="L">Low (L)</option>
                  <option value="M">Medium (M)</option>
                  <option value="H">High (H)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Air Temp [K]</label>
                <input type="number" step="0.1" name="air_temp" value={inputs.air_temp} onChange={handleInputChange} className="w-full bg-navy/50 border border-glass-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-electric-blue" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Process Temp [K]</label>
                <input type="number" step="0.1" name="process_temp" value={inputs.process_temp} onChange={handleInputChange} className="w-full bg-navy/50 border border-glass-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-electric-blue" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Rotational Speed [rpm]</label>
                <input type="number" name="rotational_speed" value={inputs.rotational_speed} onChange={handleInputChange} className="w-full bg-navy/50 border border-glass-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-electric-blue" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Torque [Nm]</label>
                <input type="number" step="0.1" name="torque" value={inputs.torque} onChange={handleInputChange} className="w-full bg-navy/50 border border-glass-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-electric-blue" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Tool Wear [min]</label>
                <input type="number" name="tool_wear" value={inputs.tool_wear} onChange={handleInputChange} className="w-full bg-navy/50 border border-glass-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-electric-blue" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-electric-blue to-purple-glow text-white font-medium text-sm px-6 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(0,210,255,0.4)] transition-all"
              >
                {loading ? 'Analyzing...' : 'Run New Prediction'}
              </button>
            </div>
          </form>
        </Card>

        {/* Failure Probability Gauge */}
        <Card className="flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className={`absolute inset-0 bg-red-500/10 transition-opacity duration-500 ${failureProbability > 50 ? 'opacity-100' : 'opacity-0'}`}></div>
          <h2 className="text-lg font-semibold text-white mb-2 w-full text-left relative z-10">Failure Probability</h2>
          <div className="relative w-full h-48 flex items-center justify-center z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="70%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {gaugeData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className={`text-3xl font-bold ${failureProbability > 50 ? 'text-red-400' : 'text-white'}`}>{failureProbability}%</div>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-2 relative z-10">
            {failureProbability > 50 ? 'High risk of failure detected!' : 'Low risk of failure detected.'}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
