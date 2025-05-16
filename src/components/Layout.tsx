import React from 'react';
import { Download, Film, Settings } from 'lucide-react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { LoadingScreen } from './LoadingScreen';

interface LayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, isLoading = false }) => {
  const navigation = [
    { name: 'Downloads', href: '#', icon: Download, current: true },
    { name: 'Media', href: '#', icon: Film, current: false },
    { name: 'Settings', href: '#', icon: Settings, current: false },
  ];
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar navigation={navigation} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};