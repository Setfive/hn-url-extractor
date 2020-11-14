const chalk = require('chalk')
import {Lib} from "./lib";

const launchArgs = Lib.getCliArguments();

if(!launchArgs.url && !launchArgs.urlsFile) {
    console.log(chalk.bgRed.white('You must provide a --url or --urlsFile option!'));
    process.exit(255);
}

if(launchArgs.url && launchArgs.urlsFile) {
    console.log(chalk.bgRed.white('Only --url or --urlsFile can be provided.'));
    process.exit(255);
}

const r = Lib.process(launchArgs);
r.then(() => process.exit(0))
 .catch(() => process.exit(255));