"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lib = void 0;
const fs = require("fs");
const chalk = require("chalk");
const cheerio = require("cheerio");
const axios_1 = require("axios");
const stringify = require('csv-stringify/lib/sync');
class Lib {
    static getCliArguments() {
        const launchArguments = require('yargs').argv;
        return Object.assign({ url: null, outFile: 'results.csv', format: 'csv', urlsFile: null }, launchArguments);
    }
    static process(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let urls = [];
                if (params.url) {
                    urls.push(params.url);
                }
                else if (params.urlsFile) {
                    const fileData = fs.readFileSync(params.urlsFile, 'utf8');
                    if (fileData) {
                        urls = fileData.trim().split(/[\r\n]+/);
                    }
                }
                if (urls.length === 0) {
                    Lib.error('No URLs found? Something probably isn\'t right.');
                    resolve();
                    return;
                }
                Lib.log(`Found ${urls.length} URLs to process. Here we go...`);
                const results = [];
                for (const u of urls) {
                    try {
                        const html = yield Lib.fetchURL(u);
                        const extractedSites = Lib.extractSitesFromHTML(html);
                        for (const site of extractedSites) {
                            const kw = yield Lib.fetchMetaDescription(site.url);
                            results.push(Object.assign(site, kw));
                        }
                    }
                    catch (e) {
                    }
                }
                results.sort((a, b) => a.url.localeCompare(b.url));
                Lib.createOutputFile(params, results);
            }));
        });
    }
    static fetchURL(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield axios_1.default.get(url);
                    resolve(response.data);
                }
                catch (e) {
                    Lib.error(e);
                    reject(e);
                }
            }));
        });
    }
    static extractSitesFromHTML(html) {
        const $ = cheerio.load(html);
        const commentSites = [];
        $('.comment').each((i, el) => {
            var _a, _b, _c;
            let link = '';
            try {
                link = (_a = 'https://news.ycombinator.com/'
                    + $(el).parents('td:first')
                        .find('.age a:first')
                        .attr('href')) !== null && _a !== void 0 ? _a : '';
            }
            catch (e) {
            }
            const commentHTML = (_b = $(el).html()) !== null && _b !== void 0 ? _b : '';
            const re = new RegExp(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
            const emails = (_c = commentHTML.match(re)) !== null && _c !== void 0 ? _c : [];
            const baseUrls = new Set();
            $(el).find('a').each((ix, ex) => {
                const u = $(ex).attr('href');
                if (!u || (u.indexOf('http') === -1 && u.indexOf('https') === -1)) {
                    return true;
                }
                const url = new URL(u);
                baseUrls.add(url.origin);
            });
            for (const u of baseUrls) {
                commentSites.push({ url: u, emails: emails, hnLink: link, description: '', keywords: '' });
            }
        });
        return commentSites;
    }
    static fetchMetaDescription(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    Lib.log('Fetching: ' + url);
                    const response = yield axios_1.default.get(url);
                    const $ = cheerio.load(response.data);
                    let description = '';
                    let keywords = '';
                    if ($('meta[name=\'description\']').length) {
                        description = (_a = $($('meta[name=\'description\']')[0]).attr('content')) !== null && _a !== void 0 ? _a : '';
                    }
                    if ($('meta[name=\'keywords\']').length) {
                        keywords = (_b = $($('meta[name=\'keywords\']')[0]).attr('content')) !== null && _b !== void 0 ? _b : '';
                    }
                    resolve({ keywords: keywords, description: description });
                }
                catch (e) {
                    resolve({ keywords: '', description: '' });
                }
            }));
        });
    }
    static createOutputFile(config, results) {
        let data = '';
        if (config.format === 'csv') {
            const header = [['url', 'HN link', 'emails', 'description', 'keywords']];
            const csvData = header.concat(results.map(f => [f.url, f.hnLink, f.emails.join('|'), f.description, f.keywords]));
            data = stringify(csvData);
        }
        else if (config.format === 'json') {
            data = JSON.stringify(results);
        }
        fs.writeFileSync(config.outFile, data);
        Lib.log('Wrote results to ' + config.outFile);
    }
    static log(msg) {
        // tslint:disable-next-line:no-console
        console.log(msg);
    }
    static error(msg) {
        // tslint:disable-next-line:no-console
        console.log(chalk.bgRed.white('You must provide a --url or --urlsFile option!'));
    }
}
exports.Lib = Lib;
Lib.extractedSiteMap = new Map();
//# sourceMappingURL=lib.js.map