const fs = require('fs');
const files = fs.readdirSync('./src/assets/images');
const ex = '{\n' + files.map((x) => `"${x.split('.png')[0]}": require("./${x}"),`).join('\n') + '}';
const res = 'export default ' + ex;
fs.writeFileSync('./src/assets/images/index.js', res);
