import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, AlertTriangle, History, LogOut, Cpu } from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/sensors', icon: <Activity size={20} />, label: 'Sensor Data' },
    { path: '/alerts', icon: <AlertTriangle size={20} />, label: 'Alerts & History' },
  ];

  return (
    <aside className="w-64 glass-card border-none rounded-none border-r border-glass-border flex flex-col h-full bg-navy-light/50 relative z-20">
      <div className="p-6 flex items-center space-x-3 border-b border-glass-border/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-blue to-purple-glow flex items-center justify-center shadow-[0_0_10px_rgba(0,210,255,0.4)]">
          <Cpu className="text-white" size={18} />
        </div>
        <span className="font-bold text-lg tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Machine AI
        </span>
      </div>

      <nav className="flex-1 py-8 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-electric-blue/10 text-electric-blue shadow-[inset_2px_0_0_rgba(0,210,255,1)] relative'
                  : 'text-slate-400 hover:text-white hover:bg-glass-bg'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-glass-border/50">
        <button 
          onClick={onLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
