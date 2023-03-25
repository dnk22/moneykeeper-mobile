const fs = require('fs');
const IMAGE_PATH = './src/assets/images';
let result = [];
const imagesPath = getDirectories(IMAGE_PATH);

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}

for (const item of imagesPath) {
  const files = fs.readdirSync(`${IMAGE_PATH}/${item}`);
  const ex =
    '\n' +
    files
      .map((x, index) => {
        const decimal = files.length - 1 === index ? '' : ',';
        return `${x.split('.png')[0]}: require("./${item}/${x}")${decimal}`;
      })
      .join('\n');
  result.push(ex);
}
const formatResult = result.flat((item) => item);
const res = `export const imagesPath = {
    ${formatResult}
}`;
fs.writeFileSync(`${IMAGE_PATH}/index.js`, res);
