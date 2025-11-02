import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import {pipeline} from 'node:stream/promises';
import {createBrotliCompress, createBrotliDecompress} from 'node:zlib';
import {invalidInput, operationFailed, resolveTarget} from "../utils/utils.js";

async function cmd_compress(args) {
  if (!args[0] || !args[1]) return invalidInput();
  const src = resolveTarget(args[0]);
  const dest = resolveTarget(args[1]);
  try {
    const stat = await fsPromises.stat(src);
    if (!stat.isFile()) return operationFailed();

    const destDir = path.dirname(dest);
    await fsPromises.access(destDir);
    const rs = fs.createReadStream(src);
    const ws = fs.createWriteStream(dest);
    const brot = createBrotliCompress();
    await pipeline(rs, brot, ws);
  } catch (err) {
    operationFailed();
  }
}

async function cmd_decompress(args) {
  if (!args[0] || !args[1]) return invalidInput();
  const src = resolveTarget(args[0]);
  const dest = resolveTarget(args[1]);
  try {
    const stat = await fsPromises.stat(src);
    if (!stat.isFile()) return operationFailed();
    const destDir = path.dirname(dest);
    await fsPromises.access(destDir);
    const rs = fs.createReadStream(src);
    const ws = fs.createWriteStream(dest);
    const brot = createBrotliDecompress();
    await pipeline(rs, brot, ws);
  } catch (err) {
    operationFailed();
  }
}

export {
  cmd_compress,
  cmd_decompress
}