import React, { useEffect, useState } from 'react';
import { Server, HardDrive, Cpu } from 'lucide-react';

interface ServerInfo {
  ip: string;
  status: string;
  diskSpace: {
    total: string;
    used: string;
    free: string;
    percentUsed: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    total: string;
    used: string;
    free: string;
    percentUsed: number;
  };
  uptime: string;
}

export const ServerStatus: React.FC = () => {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${API_BASE_URL}/api/status`, {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch server status');
        }
        
        const data = await response.json();
        if (data.status === 'success') {
          setServerInfo({
            ip: data.data.ip,
            status: 'online',
            diskSpace: {
              total: data.data.diskSpace.total,
              used: data.data.diskSpace.used,
              free: data.data.diskSpace.free,
              percentUsed: parseInt(data.data.diskSpace.percentUsed)
            },
            cpu: {
              usage: data.data.cpu.usage || 0,
              cores: data.data.cpu.cores
            },
            memory: {
              total: data.data.memory.total,
              used: data.data.memory.used,
              free: data.data.memory.free,
              percentUsed: parseInt(data.data.memory.percentUsed) || 0
            },
            uptime: data.data.uptime
          });
          setError(null);
        }
      } catch (err) {
        setError('Failed to connect to server');
        console.error('Error fetching server status:', err);
      }
    };

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Server size={20} className="text-red-500" />
            <h2 className="ml-2 text-xl font-bold text-white">Server Status</h2>
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
            <span className="text-sm text-red-400">Offline</span>
          </div>
        </div>
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  if (!serverInfo) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

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
                {serverInfo.cpu.usage}% ({serverInfo.cpu.cores} cores)
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