'use strict';

const fs = require('fs');
const path = require('path');
const name = 'remote-redux-devtools-on-debugger';
const flag = `<!--  ${name} -->`;
const end = '</body>\n</html>\n';

exports.dir = 'local-cli/server/util';
exports.file = 'debugger.html';
exports.path = path.join(exports.dir, exports.file);

exports.inject = (modulePath, bundleCode, options) => {
  const filePath = path.join(modulePath, exports.path);
  if (!fs.existsSync(filePath)) return false;

  const opts = Object.assign({}, options, { autoReconnect: true });
  // Check development mode
  const bundleTag = !process.env.__DEV__ ?
    `  <script>\n    ${bundleCode}\n  </script>` :
    '  <script src="http://localhost:3030/js/bundle.js"></script>';
  const optionsTag = options ?
    `  <script>window.remotedevOptions = ${JSON.stringify(opts)};</script>` :
    '';
  const code = [
    flag,
    '  <style>',
    '    body { overflow: hidden; }',
    '    .ReactModalPortal { z-index: 99999999; position: fixed; }',
    '  </style>',
    `  <div id="${name}"></div>`,
    optionsTag, bundleTag, end,
  ].join('\n');

  const html = fs.readFileSync(filePath, 'utf-8');
  let position = html.indexOf(flag);  // already injected ?
  if (position === -1) {
    position = html.indexOf('</body>');
  }
  fs.writeFileSync(filePath, html.substr(0, position) + code);
  return true;
};

exports.revert = (modulePath) => {
  const filePath = path.join(modulePath, exports.path);
  if (!fs.existsSync(filePath)) return false;

  const html = fs.readFileSync(filePath, 'utf-8');
  const position = html.indexOf(flag);
  if (position !== -1) {
    fs.writeFileSync(filePath, html.substr(0, position) + end);
  }
  return true;
};
