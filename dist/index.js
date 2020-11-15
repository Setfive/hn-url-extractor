"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
const launchArgs = lib_1.Lib.getCliArguments();
if (!launchArgs.url && !launchArgs.urlsFile) {
    lib_1.Lib.error('You must provide a --url or --urlsFile option!');
    process.exit(255);
}
if (launchArgs.url && launchArgs.urlsFile) {
    lib_1.Lib.error('Only --url or --urlsFile can be provided.');
    process.exit(255);
}
const r = lib_1.Lib.process(launchArgs);
r.then(() => process.exit(0))
    .catch((e) => {
    lib_1.Lib.error(e);
    process.exit(255);
});
//# sourceMappingURL=index.js.map