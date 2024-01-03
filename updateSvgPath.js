const fs = require('fs');
const path = require('path');

const imageDir = `./src/assets/svg/`; // Default path or use the provided path

const images = fs
  .readdirSync(imageDir)
  .filter((fileName) => fileName.endsWith('.svg') && !fileName.startsWith('.'))
  .reduce((acc, fileName) => {
    const imageName = path.parse(fileName).name;
    acc[imageName] = `'./${fileName}'`;
    return acc;
  }, {});

const content = Object.keys(images)
  .map((imageName) => `import ${imageName} from ${images[imageName]};`)
  .join('\n');

const contentExport = Object.keys(images)
  .map((imageName) => `${imageName},`)
  .join('\n');

fs.writeFileSync(`${imageDir}/index.ts`, `${content}\n export {\n${contentExport}\n}`);
