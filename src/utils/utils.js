import os from 'node:os';
import path from 'node:path';

const homeDir = os.homedir();
let cwd = homeDir;

const OPERATION_FAILED = 'Operation failed';
const INVALID_INPUT = 'Invalid input';
const rootPath = path.parse(homeDir).root;

// normalize path for comparisons
const norm = p => path.resolve(p);

const isInsideRoot = (p) => {
  const resolved = norm(p);
  const r = path.resolve(rootPath);
  // ensure we don't allow escaping the root. safe prefix-check.
  return resolved === r || resolved.startsWith(r);
};
const invalidInput = () => console.log(INVALID_INPUT);
const operationFailed = () => console.log(OPERATION_FAILED);
const printCwd = () => {
  const CURRENTLY_IN_PATH = `You are currently in ${cwd}`;
  console.log(CURRENTLY_IN_PATH);
}
const getCwd = () => cwd;
const setCwd = (newPath) => { cwd = newPath; };
// Resolve user-provided path relative to current working dir (or absolute)
const resolveTarget = (maybePath) => {
  if (path.isAbsolute(maybePath)) return path.resolve(maybePath);
  return path.resolve(cwd, maybePath);
};

const parseStartupArgs = (args) => {
  const out = {};
  for (const token of args) {
    // accept --username=name or --username name
    if (token.startsWith('--')) {
      const [k, v] = token.includes('=') ? token.split('=') : [token, null];
      const key = k.replace(/^--/, '');
      out[key] = v;
    }
  }
  // support --username name (space separated)
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--') && !args[i].includes('=') && args[i + 1] && !args[i + 1].startsWith('--')) {
      out[args[i].replace(/^--/, '')] = args[i + 1];
    }
  }
  return out;
};

export {
  getCwd,
  setCwd,
  isInsideRoot,
  invalidInput,
  operationFailed,
  printCwd,
  resolveTarget,
  parseStartupArgs
};