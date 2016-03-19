'use strict';

const fs = require('fs');
const path = require('path');
const flag = '<!--  remote-redux-devtools-on-debugger -->';
const debuggerPath = 'local-cli/server/util/debugger.html';
const bundleCode = fs.readFileSync(path.join(__dirname, '../bundle.js'), 'utf-8');

module.exports = (modulePath, options) => {
  let scriptTag = `<script>${bundleCode}</script>`;
  // Development mode
  if (process.env.__DEV__) {
    scriptTag = '<script src="http://localhost:3030/js/bundle.js"></script>';
  }
  const code =
    flag +
    '<style>.ReactModalPortal { z-index: 99999999; position: fixed; }</style>' +
    '<div id="remote-redux-devtools-on-debugger"></div>' +
    (options ? `<script>window.remotedevOptions = ${JSON.stringify(options)}</script>` : '') +
    scriptTag +
    '</body></html>';

  const filePath = path.join(modulePath, debuggerPath);
  const html = fs.readFileSync(filePath, 'utf-8');
  let position = html.indexOf(flag);  // already injected ?
  if (position === -1) {
    position = html.indexOf('</body>');
  }
  fs.writeFileSync(filePath, html.substr(0, position) + code);
};
