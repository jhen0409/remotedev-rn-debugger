import fs from 'fs';
import path from 'path';
import injectServer from 'remotedev-server/bin/injectServer';

const name = 'remote-redux-devtools-on-debugger';
const startFlag = `/* ${name} start */`;
const endFlag = `/* ${name} end */`;
const serverFlag = '    _server(argv, config, resolve, reject);';

export const dir = 'local-cli/server';
export const file = 'server.js';
export const fullPath = path.join(dir, file);

export const revert = (modulePath, moduleName) => {
  const filePath = path.join(modulePath, fullPath);
  if (!fs.existsSync(filePath)) return false;

  // Revert legacy injected code
  const serverCode = fs.readFileSync(filePath, 'utf-8');
  const start = serverCode.indexOf(startFlag); // already injected ?
  const end = serverCode.indexOf(endFlag) + endFlag.length;
  if (start !== -1) {
    fs.writeFileSync(
      filePath,
      serverCode.substr(0, start) + serverFlag + serverCode.substr(end, serverCode.length)
    );
  }
  return injectServer.revert(modulePath, moduleName);
};

export const inject = (modulePath, options, moduleName) => {
  revert(modulePath, moduleName);
  return injectServer.inject(modulePath, options, moduleName);
};
