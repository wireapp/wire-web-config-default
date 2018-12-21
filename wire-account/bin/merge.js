const fs = require('fs-extra');
const {resolve, join} = require('path');

const src = 'content';
const dest = '../../../';
const ignoreList = ['.DS_Store'];

process.chdir(src);

const walkSync = (dir, fileList = []) =>
  fs.readdirSync(dir).reduce((fileListAccumulator, file) => {
    const isDirectory = fs.statSync(join(dir, file)).isDirectory();
    return isDirectory ? walkSync(join(dir, file), fileListAccumulator) : fileListAccumulator.concat([[dir, file]]);
  }, fileList);

const files = walkSync('./').filter(file => ignoreList.some(ignore => !file.includes(ignore)));

files.forEach(([dir, file]) => {
  const source = resolve(dir, file);
  const destination = resolve(dest, dir, file);
  console.log(`Copy file "${source}" -> "${destination}"`);
  fs.mkdirpSync(resolve(dir));
  fs.copySync(source, destination);
});
