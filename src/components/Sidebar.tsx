import React from 'react';
import { Download } from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.FC<{ size?: number, className?: string }>;
  current: boolean;
}

interface SidebarProps {
  navigation: NavigationItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ navigation }) => {
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-gray-800 lg:border-r lg:border-gray-700">
      <div className="flex items-center justify-center h-16 px-6 bg-gray-900">
        <div className="flex items-center">
          <Download size={24} className="text-blue-500" />
          <span className="ml-2 text-xl font-bold text-white">AllDownloader</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
              `}
            >
              <item.icon
                size={20}
                className={`
                  mr-3 flex-shrink-0
                  ${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-300'}
                `}
              />
              {item.name}
            </a>
          ))}
        </nav>
      </div>
      <div className="flex flex-col p-4 border-t border-gray-700">
        <div className="py-4">
          <div className="text-sm font-medium text-gray-400">Server Status</div>
          <div className="mt-1 flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm text-white">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};