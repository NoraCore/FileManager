import fsPromises from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import fs from "node:fs";
import { getCwd, invalidInput, operationFailed, resolveTarget } from "../utils/utils.js";


async function cmd_cat(args) {
  if (!args[0]) return invalidInput();
  const file = resolveTarget(args[0]);
  try {
    const stat = await fsPromises.stat(file);
    if (!stat.isFile()) return operationFailed();
    const rs = fs.createReadStream(file, {encoding: 'utf8'});
    // stream to stdout
    await pipeline(rs, process.stdout);
    // ensure newline after done
    process.stdout.write('\n');
  } catch (err) {
    operationFailed();
  }
}

async function cmd_add(args) {
  if (!args[0]) return invalidInput();
  const file = path.join(getCwd(), args[0]);
  try {
    // fail if exists
    await fsPromises.open(file, 'wx').then(h => h.close());
  } catch (err) {
    operationFailed();
  }
}

async function cmd_mkdir(args) {
  if (!args[0]) return invalidInput();
  const dir = path.join(getCwd(), args[0]);
  try {
    await fsPromises.mkdir(dir, {recursive: false});
  } catch (err) {
    operationFailed();
  }
}

async function cmd_rn(args) {
  if (!args[0] || !args[1]) return invalidInput();
  const src = resolveTarget(args[0]);
  const destName = args[1];
  const dest = path.join(path.dirname(src), destName);
  try {
    await fsPromises.rename(src, dest);
  } catch (err) {
    operationFailed();
  }
}

async function doCopyFile(src, destDir) {
  // copy using streams to destDir keeping same filename
  const stat = await fsPromises.stat(src);
  if (!stat.isFile()) throw new Error('not-file');
  const name = path.basename(src);
  const dest = path.resolve(destDir, name);
  // create dest dir if needed? task says path_to_new_directory - expect exists: we'll error if missing
  await pipeline(fs.createReadStream(src), fs.createWriteStream(dest));
}

async function cmd_cp(args) {
  if (!args[0] || !args[1]) return invalidInput();
  const src = resolveTarget(args[0]);
  const destDir = resolveTarget(args[1]);
  try {
    await doCopyFile(src, destDir);
  } catch (err) {
    operationFailed();
  }
}

async function cmd_mv(args) {
  if (!args[0] || !args[1]) return invalidInput();
  const src = resolveTarget(args[0]);
  const destDir = resolveTarget(args[1]);
  try {
    // copy then unlink
    await doCopyFile(src, destDir);
    await fsPromises.unlink(src);
  } catch (err) {
    operationFailed();
  }
}

async function cmd_rm(args) {
  if (!args[0]) return invalidInput();
  const target = resolveTarget(args[0]);
  try {
    const stat = await fsPromises.stat(target);
    if (!stat.isFile()) return operationFailed();
    await fsPromises.unlink(target);
  } catch (err) {
    operationFailed();
  }
}

export {
  cmd_add,
  cmd_cat,
  cmd_mkdir,
  cmd_rn,
  cmd_cp,
  cmd_mv,
  cmd_rm,
}