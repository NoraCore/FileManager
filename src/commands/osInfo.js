import os from "node:os";
import {invalidInput} from "../utils/utils.js";
import {COMMANDS} from "../constants/constants.js";

function cmd_os(args) {
  const flag = args[0];
  switch (flag) {
    case COMMANDS.OS_EOL.command:
      console.log(JSON.stringify(os.EOL));
      break;
    case COMMANDS.OS_CPUS.command:
      const cpus = os.cpus();
      console.log(`Total CPUs: ${cpus.length}`);
      cpus.forEach((c, i) => {
        const ghz = (c.speed / 1000).toFixed(2);
        console.log(`${i + 1}. ${c.model} - ${ghz} GHz`);
      });
      break;
    case COMMANDS.OS_HOMEDIR.command:
      console.log(os.homedir());
      break;
    case COMMANDS.OS_USERNAME.command:
      console.log(os.userInfo().username);
      break;
    case COMMANDS.OS_ARCH.command:
      console.log(process.arch);
      break;
    default:
      invalidInput();
  }
}

export {
  cmd_os,
}