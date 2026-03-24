import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Cpu, Activity, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchResultList = [
  { title: 'Dashboard', type: 'Page', path: '/', icon: <Cpu size={16} className="text-electric-blue" /> },
  { title: 'Sensor Telemetry', type: 'Page', path: '/sensors', icon: <Activity size={16} className="text-cyan-400" /> },
  { title: 'Alerts & History', type: 'Page', path: '/alerts', icon: <AlertTriangle size={16} className="text-orange-400" /> },
  { title: 'Extruder EX-M-204', type: 'Machine', path: '/', icon: <Cpu size={16} className="text-slate-400" /> },
  { title: 'Primary Temperature Sensor', type: 'Sensor', path: '/sensors', icon: <Activity size={16} className="text-slate-400" /> }
];

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const filteredResults = SearchResultList.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (path) => {
    navigate(path);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="h-20 border-b border-glass-border bg-navy/40 backdrop-blur-md flex items-center justify-between px-8 relative z-50">
      <div className="relative w-72" ref={searchRef}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="block w-full pl-10 pr-3 py-2 border border-glass-border rounded-lg leading-5 bg-navy-light/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-electric-blue focus:border-electric-blue sm:text-sm transition-all text-sm"
          placeholder="Search machines, tools, pages..."
        />
        
        {/* Search Dropdown */}
        {isOpen && query.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-navy/95 backdrop-blur-xl border border-glass-border rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 transition-all">
            {filteredResults.length > 0 ? (
              <ul className="max-h-60 overflow-y-auto">
                {filteredResults.map((item, index) => (
                  <li 
                    key={index} 
                    onClick={() => handleSelect(item.path)}
                    className="px-4 py-3 border-b border-glass-border/50 hover:bg-glass-bg cursor-pointer flex items-center space-x-3 transition-colors last:border-0"
                  >
                    <div className="p-2 bg-glass-bg rounded-lg border border-glass-border/50">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.type}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-4 text-sm text-slate-400 text-center">
                No results found for "{query}"
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-6 border-l border-glass-border">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white leading-none">Admin User</p>
            <p className="text-xs text-slate-400 mt-1">Lead Engineer</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-glow to-electric-blue p-0.5">
            <div className="w-full h-full bg-navy rounded-full flex items-center justify-center border-2 border-transparent">
              <User size={18} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
