import path from "node:path";
import {getCwd, setCwd, invalidInput, isInsideRoot, operationFailed, resolveTarget} from "../utils/utils.js";
import fsPromises from "node:fs/promises";

async function cmd_up() {
  const parent = path.dirname(getCwd());
  if (!isInsideRoot(parent)) return;
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
    const items = await fsPromises.readdir(getCwd(), { withFileTypes: true });

    const dirs = items
      .filter(d => d.isDirectory())
      .map(d => ({ name: d.name, type: 'directory' }));

    const files = items
      .filter(d => d.isFile())
      .map(d => ({ name: d.name, type: 'file' }));

    const rows = [
      ...dirs.sort((a, b) => a.name.localeCompare(b.name)),
      ...files.sort((a, b) => a.name.localeCompare(b.name))
    ];

    const tableRows = rows
      .map((r, i) => ({'#': i + 1, Name: r.name, Type: r.type}));
    console.table(tableRows);
  } catch (err) {
    operationFailed();
  }
}

export {cmd_up, cmd_cd, cmd_ls};