import path from "node:path";
import { getCwd, setCwd, invalidInput, isInsideRoot, operationFailed, resolveTarget } from "../utils/utils.js";
import fsPromises from "node:fs/promises";

async function cmd_up() {
  const parent = path.dirname(getCwd());
  if (!isInsideRoot(parent)) {
    // don't change if tries to go above root
    return;
  }
  setCwd(parent)
}

async function cmd_cd(args) {
  if (!args[0]) return invalidInput();
  const target = resolveTarget(args[0]);
  try {
    const stat = await fsPromises.stat(target);
    if (!stat.isDirectory()) return operationFailed();
    if (!isInsideRoot(target)) return; // refuse to leave root
    setCwd(target);
  } catch (err) {
    return operationFailed();
  }
}

async function cmd_ls() {
  try {
    const items = await fsPromises.readdir(getCwd(), {withFileTypes: true});
    // directories first, then files, both alphabetical asc
    const dirs = items.filter(d => d.isDirectory()).map(d => d.name).sort((a, b) => a.localeCompare(b));
    const files = items.filter(d => d.isFile()).map(d => d.name).sort((a, b) => a.localeCompare(b));
    const rows = [
      ...dirs.map(name => ({name, type: 'directory'})),
      ...files.map(name => ({name, type: 'file'}))
    ];
    for (const r of rows) {
      console.log(`${r.name}\t${r.type}`);
    }
  } catch (err) {
    operationFailed();
  }
}

export { cmd_up, cmd_cd, cmd_ls };