import { spawnSync, spawn } from "child_process";

const args = process.argv.slice(2);

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
  return watch
    ? spawn(command[0], command.slice(1))
    : spawnSync(command[0], command.slice(1), { stdio: "pipe" });
};

const runServer = (watch = false) => {
  const command = ["bun", "run"];
  if (watch) command.push("--watch");
  command.push("cTack/server");
  return watch
    ? spawn(command[0], command.slice(1), { stdio: "inherit" })
    : spawnSync(command[0], command.slice(1), { stdio: "inherit" });
};

switch (args[0]) {
  case "dev":
    runTailwind(true);
    runServer(true);
    break;
  case "build":
    runTailwind();
    break;
  case "start":
    runServer();
    break;
  default:
    console.error("Invalid command. Use 'dev', 'build', or 'start'.");
    process.exit(1);
}
