import { IExtractedSite, IKeywordAndDescription, ILaunchArguments } from './models';
export declare class Lib {
    private static extractedSiteMap;
    static getCliArguments(): ILaunchArguments;
    static process(params: ILaunchArguments): Promise<void>;
    static fetchURL(url: string): Promise<string>;
    static extractSitesFromHTML(html: string): IExtractedSite[];
    static fetchMetaDescription(url: string): Promise<IKeywordAndDescription>;
    static createOutputFile(config: ILaunchArguments, results: IExtractedSite[]): void;
    static log(msg: string): void;
    static error(msg: string): void;
}
