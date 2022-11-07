# Hacker News URL Extractor

The "Who is hiring" and "Who wants to be hired" posts on [Hacker News](https://news.ycombinator.com/)
are great but they're a pain to browse through. Generally, what you're interested in
is the URLs to sites or candidates and associated email addresses not skimming 100s of comments.

This doodad attempts to solve that problem by automatically extracting URLs and email addresses from 
a Hacker News thread. It also fetches the HTML meta keyword and description for the discovered
URLs so that you can quickly get a sense what the company does.

## Use it

This is built with TypeScript and compiled to JavaScript in the dist/ folder.

First, grab the code. Either clone the repository or download the ZIP from Github:

```
$ git clone git@github.com:Setfive/hn-url-extractor.git
```

Then grab the dependencies via npm:
```
$ npm install
```

And you're ready to rock.

There's not too many options:

* **url** - a single HN URL to process
* **urlsFile** - a file containing a list of HN URLs to process
* **outFile** - path to write the results out. Defaults to results.csv
* **format** - indicate CSV or JSON output. Defaults to csv.

Here's some examples of how to run it from the root of the project:

```
npm start -- --url=https://news.ycombinator.com/item?id=24651639
npm start -- --urlsFile=sampleUrls.txt
npm start -- --urlsFile=sampleUrls.txt --format=json --outFile=/tmp/hndata.json
```
