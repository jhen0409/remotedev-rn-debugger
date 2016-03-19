import fs from 'fs-extra';
import path from 'path';

process.on('exit', () => fs.removeSync(path.join(__dirname, 'temp')));
