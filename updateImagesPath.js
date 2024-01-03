const fs = require('fs');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));

const imageDir = `./src/assets/images/${args.path}/`; // Default path or use the provided path

const images = fs
  .readdirSync(imageDir)
  .filter((fileName) => !fileName.startsWith('.'))
  .reduce((acc, fileName) => {
    const imageName = path.parse(fileName).name;
    // acc[imageName] = `require("${path.join(imageDir, fileName)}")`;
    acc[imageName] = `require("./${fileName}")`;
    return acc;
  }, {});

const content = Object.keys(images)
  .map((imageName) => `export const ${imageName} = ${images[imageName]};`)
  .join('\n');

fs.writeFileSync(`${imageDir}/index.ts`, content);

