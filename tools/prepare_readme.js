const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const pack = require('../package.json');

const rootDir = path.dirname(__dirname);
const distFilePath = path.join(rootDir, 'dist', 'browser-id3-writer.js');
const readmePath = path.join(rootDir, 'README.md');
const readmeDraftPath = path.join(rootDir, 'tools', 'README.draft.md');

const distFile = fs.readFileSync(distFilePath, 'utf8');
const readmeDraftFile = fs.readFileSync(readmeDraftPath, 'utf8');

const algo = 'sha384';
const size = (zlib.gzipSync(distFile).byteLength / 1024).toFixed(1);
const digest = crypto.createHash(algo).update(distFile).digest('base64');

const readme = readmeDraftFile
    .replace('###gzip_size###', size)
    .replace('###version###', pack.version)
    .replace('###hash###', `${algo}-${digest}`);

fs.writeFileSync(readmePath, readme);

console.log(`File ${readmePath} is updated`);
console.log(`Version: ${pack.version}`);
console.log(`Hash: ${algo}-${digest}`);
console.log(`Gzip size: ${size} KiB`);
