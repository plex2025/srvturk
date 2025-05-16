#!/bin/bash

# AllDebrid Downloader & Plex Media Server Installation Script
# For dedicated server at IP: 77.92.145.44
# This script installs:
# 1. Node.js and npm
# 2. The AllDebrid Downloader web application
# 3. Plex Media Server
# 4. Sets up systemd services for both

# Exit on any error
set -e

echo "==========================================="
echo "AllDebrid Downloader & Plex Installation"
echo "==========================================="

# Update system packages
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required dependencies
echo "Installing dependencies..."
apt-get install -y curl wget gnupg2 apt-transport-https software-properties-common

# Create download directory
echo "Creating download directory..."
mkdir -p /home/telechargement
chmod 755 /home/telechargement

# Install Node.js for the web application
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install Plex Media Server
echo "Installing Plex Media Server..."
wget https://downloads.plex.tv/plex-media-server-new/1.32.8.7639-fb6452ebf/debian/plexmediaserver_1.32.8.7639-fb6452ebf_amd64.deb
dpkg -i plexmediaserver_*.deb
rm plexmediaserver_*.deb

# Start and enable Plex service
systemctl start plexmediaserver
systemctl enable plexmediaserver

# Create directory for the web application
echo "Setting up AllDebrid Downloader web application..."
mkdir -p /opt/alldebrid-downloader

# Download and setup the web application
cat > /opt/alldebrid-downloader/server.js <<EOL
const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

// AllDebrid API key
const API_KEY = 'yfQdaYOk4Dd7dbjnUWkX';
const DOWNLOAD_DIR = '/home/telechargement';

// Simple HTTP server for the web app
const server = http.createServer((req, res) => {
  // API endpoints
  if (req.url.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    
    // Handle downloads
    if (req.url === '/api/download' && req.method === 'POST') {
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const { url } = JSON.parse(body);
          
          // Call AllDebrid API to unrestrict the link
          const apiUrl = \`https://api.alldebrid.com/v4/link/unlock?agent=myApp&apikey=\${API_KEY}&link=\${encodeURIComponent(url)}\`;
          
          https.get(apiUrl, (apiRes) => {
            let apiData = '';
            
            apiRes.on('data', chunk => {
              apiData += chunk;
            });
            
            apiRes.on('end', () => {
              const response = JSON.parse(apiData);
              
              if (response.status === 'success') {
                const downloadUrl = response.data.link;
                const filename = response.data.filename || path.basename(url);
                const outputPath = path.join(DOWNLOAD_DIR, filename);
                
                // Use wget to download the file
                exec(\`wget "\${downloadUrl}" -O "\${outputPath}"\`, (error, stdout, stderr) => {
                  if (error) {
                    console.error(\`Download error: \${error}\`);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ status: 'error', message: 'Download failed' }));
                  } else {
                    console.log(\`Downloaded: \${filename}\`);
                    res.statusCode = 200;
                    res.end(JSON.stringify({ 
                      status: 'success', 
                      message: 'Download completed',
                      filename: filename,
                      path: outputPath
                    }));
                  }
                });
              } else {
                res.statusCode = 400;
                res.end(JSON.stringify({ 
                  status: 'error', 
                  message: 'Failed to unrestrict link',
                  details: response.error || 'Unknown error'
                }));
              }
            });
          }).on('error', (error) => {
            console.error(\`API error: \${error}\`);
            res.statusCode = 500;
            res.end(JSON.stringify({ status: 'error', message: 'API call failed' }));
          });
        } catch (error) {
          console.error(\`Request error: \${error}\`);
          res.statusCode = 400;
          res.end(JSON.stringify({ status: 'error', message: 'Invalid request' }));
        }
      });
      return;
    }
    
    // Get server status
    if (req.url === '/api/status' && req.method === 'GET') {
      exec('df -h | grep "/$" | awk \'{print $2, $3, $4, $5}\'', (error, dfStdout) => {
        if (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ status: 'error', message: 'Failed to get disk info' }));
          return;
        }
        
        const [total, used, free, percentUsed] = dfStdout.trim().split(' ');
        
        exec('uptime', (error, uptimeStdout) => {
          const uptime = error ? 'Unknown' : uptimeStdout.trim();
          
          exec('cat /proc/cpuinfo | grep "cpu cores" | uniq | awk \'{print $4}\'', (error, cpuStdout) => {
            const cores = error ? '1' : cpuStdout.trim() || '1';
            
            exec('free -h | grep "Mem:" | awk \'{print $2, $3, $4}\'', (error, memStdout) => {
              if (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ status: 'error', message: 'Failed to get memory info' }));
                return;
              }
              
              const [memTotal, memUsed, memFree] = memStdout.trim().split(' ');
              
              exec('ls -la /home/telechargement | wc -l', (error, filesStdout) => {
                const fileCount = error ? '0' : parseInt(filesStdout.trim()) - 3; // Subtract . and .. and header
                
                res.statusCode = 200;
                res.end(JSON.stringify({
                  status: 'success',
                  data: {
                    ip: '77.92.145.44', // Static IP from the request
                    status: 'online',
                    diskSpace: {
                      total,
                      used,
                      free,
                      percentUsed: percentUsed.replace('%', '')
                    },
                    memory: {
                      total: memTotal,
                      used: memUsed,
                      free: memFree
                    },
                    cpu: {
                      cores: parseInt(cores)
                    },
                    uptime,
                    files: {
                      count: fileCount
                    }
                  }
                }));
              });
            });
          });
        });
      });
      return;
    }
    
    // List downloaded files
    if (req.url === '/api/files' && req.method === 'GET') {
      fs.readdir(DOWNLOAD_DIR, (error, files) => {
        if (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ status: 'error', message: 'Failed to read directory' }));
          return;
        }
        
        const filePromises = files
          .filter(file => !file.startsWith('.'))
          .map(file => {
            return new Promise((resolve) => {
              const filePath = path.join(DOWNLOAD_DIR, file);
              fs.stat(filePath, (err, stats) => {
                if (err) {
                  resolve(null);
                  return;
                }
                
                resolve({
                  name: file,
                  size: stats.size,
                  modified: stats.mtime,
                  path: filePath,
                  isDirectory: stats.isDirectory()
                });
              });
            });
          });
        
        Promise.all(filePromises)
          .then(fileInfos => {
            res.statusCode = 200;
            res.end(JSON.stringify({
              status: 'success',
              files: fileInfos.filter(Boolean)
            }));
          })
          .catch(error => {
            res.statusCode = 500;
            res.end(JSON.stringify({ status: 'error', message: error.message }));
          });
      });
      return;
    }
    
    // Unknown API endpoint
    res.statusCode = 404;
    res.end(JSON.stringify({ status: 'error', message: 'Endpoint not found' }));
    return;
  }
  
  // Serve static files for the web app
  const filePath = req.url === '/' ? 
    path.join(__dirname, 'public', 'index.html') : 
    path.join(__dirname, 'public', req.url);
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // If requesting a non-root path that doesn't exist, try serving index.html
        // (for single page app routing)
        if (req.url !== '/' && !req.url.includes('.')) {
          fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, indexContent) => {
            if (err) {
              res.statusCode = 500;
              res.end('Server Error');
              return;
            }
            
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 200;
            res.end(indexContent);
          });
          return;
        }
        
        res.statusCode = 404;
        res.end('Not Found');
        return;
      }
      
      res.statusCode = 500;
      res.end('Server Error');
      return;
    }
    
    // Set the appropriate content type
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (ext) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
        contentType = 'image/jpg';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }
    
    res.setHeader('Content-Type', contentType);
    res.statusCode = 200;
    res.end(content);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}/\`);
  console.log(\`Downloading files to: \${DOWNLOAD_DIR}\`);
});
EOL

# Create a systemd service for the web app
cat > /etc/systemd/system/alldebrid-downloader.service <<EOL
[Unit]
Description=AllDebrid Downloader Web Application
After=network.target

[Service]
ExecStart=/usr/bin/node /opt/alldebrid-downloader/server.js
WorkingDirectory=/opt/alldebrid-downloader
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=alldebrid-downloader
User=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL

# Create a simple HTML page for the web app
mkdir -p /opt/alldebrid-downloader/public
cat > /opt/alldebrid-downloader/public/index.html <<EOL
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AllDebrid Downloader</title>
  <!-- This is a placeholder. The React app will be deployed here -->
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #1a202c;
      color: white;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    h1 {
      margin-top: 100px;
    }
    .loading {
      display: inline-block;
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255,255,255,.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <h1>AllDebrid Downloader</h1>
  <p>Loading application...</p>
  <div class="loading"></div>
  <p>This is a placeholder page. The full React application will be deployed here.</p>
</body>
</html>
EOL

# Enable and start the web app service
systemctl enable alldebrid-downloader.service
systemctl start alldebrid-downloader.service

# Set up firewall
echo "Configuring firewall..."
apt-get install -y ufw
ufw allow ssh
ufw allow http
ufw allow https
ufw allow 32400/tcp  # Plex
ufw allow 3000/tcp   # Web app
ufw --force enable

# Display completion message
echo ""
echo "==========================================="
echo "Installation completed!"
echo "==========================================="
echo ""
echo "AllDebrid Downloader is running at: http://77.92.145.44:3000"
echo "Plex Media Server is running at: http://77.92.145.44:32400/web"
echo ""
echo "To complete Plex setup, navigate to the above URL in your browser"
echo "Files will be downloaded to: /home/telechargement"
echo ""
echo "The server has been configured with:"
echo "- Node.js backend with AllDebrid API integration"
echo "- Plex Media Server for streaming media"
echo "- Firewall configured to allow necessary ports"
echo "- Systemd services for automatic startup"
echo ""
echo "You can access logs with:"
echo "- journalctl -u alldebrid-downloader"
echo "- journalctl -u plexmediaserver"
echo ""
echo "Enjoy your new media server!"