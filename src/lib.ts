import * as fs from 'fs';
import * as chalk from 'chalk';
import * as cheerio from 'cheerio';
import axios from 'axios';
const stringify = require('csv-stringify/lib/sync');

import {IExtractedSite, IKeywordAndDescription, ILaunchArguments} from './models';

export class Lib {

    private static extractedSiteMap = new Map<string, IExtractedSite>();

    public static getCliArguments(): ILaunchArguments {
        const launchArguments = require('yargs').argv;
        return Object.assign({url: null, outFile: 'results.csv', format: 'csv', urlsFile: null}, launchArguments);
    }

    public static async process(params: ILaunchArguments): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
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

            const results: IExtractedSite[] = [];
            for(const u of urls) {
                try {
                    const html = await Lib.fetchURL(u);
                    const extractedSites = Lib.extractSitesFromHTML(html);

                    for(const site of extractedSites) {
                        const kw = await Lib.fetchMetaDescription(site.url);
                        results.push(Object.assign(site, kw));
                    }
                }catch(e){

                }
            }

            Lib.createOutputFile(params, results);
        });
    }

    public static async fetchURL(url: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(url);
                resolve(response.data);
            }catch(e) {
                Lib.error(e);
                reject(e);
            }
        });
    }

    public static extractSitesFromHTML(html: string): IExtractedSite[] {
        const $ = cheerio.load(html);
        const commentSites: IExtractedSite[] = [];

        $('.comment').each((i, el) => {

            let link = '';

            try {
                link = 'https://news.ycombinator.com/'
                        + $(el).parents('td:first')
                               .find('.age a:first')
                               .attr('href') ?? '';
            }catch(e) {

            }

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
                commentSites.push({url: u, emails: emails, hnLink: link, description: '', keywords: ''});
            }
        });

        return commentSites;
    }

    public static async fetchMetaDescription(url: string): Promise<IKeywordAndDescription> {
        return new Promise(async (resolve, reject) => {
            try {
                Lib.log('Fetching: ' + url);

                const response = await axios.get(url);
                const $ = cheerio.load(response.data);

                let description = '';
                let keywords = '';
                if($('meta[name=\'description\']').length) {
                    description = $($('meta[name=\'description\']')[0]).attr('content') ?? '';
                }

                if($('meta[name=\'keywords\']').length) {
                    keywords = $($('meta[name=\'keywords\']')[0]).attr('content') ?? '';
                }

                resolve({keywords: keywords, description: description});
            }catch(e) {
                resolve({keywords: '', description: ''});
            }
        });
    }

    public static createOutputFile(config: ILaunchArguments, results: IExtractedSite[]) {
        let data = '';
        if(config.format === 'csv') {
            const header = [['url', 'HN link', 'emails', 'description', 'keywords']];
            const csvData = header.concat(results.map(f => [f.url, f.hnLink, f.emails.join('|'), f.description, f.keywords]));
            data = stringify(csvData);
        }else if(config.format === 'json') {
            data = JSON.stringify(results);
        }

        fs.writeFileSync(config.outFile, data);

        Lib.log('Wrote results to ' + config.outFile);
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