/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const bytesToKiB = bytes => (bytes / 1024).toFixed(2);

const filePath = 'dist/browser-id3-writer.min.js';
const rootDir = path.dirname(__dirname);
const distFile = fs.readFileSync(path.join(rootDir, filePath));
const size = bytesToKiB(distFile.byteLength);
const gzipSize = bytesToKiB(zlib.gzipSync(distFile).byteLength);

console.log(`Size of "${filePath}" is ${size} KiB (gzip ${gzipSize} KiB)`);
