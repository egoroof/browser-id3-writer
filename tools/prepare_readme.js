const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const pack = require('../package.json');
const rootDir = path.dirname(__dirname);
const readmeDraft = fs.readFileSync(path.join(rootDir, 'tools', 'README.draft.md'), 'utf8');

const hash = crypto.createHash('sha384');
hash.update(fs.readFileSync(path.join(rootDir, 'dist', 'browser-id3-writer.min.js'), 'utf8'));
const digest = hash.digest('base64');

const readme = readmeDraft
    .replace('###version###', pack.version)
    .replace('###hash###', `sha384-${digest}`);

fs.writeFileSync(path.join(rootDir, 'README.md'), readme);

console.log(`README.md is updated, version: ${pack.version}, hash: ${digest}`);
