import * as fs from 'fs';
import * as chalk from 'chalk';

import {Lib} from './lib';
import {IExtractedSite} from './models';

const launchArgs = Lib.getCliArguments();

if(!launchArgs.url && !launchArgs.urlsFile) {
    Lib.error('You must provide a --url or --urlsFile option!');
    process.exit(255);
}

if(launchArgs.url && launchArgs.urlsFile) {
    Lib.error('Only --url or --urlsFile can be provided.');
    process.exit(255);
}


const r = Lib.process(launchArgs);
r.then(() => process.exit(0))
 .catch((e) => {
     Lib.error(e);
     process.exit(255)
 });