import { readFileSync } from 'fs';
import { gzipSync } from 'zlib';

const bytesToKiB = (bytes) => (bytes / 1024).toFixed(2);

const filePath = 'dist/browser-id3-writer.js';
const distFile = readFileSync(filePath);
const size = bytesToKiB(distFile.byteLength);
const gzipSize = bytesToKiB(gzipSync(distFile).byteLength);

console.log(`Size of "${filePath}" is ${size} KiB (gzip ${gzipSize} KiB)`);
