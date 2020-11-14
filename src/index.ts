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

(async () => {
    const html = fs.readFileSync('/home/ashish/Downloads/hn_nov.html', 'utf8');
    const res = Lib.extractSitesFromHTML(html);

    const results: IExtractedSite[] = [];
    for(const site of res) {
        const kw = await Lib.fetchMetaDescription(site.url);
        results.push(Object.assign(site, kw));
    }

    console.log(results);
})();

/*
const r = Lib.process(launchArgs);
r.then(() => process.exit(0))
 .catch(() => process.exit(255));
 */