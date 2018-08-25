/* eslint-disable no-console */
/* eslint-disable no-empty */

const fs = require('fs');
const paths = ['dist/browser-id3-writer.js', 'dist/browser-id3-writer.min.js'];

for (const path of paths) {
  try {
    const stat = fs.statSync(path);
    const size = (stat.size / 1024).toFixed(2);

    console.log(`Size of "${path}" is ${size} KiB`);
  } catch (e) {}
}

