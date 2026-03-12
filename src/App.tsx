/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Bell, 
  Settings, 
  User, 
  Video, 
  BarChart3, 
  Map as MapIcon, 
  History, 
  PlusCircle,
  MoreVertical,
  Maximize2,
  Timer,
  UserSearch,
  Car,
  ChevronRight,
  Download,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface CameraNode {
  id: string;
  name: string;
  status: 'online' | 'alert' | 'failure';
  lat: number;
  lng: number;
  top: string;
  left: string;
}

interface Activity {
  id: string;
  type: 'motion' | 'plate';
  title: string;
  description: string;
  time: string;
}

// --- Mock Data ---

const CAMERA_NODES: CameraNode[] = [
  { id: 'CAM-084', name: 'Metropolitan North', status: 'online', lat: 40.7128, lng: -74.0060, top: '40%', left: '45%' },
  { id: 'CAM-112', name: 'Downtown Hub', status: 'online', lat: 40.7306, lng: -73.9352, top: '25%', left: '60%' },
  { id: 'CAM-056', name: 'Industrial Zone', status: 'alert', lat: 40.7589, lng: -73.9851, top: '30%', left: '30%' },
  { id: 'CAM-099', name: 'Residential Sector', status: 'online', lat: 40.7829, lng: -73.9654, top: '15%', left: '20%' },
];

const RECENT_ACTIVITIES: Activity[] = [
  { id: '1', type: 'motion', title: 'Motion Detected', description: 'Restricted zone B-4 • 2 mins ago', time: '2 mins ago' },
  { id: '2', type: 'plate', title: 'Plate Recognized', description: 'Vehicle #JXA-9921 • 15 mins ago', time: '15 mins ago' },
];

// --- Components ---

const Header = () => (
  <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] px-6 py-3 z-20">
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-3 text-blue-600">
        <Shield className="w-8 h-8" />
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">CCTV Guardian</h2>
      </div>
      <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-200 dark:border-slate-700">
        <Search className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        <input 
          className="bg-transparent border-none focus:outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 w-64 ml-2" 
          placeholder="Search camera ID, area, or IP..." 
          type="text"
        />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex gap-2">
        <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
      <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">Ops Command</span>
          <span className="text-[10px] text-blue-600">Admin Access</span>
        </div>
        <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-600/30 overflow-hidden">
          <User className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  </header>
);

const Sidebar = () => (
  <nav className="w-16 md:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] flex flex-col justify-between p-4 z-20">
    <div className="flex flex-col gap-2">
      <div className="mb-4">
        <span className="hidden md:block text-[10px] uppercase font-bold text-slate-500 tracking-widest px-3">Main Console</span>
      </div>
      <NavItem icon={<Video className="w-5 h-5" />} label="Live Grid" />
      <NavItem icon={<BarChart3 className="w-5 h-5" />} label="Analytics" />
      <NavItem icon={<MapIcon className="w-5 h-5" />} label="Interactive Map" active />
      <NavItem icon={<History className="w-5 h-5" />} label="Archive" />
      
      <div className="my-4 border-t border-slate-200 dark:border-slate-800"></div>
      
      <div className="mb-4">
        <span className="hidden md:block text-[10px] uppercase font-bold text-slate-500 tracking-widest px-3">Network Status</span>
      </div>
      <div className="px-3 hidden md:flex flex-col gap-4">
        <StatusIndicator label="Node Latency" value="12ms" color="emerald" progress={85} />
        <StatusIndicator label="Storage Capacity" value="74%" color="blue" progress={74} />
      </div>
    </div>
    <button className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
      <PlusCircle className="w-5 h-5" />
      <span className="hidden md:block font-bold text-sm">Register Device</span>
    </button>
  </nav>
);

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <a 
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      active 
        ? 'bg-blue-600/10 text-blue-600 border border-blue-600/20' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`} 
    href="#"
  >
    {icon}
    <span className="hidden md:block text-sm font-medium">{label}</span>
  </a>
);

const StatusIndicator = ({ label, value, color, progress }: { label: string, value: string, color: string, progress: number }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-[11px] font-medium">
      <span className="text-slate-500">{label}</span>
      <span className={`text-${color}-500`}>{value}</span>
    </div>
    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
      <div className={`bg-${color}-500 h-full`} style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

const CameraDetailPanel = () => (
  <aside className="absolute top-6 right-6 bottom-6 w-96 bg-white dark:bg-[#101622] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-30 flex flex-col overflow-hidden">
    <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
      <div>
        <h3 className="font-bold text-lg dark:text-white">Camera Details</h3>
        <p className="text-xs text-slate-500 font-medium">Internal ID: CAM-084-NORTH</p>
      </div>
      <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
    
    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
      {/* Live Preview Card */}
      <div className="relative rounded-xl overflow-hidden aspect-video bg-black group mb-6">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtqlPPphFZPY0Z39-KR6rfBCVNVZTLpvn-YgDpB1SWF8STYMUiyVvD1KSoR3ORc6qNfPmiyt0lsRHvBOzp7VRK7DVQ4iK1g5feox6Bocl2_CVt4_Z0JD1DxxfQgsJWf1g2JbKreTywbe_SReblY_L7wKVj3AKjK7ZnqcpKoLLP5xRac6sAO_J_Cy_K2dpVDPrlPpvoUKq9KaUc3H7Skk__lb2mNKg4suHOFho32r8WHVaV7-l9vEOV5pdn9NUo53Guzmz7Mf1G7E8" 
          alt="Camera Feed"
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase border border-white/20">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
          Live Stream
        </div>
        <div className="absolute top-3 right-3 text-white/80 text-[10px] font-medium">
          4K UHD • 60 FPS
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <button className="bg-blue-600 text-white p-3 rounded-full shadow-xl">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 text-white/90 text-[10px] leading-tight font-mono">
          LAT: 40.7128° N<br/>
          LNG: 74.0060° W<br/>
          AZM: 142.5°
        </div>
      </div>

      {/* Status Specs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-sm font-bold dark:text-white">Operational</span>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Uptime</span>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold dark:text-white">14d 02h</span>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent Activity</h4>
          <span className="text-[10px] font-medium text-blue-600 cursor-pointer hover:underline">Full Analytics</span>
        </div>
        <div className="space-y-3">
          {RECENT_ACTIVITIES.map(activity => (
            <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group cursor-pointer">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.type === 'motion' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-600/10 text-blue-600'}`}>
                {activity.type === 'motion' ? <UserSearch className="w-5 h-5" /> : <Car className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold dark:text-white">{activity.title}</p>
                <p className="text-[10px] text-slate-500">{activity.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Load Chart */}
      <div className="p-4 bg-blue-600/5 rounded-xl border border-blue-600/20">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">Geographic Load</h4>
        <div className="flex items-end gap-1 h-20 mb-2">
          {[40, 60, 85, 55, 70, 30, 90, 45].map((height, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="bg-blue-600/60 w-full rounded-t-sm"
            />
          ))}
        </div>
        <p className="text-[10px] text-slate-500 text-center font-medium">Data transmission density (Sector A-North)</p>
      </div>
    </div>

    <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex gap-3">
      <button className="flex-1 bg-blue-600 text-white font-bold text-sm py-2.5 rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
        <Video className="w-4 h-4" />
        Full Preview
      </button>
      <button className="w-12 h-10 border border-slate-200 dark:border-slate-800 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500">
        <Download className="w-5 h-5" />
      </button>
    </div>
  </aside>
);

const MapView = () => (
  <main className="flex-1 relative bg-slate-200 dark:bg-slate-900 overflow-hidden">
    {/* Map Background Layer */}
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center grayscale dark:invert-[0.9] opacity-40 mix-blend-multiply dark:mix-blend-overlay"
      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuneEKTH6X31xC5iUXlOWzWh400nVNJkXx4HMBFKKbraVXfUYSG3mxaXDh6L_D-o3gg9A1TRMXIHhExthl2yyf279CpqpQcFNgt61rl2YJP3f-PQ2BRZ1MBs4Uu7RHC0rewk-J2JVuK9by_ucPAv8gwzi6x-7hfO22GXFEymB1qLnEinM8skNeFwKahFAQbGY2BKiCsO4tdhTvQPA5j8a6OgTFVzazgkJoKMMkGrCEibN_cKErvf6LObDSrSjCiJh2Pq-Qwl3HxDk')" }}
    ></div>
    
    {/* Data Hotspots / Heatmap Overlay */}
    <div className="absolute inset-0 z-1 pointer-events-none">
      <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-blue-600/20 blur-[80px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-[100px]"></div>
      <div className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full bg-red-500/10 blur-[60px]"></div>
    </div>

    {/* Interactive UI Layers */}
    <div className="absolute inset-0 flex flex-col z-10 pointer-events-none p-6">
      {/* Map Top Controls */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex flex-col gap-2">
          <div className="bg-white dark:bg-[#101622] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur-md bg-opacity-80">
            <h1 className="text-xl font-bold flex items-center gap-2 dark:text-white">
              Metropolitan Area Network
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Viewing 142 active nodes across 4 sectors</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20 uppercase tracking-wider backdrop-blur-sm">89 Online</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20 uppercase tracking-wider backdrop-blur-sm">12 Alert</span>
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20 uppercase tracking-wider backdrop-blur-sm">3 Failure</span>
          </div>
        </div>
        
        {/* Map Controls */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col bg-white dark:bg-[#101622] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xl">
            <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-slate-500">
              <PlusCircle className="w-5 h-5" />
            </button>
            <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              <div className="w-5 h-0.5 bg-slate-500 rounded-full"></div>
            </button>
          </div>
          <button className="bg-white dark:bg-[#101622] border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-xl text-slate-500">
            <MapPin className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Camera Pins */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {CAMERA_NODES.map(node => (
          <motion.div 
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
            className="absolute pointer-events-auto group"
            style={{ top: node.top, left: node.left }}
          >
            <div className="relative cursor-pointer">
              <div className={`absolute -inset-4 ${node.status === 'alert' ? 'bg-amber-500/20' : 'bg-blue-600/20'} rounded-full blur-xl group-hover:opacity-100 opacity-60 transition-all duration-500`}></div>
              <div className={`relative ${node.status === 'alert' ? 'bg-amber-500' : 'bg-blue-600'} border-2 border-white dark:border-slate-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Video className="w-5 h-5 text-white" />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-[#101622] px-2 py-1 rounded-md shadow-lg border border-slate-200 dark:border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold dark:text-white">NODE:{node.id}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Bar (Map Stats) */}
      <div className="mt-auto pointer-events-auto flex justify-center">
        <div className="bg-white/80 dark:bg-[#101622]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-6 py-2 rounded-full shadow-2xl flex gap-8 items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">AI Detection: ON</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-8">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Alerts: 04</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-8">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Traffic Load: Normal</span>
          </div>
        </div>
      </div>
    </div>
    
    <CameraDetailPanel />
  </main>
);

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-slate-50 dark:bg-[#101622]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MapView />
      </div>
    </div>
  );
}
