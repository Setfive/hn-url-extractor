const fs = require('fs');

import {ILaunchArguments} from './models';

export class Lib {
    public static getCliArguments(): ILaunchArguments {
        const launchArguments = require('yargs').argv;
        return Object.assign({url: null, outFile: null, urlsFile: null}, launchArguments);
    }

    public static process(params: ILaunchArguments): Promise<void> {
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

            }
        });
    }

    public static error(msg: string) {

    }
}