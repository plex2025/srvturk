import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useApiKey } from '../contexts/ApiKeyContext';

export const Navbar: React.FC = () => {
  const { apiKey } = useApiKey();
  
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button className="text-gray-400 hover:text-white lg:hidden">
            <Menu size={24} />
          </button>
          <h1 className="ml-4 text-xl font-bold text-white">AllDebrid Downloader</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="text-gray-400 hover:text-white">
              <Bell size={20} />
            </button>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400 mr-2">API Key:</span>
            <span className="text-green-400">{apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 'Not Set'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};