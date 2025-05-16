import React from 'react';
import { Download } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="animate-pulse flex flex-col items-center">
        <Download size={64} className="text-blue-500 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">AllDebrid Downloader</h1>
        <div className="mt-4 w-48 h-2 bg-blue-500 rounded-full relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-blue-300 animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};