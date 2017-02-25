const fs = require('fs');
const pack = require('../package.json');
const stat = fs.statSync(pack.main);
const size = (stat.size / 1024).toFixed(2);

console.log(`Size of "${pack.main}" is ${size} KiB`);
