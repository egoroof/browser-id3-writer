const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const pack = require('../package.json');

const rootDir = path.dirname(__dirname);
const readmePath = path.join(rootDir, 'README.md');
const readmeDraftPath = path.join(rootDir, 'tools', 'README.draft.md');
const distFilePath = path.join(rootDir, 'dist', 'browser-id3-writer.min.js');
const algo = 'sha384';

const readmeDraft = fs.readFileSync(readmeDraftPath, 'utf8');
const hash = crypto.createHash(algo);
hash.update(fs.readFileSync(distFilePath, 'utf8'));
const digest = hash.digest('base64');
const readme = readmeDraft
    .replace('###version###', pack.version)
    .replace('###hash###', `${algo}-${digest}`);
fs.writeFileSync(readmePath, readme);

console.log(`${readmePath} is updated, version: ${pack.version}, hash: ${algo}-${digest}`);
