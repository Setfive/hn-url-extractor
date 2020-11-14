import * as fs from 'fs';
import * as chalk from 'chalk';
import * as cheerio from 'cheerio';

import {IExtractedSite, ILaunchArguments} from './models';

export class Lib {

    private static extractedSiteMap = new Map<string, IExtractedSite>();

    public static getCliArguments(): ILaunchArguments {
        const launchArguments = require('yargs').argv;
        return Object.assign({url: null, outFile: null, urlsFile: null}, launchArguments);
    }

    public static async process(params: ILaunchArguments): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let urls: string[] = [];
            if(params.url) {
                urls.push(params.url);
            }else if(params.urlsFile){
                const fileData = fs.readFileSync(params.urlsFile, 'utf8');
                if(fileData) {
                    urls = fileData.split(/[\r\n]+/);
                }
            }

            if(urls.length === 0) {
                Lib.error('No URLs found? Something probably isn\'t right.');
                resolve();
                return;
            }

            Lib.log(`Found ${urls.length} URLs to process. Here we go...`);

        });
    }

    public static async processUrl(url: string): Promise<IExtractedSite> {
        return new Promise((resolve, reject) => {

        });
    }

    public static extractSitesFromHTML(html: string): IExtractedSite[] {
        const $ = cheerio.load(html);
        const commentSites: IExtractedSite[] = [];

        $('.comment').each((i, el) => {

            const commentHTML = $(el).html() ?? '';
            const re = new RegExp(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
            const emails: string[] = commentHTML.match(re) ?? [];

            const baseUrls = new Set<string>();
            $(el).find('a').each((ix, ex) => {
                const u = $(ex).attr('href');
                if (!u || (u.indexOf('http') === -1 && u.indexOf('https') === -1)) {
                    return true;
                }

                const url = new URL(u);
                baseUrls.add(url.origin);
            });

            for(const u of baseUrls) {
                commentSites.push({url: u, emails: emails, description: ''});
            }
        });

        return commentSites;
    }

    public static log(msg: string) {
        // tslint:disable-next-line:no-console
        console.log(msg);
    }

    public static error(msg: string) {
        // tslint:disable-next-line:no-console
        console.log(chalk.bgRed.white('You must provide a --url or --urlsFile option!'));
    }
}