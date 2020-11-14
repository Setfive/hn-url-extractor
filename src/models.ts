export interface ILaunchArguments {
    url: string;
    urlsFile: string;
    outFile: string;
}

export interface IExtractedSite {
    url: string;
    emails: string[];
    description: string;
    keywords: string;
}

export interface IKeywordAndDescription {
    description: string;
    keywords: string;
}