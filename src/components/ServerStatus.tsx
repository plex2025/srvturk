import React from 'react';
import { Server, HardDrive, Cpu } from 'lucide-react';

export const ServerStatus: React.FC = () => {
  // Mock data for demonstration
  const serverInfo = {
    ip: '77.92.145.44',
    status: 'online',
    diskSpace: {
      total: '2 TB',
      used: '850 GB',
      free: '1.15 TB',
      percentUsed: 42
    },
    cpu: {
      usage: 18,
      cores: 8
    },
    memory: {
      total: '32 GB',
      used: '10.4 GB',
      free: '21.6 GB',
      percentUsed: 32
    },
    uptime: '15 days, 7 hours'
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Server size={20} className="text-blue-500" />
          <h2 className="ml-2 text-xl font-bold text-white">Server Status</h2>
        </div>
        <div className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          <span className="text-sm text-green-400">Online</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">Disk Space</h3>
            <HardDrive size={16} className="text-blue-400" />
          </div>
          <div className="mt-1">
            <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full ${serverInfo.diskSpace.percentUsed > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${serverInfo.diskSpace.percentUsed}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">
                {serverInfo.diskSpace.used} used
              </span>
              <span className="text-xs text-gray-400">
                {serverInfo.diskSpace.free} free
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">CPU Usage</h3>
            <Cpu size={16} className="text-blue-400" />
          </div>
          <div className="mt-1">
            <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full ${serverInfo.cpu.usage > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${serverInfo.cpu.usage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">
                {serverInfo.cpu.usage}% (8 cores)
              </span>
              <span className="text-xs text-gray-400">
                Idle: {100 - serverInfo.cpu.usage}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">Memory</h3>
            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 5H21V19H3V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 9H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 13H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M14 9H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M14 13H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="mt-1">
            <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full ${serverInfo.memory.percentUsed > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${serverInfo.memory.percentUsed}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">
                {serverInfo.memory.used} used
              </span>
              <span className="text-xs text-gray-400">
                {serverInfo.memory.free} free
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-gray-700 p-3 rounded-lg">
          <h3 className="text-xs font-medium text-gray-400">Server IP</h3>
          <p className="text-white">{serverInfo.ip}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <h3 className="text-xs font-medium text-gray-400">Uptime</h3>
          <p className="text-white">{serverInfo.uptime}</p>
        </div>
      </div>
    </div>
  );
};