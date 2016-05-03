'use strict';

const fs = require('fs');
const path = require('path');
const name = 'remote-redux-devtools-on-debugger';
const startFlag = `/* ${name} start */`;
const endFlag = `/* ${name} end */`;
const serverFlag = '    _server(argv, config, resolve, reject);';

exports.dir = 'local-cli/server';
exports.file = 'server.js';
exports.path = path.join(exports.dir, exports.file);

exports.inject = (modulePath, options) => {
  const filePath = path.join(modulePath, exports.path);
  if (!fs.existsSync(filePath)) return false;

  const opts = Object.assign({}, options, { runserver: true, injectdebugger: false });
  const code =
    `${startFlag}\n` +
    `    require("${name}")(${JSON.stringify(opts)})\n` +
    '      .then(_remotedev =>\n' +
    '        _remotedev.on("ready", () => {\n' +
    '          if (!_remotedev.portAlreadyUsed) console.log("-".repeat(80));\n' +
    `      ${serverFlag}\n` +
    '        })\n' +
    '      );\n' +
    `${endFlag}`;

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

exports.revert = (modulePath) => {
  const filePath = path.join(modulePath, exports.path);
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
