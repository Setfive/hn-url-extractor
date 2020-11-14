import {ILaunchArguments} from "./models";

export class Lib {
    public static getCliArguments(): ILaunchArguments {
        const launchArguments = require('yargs').argv;
        return Object.assign({url: null, outFile: null, urlsFile: null}, launchArguments);
    }
}