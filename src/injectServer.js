import fs from 'fs';
import path from 'path';

const name = 'remote-redux-devtools-on-debugger';
const startFlag = `/* ${name} start */`;
const endFlag = `/* ${name} end */`;
const serverFlag = '    _server(argv, config, resolve, reject);';

export const dir = 'local-cli/server';
export const file = 'server.js';
export const fullPath = path.join(dir, file);

export const inject = (modulePath, options) => {
  const filePath = path.join(modulePath, fullPath);
  if (!fs.existsSync(filePath)) return false;

  const opts = { ...options, runserver: true, injectdebugger: false };
  const code = [
    startFlag,
    `    require("${name}")(${JSON.stringify(opts)})`,
    '      .then(_remotedev =>',
    '        _remotedev.on("ready", () => {',
    '          if (!_remotedev.portAlreadyUsed) console.log("-".repeat(80));',
    `      ${serverFlag}`,
    '        })',
    '      );',
    endFlag,
  ].join('\n');

  const serverCode = fs.readFileSync(filePath, 'utf-8');
  let start = serverCode.indexOf(startFlag);  // already injected ?
  let end = serverCode.indexOf(endFlag) + endFlag.length;
  if (start === -1) {
    start = serverCode.indexOf(serverFlag);
    end = start + serverFlag.length;
  }
  fs.writeFileSync(
    filePath,
    serverCode.substr(0, start) + code + serverCode.substr(end, serverCode.length)
  );
  return true;
};

export const revert = modulePath => {
  const filePath = path.join(modulePath, fullPath);
  if (!fs.existsSync(filePath)) return false;

  const serverCode = fs.readFileSync(filePath, 'utf-8');
  const start = serverCode.indexOf(startFlag); // already injected ?
  const end = serverCode.indexOf(endFlag) + endFlag.length;
  if (start !== -1) {
    fs.writeFileSync(
      filePath,
      serverCode.substr(0, start) + serverFlag + serverCode.substr(end, serverCode.length)
    );
  }
  return true;
};
