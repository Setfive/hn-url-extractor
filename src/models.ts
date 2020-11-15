export interface ILaunchArguments {
    url: string;
    urlsFile: string;
    outFile: string;
    format: 'csv' | 'json';
}

export interface IExtractedSite {
    url: string;
    hnLink: string;
    emails: string[];
    description: string;
    keywords: string;
}

export interface IKeywordAndDescription {
    description: string;
    keywords: string;
}