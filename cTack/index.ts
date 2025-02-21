/**
 * cTack - A Nextjs-like CLI for developing web applications using Elysia and Bun.
 *
 * @argument dev - Run the application in development mode.
 * @argument build - Build the application for production.
 * @argument start - Start the application.
 * @author Christophe Kafrouni
 */

import { spawnSync, spawn, ChildProcess } from "child_process";
import path from "path";
import { watch, FSWatcher } from "fs";

const args = process.argv.slice(2);

const ROOT_DIR = process.cwd();
const APP_DIR = path.join(ROOT_DIR, "src", "app");

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

const watchFiles = () => {
  console.log(`🦊 \x1b[1;30mWatching for file changes\x1b[0m`);

  fileWatcher = watch(APP_DIR, { recursive: true }, (eventType, filename) => {
    if (filename) {
      console.log(`🦊 \x1b[1;30mFile ${filename} has been ${eventType}\x1b[0m`);
      runServer();
    }
  });
};

/**
 * Clean up processes on exit
 */
const cleanup = () => {
  if (serverProcess) serverProcess.kill();
  if (tailwindProcess) tailwindProcess.kill();
  if (fileWatcher) fileWatcher.close();
  console.log(`🦊 \x1b[1;30mCleaned up processes\x1b[0m`);
  process.exit(0);
};

// Handle cleanup on exit signals
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Main execution logic
switch (args[0]) {
  case "dev":
    runTailwind(true);
    runServer();
    watchFiles();
    break;
  case "build":
    runTailwind();
    break;
  case "start":
    runServer();
    break;
  default:
    console.error(
      `🦊 \x1b[1;30mInvalid command. Use 'dev', 'build', or 'start'\x1b[0m.`
    );
    process.exit(1);
}
