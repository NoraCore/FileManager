import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import {pipeline} from 'node:stream/promises';
import {createHash} from 'node:crypto';
import {invalidInput, operationFailed, resolveTarget} from "../utils/utils.js";

async function cmd_hash(args) {
  if (!args[0]) return invalidInput();
  const target = resolveTarget(args[0]);
  try {
    const stat = await fsPromises.stat(target);
    if (!stat.isFile()) return operationFailed();
    const hash = createHash('sha256');
    const rs = fs.createReadStream(target);
    await pipeline(
      rs,
      async function* (source) {
        for await (const chunk of source) {
          hash.update(chunk);
          // not passing chunks to stdout; we just yield to consume pipeline
          yield chunk;
        }
      }
    );
    console.log(hash.digest('hex'));
  } catch (err) {
    operationFailed();
  }
}

export {
  cmd_hash,
}