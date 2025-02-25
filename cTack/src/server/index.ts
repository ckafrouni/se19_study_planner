import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'
import staticPlugin from '@elysiajs/static'
import swagger from '@elysiajs/swagger'

import path from 'path'
import { networkInterfaces } from 'os'

import logger from '../utils/logger'
import { buildAppStructure } from './appBuilder'
import { routerReducer } from './routerBuilder'

// MARK: - Router

const ROOT_DIR = process.cwd()
const APP_DIR = path.join(ROOT_DIR, 'src', 'app')

// Function to get the local IP address
function getLocalIpAddress() {
  const networks = networkInterfaces();
  for (const name of Object.keys(networks)) {
    for (const net of networks[name] || []) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '0.0.0.0'; // Fallback
}

export function generateRouter(dir: string): Elysia {
  const appStructure = buildAppStructure(dir)
  // console.log(JSON.stringify(appStructure, null, 2));
  return routerReducer(new Elysia(), appStructure)
}

const appRouter = generateRouter(APP_DIR)

// MARK: - App

const app = new Elysia()
  .use(html({ autoDetect: true }))
  .use(logger)
  .use(appRouter)
  .use(
    staticPlugin({
      noCache: process.env.NODE_ENV !== 'production',
    })
  )
  .use(swagger({ path: '/swagger' }))
  .onStart((app) => {
    const port = app.server?.port || 3000;
    const hostname = app.server?.hostname || 'localhost';
    const localUrl = `http://${hostname}:${port}`;
    const localIpUrl = `http://${getLocalIpAddress()}:${port}`;
    
    console.log(`🦊 \x1b[1;33mcTack\x1b[0m is running at \x1b[1;34m${localUrl}\x1b[0m`);
    console.log(`📡 Available on your network at \x1b[1;34m${localIpUrl}\x1b[0m`);
  })

app.listen(3000)
