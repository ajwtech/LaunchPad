// strapi/tunnel.ts
// import 'dotenv/config';

import {
  createTunnel,
  TunnelOptions,
  ServerOptions,
  SshOptions,
  ForwardOptions,
} from 'tunnel-ssh';

let tunnelServer: any = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000; // 2 seconds
const CONNECTION_TIMEOUT = 60000; // 30 seconds

export default function openSshTunnel(): Promise<void> {
  if (process.env.USE_SSH_TUNNEL !== 'true') {
    console.log('🔌 SSH tunnel disabled');
    return Promise.resolve();
  }

  return createTunnelWithRetry();
}

export async function closeTunnel(): Promise<void> {
  if (tunnelServer) {
    console.log('🔌 Closing SSH tunnel...');
    try {
      tunnelServer.close();
      tunnelServer = null;
      console.log('✅ SSH tunnel closed');
    } catch (err) {
      console.error('❌ Error closing tunnel:', err);
    }
  }
}

async function createTunnelWithRetry(): Promise<void> {
  try {
    await establishTunnel();
    reconnectAttempts = 0; // Reset on successful connection
  } catch (err) {
    console.error('❌ SSH tunnel error:', err);
    
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect tunnel (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) in ${RECONNECT_DELAY/1000}s...`);
      
      await new Promise(resolve => setTimeout(resolve, RECONNECT_DELAY));
      return createTunnelWithRetry();
    } else {
      console.error('❌ Max reconnection attempts reached. Tunnel failed.');
      throw err;
    }
  }
}

function establishTunnel(): Promise<void> {

  // 1) How the tunnel itself behaves:
  const tunnelOptions: TunnelOptions = {
    autoClose: false,          // don’t shut down when the first client disconnects
    reconnectOnError: true,    // if the SSH channel dies, restart it
  };

  // 2) The local TCP server that listens on your machine:
  const serverOptions: ServerOptions = {
    host: process.env.DB_LOCAL_HOST,      // e.g. "127.0.0.1"
    port: Number(process.env.DB_LOCAL_PORT), // e.g. 33306
  };

  // 3) How to SSH into your jumpbox:
  // Parse host and port from SSH_TUNNEL_HOST in case it contains port
  const tunnelHostEnv = process.env.SSH_TUNNEL_HOST || '';
  const [tunnelHost, tunnelPortFromHost] = tunnelHostEnv.includes(':') 
    ? tunnelHostEnv.split(':') 
    : [tunnelHostEnv, null];
  
  const sshOptions: SshOptions = {
    host:     tunnelHost,   // jumpbox host without port
    port:     Number(tunnelPortFromHost || process.env.SSH_TUNNEL_PORT),
    username: process.env.SSH_TUNNEL_USER,
    password: process.env.SSH_TUNNEL_PASSWORD,
    readyTimeout: CONNECTION_TIMEOUT,
    keepaliveInterval: 10000, // Send keepalive every 10 seconds
    keepaliveCountMax: 5,     // Allow 5 missed keepalive responses
    // –or–
    // privateKey: readFileSync(process.env.SSH_TUNNEL_PRIVATE_KEY_PATH!), // if this is uncommented then you must import fs
    // by adding `import { readFileSync } from 'fs';` to the top of this file
  };

  // 4) Where to forward that local server’s traffic:
  const forwardOptions: ForwardOptions = {    // If you're binding locally via serverOptions, you only need the destination here
    dstAddr: process.env.DB_REMOTE_HOST,      // e.g. "scoutdbserver.mysql.database.azure.com"
    dstPort: Number(process.env.DB_REMOTE_PORT), // 3306
  };

  console.log(
    `🔌 Tunneling ${serverOptions.host}:${serverOptions.port} → ` +
    `${forwardOptions.dstAddr}:${forwardOptions.dstPort} via SSH`
  );
  console.time('tunnel-establish');

  return createTunnel(
    tunnelOptions,
    serverOptions,
    sshOptions,
    forwardOptions
  )
    .then(([server]) => {
      tunnelServer = server;
      console.timeEnd('tunnel-establish');
      console.log('✅ SSH tunnel established');
      
      // Set up error handlers for the tunnel
      server.on('error', (err: Error) => {
        console.error('🔌 Tunnel server error:', err);
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          console.log('🔄 Attempting to reconnect...');
          setTimeout(() => createTunnelWithRetry(), RECONNECT_DELAY);
        }
      });
      
      server.on('close', () => {
        console.log('🔌 Tunnel server closed');
        tunnelServer = null;
      });
      
      // Set up periodic health check
      const healthCheck = setInterval(() => {
        if (!tunnelServer || !tunnelServer.listening) {
          console.warn('⚠️ Tunnel appears to be down, attempting reconnect...');
          clearInterval(healthCheck);
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            createTunnelWithRetry();
          }
        }
      }, 40000); // Check every 40 seconds

      return Promise.resolve();
    })
    .catch(err => {
      console.error('❌ SSH tunnel error:', err);
      throw err;
    });
}