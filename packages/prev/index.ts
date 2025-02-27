/**
 * prev - A Nextjs-like CLI for developing web applications using Elysia and Bun.
 *
 * @author Christophe Kafrouni
 */

import { spawnSync, spawn, ChildProcess } from 'child_process'
import path from 'path'
import { watch, FSWatcher } from 'fs'
import { WebSocket, WebSocketServer } from 'ws'
import { config } from 'dotenv'

config({ path: '.env' })

let serverProcess: ChildProcess | null = null
let tailwindProcess: ChildProcess | null = null
let fileWatcher: FSWatcher | null = null
let wss: WebSocketServer | null = null

const runTailwind = (watch = false) => {
  const command = [
    'bunx',
    'tailwindcss',
    '-i',
    '../app/src/app/styles.css',
    '-o',
    '../app/public/styles.css',
  ]
  if (watch) command.push('--watch')

  console.log(
    `🦊 \x1b[1;30mRunning Tailwind CSS compilation${
      watch ? ' in watch mode' : ''
    }...\x1b[0m`
  )

  if (watch) {
    tailwindProcess = spawn(command[0], command.slice(1))
    return tailwindProcess
  } else {
    return spawnSync(command[0], command.slice(1), { stdio: 'inherit' })
  }
}

const runServer = ({ dev = false }: { dev: boolean }) => {
  if (serverProcess) {
    console.log(`🦊 \x1b[1;30mRestarting server...\x1b[0m`)
    serverProcess.kill()
  } else {
    console.log(`🦊 \x1b[1;30mStarting server...\x1b[0m`)
  }

  const command = ['bun', 'run']
  command.push(path.join(__dirname, 'src', 'server', 'index.ts'))

  serverProcess = spawn(command[0], command.slice(1), {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: dev ? 'development' : 'production',
    },
  })

  serverProcess.on('close', (code) => {
    if (code) {
      console.log(`🦊 \x1b[1;30mServer process exited with code ${code}\x1b[0m`)
    }
  })

  // Send reload signal to all connected clients
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send('reload')
      }
    })
  }

  return serverProcess
}

const watchFiles = ({ dir }: { dir: string }) => {
  console.log(`🦊 \x1b[1;30mWatching for file changes\x1b[0m`)

  fileWatcher = watch(dir, { recursive: true }, (eventType, filename) => {
    if (filename && !filename.endsWith('.db')) {
      console.log(`🦊 \x1b[1;30mFile ${filename} has been ${eventType}\x1b[0m`)
      runServer({ dev: true })
    }
  })
}

const startLiveReloadWebSocketServer = () => {
  wss = new WebSocketServer({ port: 3001 })
  console.log(`🦊 \x1b[1;30mLive reload server started on port 3001\x1b[0m`)

  wss.on('connection', (ws) => {
    console.log(`🦊 \x1b[1;30mLive reload client connected\x1b[0m`)
    ws.on('close', () =>
      console.log(`🦊 \x1b[1;30mLive reload client disconnected\x1b[0m`)
    )
  })
}

const cleanup = () => {
  if (serverProcess) serverProcess.kill()
  if (tailwindProcess) tailwindProcess.kill()
  if (fileWatcher) fileWatcher.close()
  if (wss) wss.close()
  console.log(`🦊 \x1b[1;30mCleaned up processes\x1b[0m`)
  process.exit(0)
}

// MARK: - CLI

const help_command = () => {
  console.log(`
Usage: prev <command>

Commands:
  dev           - Run the application in development mode
  build         - Build the application for production
  build:watch   - Run the build command in watch mode
  start         - Start the application
  help          - Show this help message
  `)
}

const build_command = () => {
  runTailwind()
}

const build_watch_command = () => {
  runTailwind(true)
}

const start_command = () => {
  runServer({ dev: false })
}

const dev_command = ({ appDir, dev }: { appDir: string; dev: boolean }) => {
  startLiveReloadWebSocketServer()
  runTailwind(true)
  runServer({ dev })
  watchFiles({ dir: appDir })
}

const error_command = () => {
  console.log(`🦊 \x1b[1;30mUnknown command\x1b[0m`)
  help_command()
}

const main = async () => {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    help_command()
    process.exit(1)
  }

  const ROOT_DIR = process.cwd()
  const SRC_DIR = path.join(ROOT_DIR, 'src')

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)

  switch (args[0]) {
    case 'dev':
      dev_command({ appDir: SRC_DIR, dev: true })
      break
    case 'build':
      build_command()
      break
    case 'build:watch':
      build_watch_command()
      break
    case 'start':
      start_command()
      break
    case 'help':
      help_command()
      break
    default:
      error_command()
      process.exit(1)
  }
}

main()
