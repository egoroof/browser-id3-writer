const fs = require('fs');
const path = require('path');
const pack = require('../package.json');

const rootDir = path.dirname(__dirname);
const stat = fs.statSync(path.join(rootDir, pack.main));
const size = (stat.size / 1024).toFixed(2);

console.log(`Size of "${pack.main}" is ${size} KiB`);
