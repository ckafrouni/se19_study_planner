/**
 * cTack - A Nextjs-like CLI for developing web applications using Elysia and Bun.
 *
 * @author Christophe Kafrouni
 */

import { spawnSync, spawn, ChildProcess } from "child_process";
import path from "path";
import { watch, FSWatcher } from "fs";

let serverProcess: ChildProcess | null = null;
let tailwindProcess: ChildProcess | null = null;
let fileWatcher: FSWatcher | null = null;

const runTailwind = (watch = false) => {
  const command = [
    "bunx",
    "tailwindcss",
    "-i",
    "./src/app/styles.css",
    "-o",
    "./public/style.css",
  ];
  if (watch) command.push("--watch");

  console.log(
    `🦊 \x1b[1;30mRunning Tailwind CSS compilation${
      watch ? " in watch mode" : ""
    }...\x1b[0m`
  );

  if (watch) {
    tailwindProcess = spawn(command[0], command.slice(1));
    return tailwindProcess;
  } else {
    return spawnSync(command[0], command.slice(1), { stdio: "inherit" });
  }
};

const runServer = () => {
  if (serverProcess) {
    console.log(`🦊 \x1b[1;30mRestarting server...\x1b[0m`);
    serverProcess.kill();
  } else {
    console.log(`🦊 \x1b[1;30mStarting server...\x1b[0m`);
  }

  const command = ["bun", "run"];
  command.push("cTack/src/server");

  serverProcess = spawn(command[0], command.slice(1), { stdio: "inherit" });

  serverProcess.on("close", (code) => {
    if (code) {
      console.log(
        `🦊 \x1b[1;30mServer process exited with code ${code}\x1b[0m`
      );
    }
  });

  return serverProcess;
};

const watchFiles = (dir: string) => {
  console.log(`🦊 \x1b[1;30mWatching for file changes\x1b[0m`);

  fileWatcher = watch(dir, { recursive: true }, (eventType, filename) => {
    if (filename) {
      console.log(`🦊 \x1b[1;30mFile ${filename} has been ${eventType}\x1b[0m`);
      runServer();
    }
  });
};

const cleanup = () => {
  if (serverProcess) serverProcess.kill();
  if (tailwindProcess) tailwindProcess.kill();
  if (fileWatcher) fileWatcher.close();
  console.log(`🦊 \x1b[1;30mCleaned up processes\x1b[0m`);
  process.exit(0);
};

// MARK: - CLI

const help_command = () => {
  console.log(`
Usage: cTack <command>

Commands:
  dev           - Run the application in development mode
  build         - Build the application for production
  build:watch   - Run the build command in watch mode
  start         - Start the application
  help          - Show this help message
  `);
};

const build_command = () => {
  runTailwind();
};

const build_watch_command = () => {
  runTailwind(true);
};

const start_command = () => {
  runServer();
};

const dev_command = (appDir: string) => {
  runTailwind(true);
  runServer();
  watchFiles(appDir);
};

const error_command = () => {
  console.log(`🦊 \x1b[1;30mUnknown command\x1b[0m`);
  help_command();
};

const main = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    help_command();
    process.exit(1);
  }

  const ROOT_DIR = process.cwd();
  const APP_DIR = path.join(ROOT_DIR, "src", "app");

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  switch (args[0]) {
    case "dev":
      dev_command(APP_DIR);
      break;
    case "build":
      build_command();
      break;
    case "build:watch":
      build_watch_command();
      break;
    case "start":
      start_command();
      break;
    case "help":
      help_command();
      break;
    default:
      error_command();
      process.exit(1);
  }
};

main();
