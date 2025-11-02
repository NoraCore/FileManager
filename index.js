import readline from 'node:readline';
import { parseStartupArgs, printCwd } from "./src/utils/utils.js";
import { dispatch } from "./src/commands/dispatcher.js";

const argv = process.argv.slice(2);
const startupArgs = parseStartupArgs(argv);
const username = startupArgs.username || 'Anonymous';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>'
});

const gracefulExit = () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  rl.close();
  process.exit(0);
};

// ctrl+c handling
process.on('SIGINT', () => gracefulExit());

// startup
console.log(`Welcome to the File Manager, ${username}!`);
printCwd();
rl.prompt();

rl.on('line', async (line) => {
  await dispatch(line);
  printCwd();
  rl.prompt();
}).on('close', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});