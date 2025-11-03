import { invalidInput, operationFailed } from "../utils/utils.js";
import { cmd_cd, cmd_ls, cmd_up } from "./navigation.js";
import { cmd_add, cmd_cat, cmd_cp, cmd_mkdir, cmd_mv, cmd_rm, cmd_rn } from "./files.js";
import { cmd_os } from "./osInfo.js";
import { cmd_hash } from "./hash.js";
import { cmd_compress, cmd_decompress } from "./compression.js";
import { COMMANDS } from "../constants/constants.js";

const dispatch = async (line, exit) => {
  const tokens = line
    .trim()
    .split(/\s+/).filter(Boolean);

  if (tokens.length === 0) return;
  const cmd = tokens[0];
  const args = tokens.slice(1);

  try {
    switch (cmd) {
      case COMMANDS.UP.command:
        await cmd_up();
        break;
      case COMMANDS.CD.command:
        await cmd_cd(args);
        break;
      case COMMANDS.LS.command:
        await cmd_ls();
        break;
      case COMMANDS.CAT.command:
        await cmd_cat(args);
        break;
      case COMMANDS.ADD.command:
        await cmd_add(args);
        break;
      case COMMANDS.MKDIR.command:
        await cmd_mkdir(args);
        break;
      case COMMANDS.RN.command:
        await cmd_rn(args);
        break;
      case COMMANDS.CP.command:
        await cmd_cp(args);
        break;
      case COMMANDS.MV.command:
        await cmd_mv(args);
        break;
      case COMMANDS.RM.command:
        await cmd_rm(args);
        break;
      case COMMANDS.OS.command:
        cmd_os(args);
        break;
      case COMMANDS.HASH.command:
        await cmd_hash(args);
        break;
      case COMMANDS.COMPRESS.command:
        await cmd_compress(args);
        break;
      case COMMANDS.DECOMPRESS.command:
        await cmd_decompress(args);
        break;
      case COMMANDS.EXIT.command:
      case COMMANDS.EXIT.alias:
        exit();
        return;
      default:
        invalidInput();
    }
  } catch (err) {
    operationFailed();
  }
};

export {
  dispatch,
}