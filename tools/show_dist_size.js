/* eslint-disable no-console */

const fs = require('fs');
const path = 'dist/browser-id3-writer.js';

const stat = fs.statSync(path);
const size = (stat.size / 1024).toFixed(2);

console.log(`Size of "${path}" is ${size} KiB`);
