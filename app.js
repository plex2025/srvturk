// Constants
const API_KEY = 'yfQdaYOk4Dd7dbjnUWkX';
const API_BASE_URL = 'http://77.92.145.44:3000/api';

// State
let downloads = [];
let urls = [];
let isMultiline = false;

// DOM Elements
const apiKeyDisplay = document.getElementById('apiKeyDisplay');
const singleUrlBtn = document.getElementById('singleUrlBtn');
const multiUrlBtn = document.getElementById('multiUrlBtn');
const urlInputContainer = document.getElementById('urlInputContainer');
const urlInput = document.getElementById('urlInput');
const addUrlBtn = document.getElementById('addUrlBtn');
const urlList = document.getElementById('urlList');
const startDownloadBtn = document.getElementById('startDownloadBtn');
const downloadList = document.getElementById('downloadList');
const downloadCount = document.getElementById('downloadCount');
const serverStatus = document.getElementById('serverStatus');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    updateServerStatus();
    setInterval(updateServerStatus, 5000); // Update every 5 seconds
});

function initializeApp() {
    // Display masked API key
    apiKeyDisplay.textContent = `${API_KEY.substring(0, 4)}...${API_KEY.substring(API_KEY.length - 4)}`;
    
    // Event listeners
    singleUrlBtn.addEventListener('click', () => toggleUrlMode(false));
    multiUrlBtn.addEventListener('click', () => toggleUrlMode(true));
    addUrlBtn.addEventListener('click', addUrl);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addUrl();
    });
    startDownloadBtn.addEventListener('click', startDownloads);
}

function toggleUrlMode(multi) {
    isMultiline = multi;
    singleUrlBtn.className = `px-4 py-2 rounded-l-md ${!multi ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`;
    multiUrlBtn.className = `px-4 py-2 rounded-r-md ${multi ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`;
    
    urlInput.value = '';
    if (multi) {
        urlInput.setAttribute('rows', '4');
        urlInput.style.height = 'auto';
        urlInput.placeholder = 'Enter multiple URLs (one per line)';
    } else {
        urlInput.removeAttribute('rows');
        urlInput.style.height = '';
        urlInput.placeholder = 'Enter URL to download';
    }
}

function addUrl() {
    const inputUrls = isMultiline ? urlInput.value.split('\n') : [urlInput.value];
    const validUrls = inputUrls
        .map(url => url.trim())
        .filter(url => url && isValidUrl(url));
    
    if (validUrls.length) {
        urls.push(...validUrls);
        updateUrlList();
        urlInput.value = '';
        updateStartButton();
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function updateUrlList() {
    if (urls.length === 0) {
        urlList.classList.add('hidden');
        return;
    }
    
    urlList.classList.remove('hidden');
    urlList.innerHTML = urls.map((url, index) => `
        <div class="flex items-center justify-between py-2 px-3 bg-gray-700 rounded-md mb-2">
            <span class="text-sm text-gray-300 truncate flex-1">${url}</span>
            <button onclick="removeUrl(${index})" class="ml-2 text-gray-400 hover:text-red-400">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
}

function removeUrl(index) {
    urls.splice(index, 1);
    updateUrlList();
    updateStartButton();
}

function updateStartButton() {
    const disabled = urls.length === 0;
    startDownloadBtn.disabled = disabled;
    startDownloadBtn.className = `w-full py-2 flex items-center justify-center rounded-md ${
        disabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white transition-colors'
    }`;
}

async function startDownloads() {
    for (const url of urls) {
        try {
            const response = await fetch(`${API_BASE_URL}/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });
            
            const data = await response.json();
            if (data.status === 'success') {
                addDownload(data);
            } else {
                console.error('Download failed:', data.message);
            }
        } catch (error) {
            console.error('Error starting download:', error);
        }
    }
    
    urls = [];
    updateUrlList();
    updateStartButton();
}

function addDownload(downloadData) {
    const download = {
        id: downloadData.id || Date.now().toString(),
        fileName: downloadData.filename,
        status: 'downloading',
        progress: 0,
        size: 'Calculating...',
        timeRemaining: 'Estimating...'
    };
    
    downloads.unshift(download);
    updateDownloadList();
    updateDownloadCount();
}

function updateDownloadList() {
    downloadList.innerHTML = downloads.map(download => `
        <tr class="hover:bg-gray-750">
            <td class="py-3 pr-4">
                <div class="flex items-start">
                    ${getStatusIcon(download.status)}
                    <div class="ml-2">
                        <div class="font-medium text-white truncate max-w-xs">
                            ${download.fileName}
                        </div>
                    </div>
                </div>
            </td>
            <td class="py-3 pr-4 text-sm text-gray-300">
                ${download.size}
            </td>
            <td class="py-3 pr-4 text-sm">
                <div class="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div class="h-full ${getStatusColor(download.status)} progress-bar"
                         style="width: ${download.progress}%"></div>
                </div>
                <div class="mt-1 text-xs text-gray-400">
                    ${getStatusText(download)}
                </div>
            </td>
            <td class="py-3 pr-4">
                <span class="${getStatusBadgeClass(download.status)}">
                    ${capitalizeFirst(download.status)}
                </span>
            </td>
            <td class="py-3">
                <div class="flex space-x-2">
                    ${getActionButtons(download)}
                </div>
            </td>
        </tr>
    `).join('');
}

function getStatusIcon(status) {
    const icons = {
        downloading: '<svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
        completed: '<svg class="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg class="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>',
        paused: '<svg class="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
    };
    return icons[status] || icons.downloading;
}

function getStatusColor(status) {
    const colors = {
        downloading: 'bg-blue-500',
        completed: 'bg-green-500',
        error: 'bg-red-500',
        paused: 'bg-yellow-500'
    };
    return colors[status] || 'bg-gray-500';
}

function getStatusBadgeClass(status) {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const statusClasses = {
        downloading: 'bg-blue-900 text-blue-200',
        completed: 'bg-green-900 text-green-200',
        error: 'bg-red-900 text-red-200',
        paused: 'bg-yellow-900 text-yellow-200'
    };
    return `${baseClasses} ${statusClasses[status]}`;
}

function getStatusText(download) {
    switch (download.status) {
        case 'downloading':
            return `${download.progress}% - ${download.timeRemaining}`;
        case 'completed':
            return 'Completed';
        case 'error':
            return 'Download failed';
        case 'paused':
            return `Paused at ${download.progress}%`;
        default:
            return '';
    }
}

function getActionButtons(download) {
    const buttons = [];
    
    if (download.status === 'downloading' || download.status === 'paused') {
        buttons.push(`
            <button onclick="togglePause('${download.id}')" class="text-gray-400 hover:text-white">
                ${download.status === 'downloading' ? getPauseIcon() : getPlayIcon()}
            </button>
        `);
    }
    
    if (download.status === 'completed') {
        buttons.push(`
            <button onclick="openFile('${download.id}')" class="text-gray-400 hover:text-white">
                ${getOpenIcon()}
            </button>
        `);
    }
    
    buttons.push(`
        <button onclick="removeDownload('${download.id}')" class="text-gray-400 hover:text-red-500">
            ${getRemoveIcon()}
        </button>
    `);
    
    return buttons.join('');
}

function getPauseIcon() {
    return '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
}

function getPlayIcon() {
    return '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
}

function getOpenIcon() {
    return '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
}

function getRemoveIcon() {
    return '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
}

function togglePause(id) {
    const download = downloads.find(d => d.id === id);
    if (download) {
        download.status = download.status === 'downloading' ? 'paused' : 'downloading';
        updateDownloadList();
    }
}

function removeDownload(id) {
    downloads = downloads.filter(d => d.id !== id);
    updateDownloadList();
    updateDownloadCount();
}

function openFile(id) {
    const download = downloads.find(d => d.id === id);
    if (download && download.status === 'completed') {
        // Implement file opening logic
        console.log('Opening file:', download.fileName);
    }
}

function updateDownloadCount() {
    downloadCount.textContent = `${downloads.length} file${downloads.length !== 1 ? 's' : ''}`;
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function updateServerStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);
        const data = await response.json();
        
        if (data.status === 'success') {
            const { diskSpace, cpu, memory, uptime } = data.data;
            
            serverStatus.innerHTML = `
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                            <line x1="6" y1="6" x2="6" y2="6"/>
                            <line x1="6" y1="18" x2="6" y2="18"/>
                        </svg>
                        <h2 class="ml-2 text-xl font-bold">Server Status</h2>
                    </div>
                    <div class="flex items-center">
                        <span class="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <span class="text-sm text-green-400">Online</span>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div class="bg-gray-700 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-sm font-medium text-gray-300">Disk Space</h3>
                            <svg class="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            </svg>
                        </div>
                        <div class="mt-1">
                            <div class="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                                <div class="h-full ${parseInt(diskSpace.percentUsed) > 80 ? 'bg-red-500' : 'bg-blue-500'}"
                                     style="width: ${diskSpace.percentUsed}%"></div>
                            </div>
                            <div class="flex justify-between mt-1">
                                <span class="text-xs text-gray-400">${diskSpace.used} used</span>
                                <span class="text-xs text-gray-400">${diskSpace.free} free</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-700 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-sm font-medium text-gray-300">CPU Usage</h3>
                            <svg class="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
                            </svg>
                        </div>
                        <div class="mt-1">
                            <div class="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                                <div class="h-full ${cpu.usage > 80 ? 'bg-red-500' : 'bg-blue-500'}"
                                     style="width: ${cpu.usage}%"></div>
                            </div>
                            <div class="flex justify-between mt-1">
                                <span class="text-xs text-gray-400">${cpu.usage}% (${cpu.cores} cores)</span>
                                <span class="text-xs text-gray-400">Idle: ${100 - cpu.usage}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-700 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-sm font-medium text-gray-300">Memory</h3>
                            <svg class="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                                <path d="M8 10h8"/><path d="M8 14h8"/>
                            </svg>
                        </div>
                        <div class="mt-1">
                            <div class="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                                <div class="h-full ${memory.percentUsed > 80 ? 'bg-red-500' : 'bg-blue-500'}"
                                     style="width: ${memory.percentUsed}%"></div>
                            </div>
                            <div class="flex justify-between mt-1">
                                <span class="text-xs text-gray-400">${memory.used} used</span>
                                <span class="text-xs text-gray-400">${memory.free} free</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-700 p-3 rounded-lg">
                        <h3 class="text-xs font-medium text-gray-400">Server IP</h3>
                        <p class="text-white">${data.data.ip}</p>
                    </div>
                    <div class="bg-gray-700 p-3 rounded-lg">
                        <h3 class="text-xs font-medium text-gray-400">Uptime</h3>
                        <p class="text-white">${uptime}</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error updating server status:', error);
    }
}