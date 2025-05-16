import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { useApiKey } from '../contexts/ApiKeyContext';

export const DownloadForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [isMultiline, setIsMultiline] = useState(false);
  const { apiKey } = useApiKey();

  const handleAddUrl = () => {
    if (url.trim()) {
      if (isMultiline) {
        const newUrls = url.split('\n').filter(u => u.trim()).map(u => u.trim());
        setUrls([...urls, ...newUrls]);
      } else {
        setUrls([...urls, url.trim()]);
      }
      setUrl('');
    }
  };

  const handleRemoveUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would call the backend to process downloads
    console.log('Processing downloads with API key:', apiKey);
    console.log('URLs to download:', urls);
    
    // Clear the list after submission
    setUrls([]);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Add Downloads</h2>
      
      <div className="flex items-center mb-4">
        <button
          onClick={() => setIsMultiline(false)}
          className={`px-4 py-2 rounded-l-md ${
            !isMultiline ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          Single URL
        </button>
        <button
          onClick={() => setIsMultiline(true)}
          className={`px-4 py-2 rounded-r-md ${
            isMultiline ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          Multiple URLs
        </button>
      </div>
      
      <div className="mb-4">
        {isMultiline ? (
          <textarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter multiple URLs (one per line)"
          />
        ) : (
          <div className="flex">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
              className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter URL to download"
            />
            <button
              onClick={handleAddUrl}
              className="px-4 py-2 bg-blue-600 rounded-r-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        )}
      </div>
      
      {isMultiline && (
        <button
          onClick={handleAddUrl}
          className="mb-4 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add URLs
        </button>
      )}
      
      {urls.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">URLs to download:</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {urls.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-700 rounded-md">
                <span className="text-sm text-gray-300 truncate flex-1">{item}</span>
                <button
                  onClick={() => handleRemoveUrl(index)}
                  className="ml-2 text-gray-400 hover:text-red-400"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={urls.length === 0}
        className={`w-full py-2 flex items-center justify-center rounded-md ${
          urls.length === 0
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white transition-colors'
        }`}
      >
        <Download size={20} className="mr-2" />
        Start Downloads
      </button>
    </div>
  );
};