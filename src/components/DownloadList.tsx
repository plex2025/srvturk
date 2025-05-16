import React, { useState } from 'react';
import { Play, Pause, X, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface Download {
  id: string;
  fileName: string;
  url: string;
  progress: number;
  status: 'downloading' | 'completed' | 'error' | 'paused';
  size: string;
  timeRemaining?: string;
}

export const DownloadList: React.FC = () => {
  // Mock data for demonstration
  const [downloads, setDownloads] = useState<Download[]>([
    {
      id: '1',
      fileName: 'BigBuckBunny.mp4',
      url: 'https://example.com/bigbuckbunny.mp4',
      progress: 75,
      status: 'downloading',
      size: '276 MB',
      timeRemaining: '2 min remaining'
    },
    {
      id: '2',
      fileName: 'Sintel.mkv',
      url: 'https://example.com/sintel.mkv',
      progress: 100,
      status: 'completed',
      size: '384 MB'
    },
    {
      id: '3',
      fileName: 'ElephantsDream.mp4',
      url: 'https://example.com/elephantsdream.mp4',
      progress: 20,
      status: 'paused',
      size: '172 MB'
    },
    {
      id: '4',
      fileName: 'Caminandes.mp4',
      url: 'https://example.com/caminandes.mp4',
      progress: 0,
      status: 'error',
      size: '89 MB'
    }
  ]);

  const getStatusColor = (status: Download['status']) => {
    switch (status) {
      case 'downloading': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Download['status']) => {
    switch (status) {
      case 'downloading': return <Play size={16} className="text-blue-500" />;
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'error': return <AlertCircle size={16} className="text-red-500" />;
      case 'paused': return <Pause size={16} className="text-yellow-500" />;
      default: return null;
    }
  };

  const handleRemoveDownload = (id: string) => {
    setDownloads(downloads.filter(download => download.id !== id));
  };

  const handleTogglePause = (id: string) => {
    setDownloads(downloads.map(download => {
      if (download.id === id) {
        const newStatus = download.status === 'downloading' ? 'paused' : 
                         download.status === 'paused' ? 'downloading' : download.status;
        return { ...download, status: newStatus };
      }
      return download;
    }));
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Downloads</h2>
          <span className="text-sm text-gray-400">{downloads.length} files</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-700">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Size</th>
                <th className="pb-2 font-medium">Progress</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {downloads.map((download) => (
                <tr key={download.id} className="hover:bg-gray-750">
                  <td className="py-3 pr-4">
                    <div className="flex items-start">
                      {getStatusIcon(download.status)}
                      <div className="ml-2">
                        <div className="font-medium text-white truncate max-w-xs">
                          {download.fileName}
                        </div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">
                          {download.url}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-300">
                    {download.size}
                  </td>
                  <td className="py-3 pr-4 text-sm">
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStatusColor(download.status)}`}
                        style={{ width: `${download.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      {download.status === 'downloading' && (
                        <span>{download.progress}% - {download.timeRemaining}</span>
                      )}
                      {download.status === 'completed' && (
                        <span className="text-green-400">Completed</span>
                      )}
                      {download.status === 'error' && (
                        <span className="text-red-400">Download failed</span>
                      )}
                      {download.status === 'paused' && (
                        <span className="text-yellow-400">Paused at {download.progress}%</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${download.status === 'downloading' ? 'bg-blue-900 text-blue-200' : ''}
                      ${download.status === 'completed' ? 'bg-green-900 text-green-200' : ''}
                      ${download.status === 'error' ? 'bg-red-900 text-red-200' : ''}
                      ${download.status === 'paused' ? 'bg-yellow-900 text-yellow-200' : ''}
                    `}>
                      {download.status.charAt(0).toUpperCase() + download.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      {(download.status === 'downloading' || download.status === 'paused') && (
                        <button
                          onClick={() => handleTogglePause(download.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          {download.status === 'downloading' ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                      )}
                      {download.status === 'completed' && (
                        <button className="text-gray-400 hover:text-white">
                          <ExternalLink size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveDownload(download.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {downloads.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-400">No downloads yet</p>
          </div>
        )}
      </div>
    </div>
  );
};