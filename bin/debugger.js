'use strict';

const fs = require('fs');
const path = require('path');
const name = 'react-native';
const flag = '<!--  remote-redux-devtools-on-debugger -->';
const bundleCode = fs.readFileSync(path.join(__dirname, '../bundle.js'), 'utf-8');
const startRemoteDev = require('remotedev-server');

function injectBundleCode(filePath, scriptTag, options) {
  const code =
    flag +
    '<style>.ReactModalPortal { z-index: 99999999; position: fixed; }</style>' +
    '<div id="remote-redux-devtools-on-debugger"></div>' +
    (options ? `<script>window.remotedevOptions = ${JSON.stringify(options)}</script>` : '') +
    scriptTag +
    `</body></html>`;

  const html = fs.readFileSync(filePath, 'utf-8');
  let position = html.indexOf(flag);  // already injected?
  if (position === -1) {
    position = html.indexOf('</body>');
  }
  fs.writeFileSync(filePath, html.substr(0, position) + code);
}

module.exports = function(argv) {
  if (argv.runserver) {
    argv.port = argv.port || 8000;
    startRemoteDev(argv);
  }

  // Support react-native/react-native-desktop
  let moduleName = name;
  if (argv.desktop) {
    moduleName = 'react-native-desktop';
  }

  // Development mode
  let scriptTag = `<script>${bundleCode}</script>`;
  if (argv.__DEV__) {
    scriptTag = `<script src="http://localhost:3030/js/bundle.js"></script>`;
  }

  const filePath = path.join(
    process.cwd(),
    `node_modules/${moduleName}/local-cli/server/util/debugger.html`
  );
  if (argv.hostname || argv.port) {
    injectBundleCode(filePath, scriptTag, {
      hostname: argv.hostname,
      port: argv.port || 8000,
      autoReconnect: true
    });
  } else {
    injectBundleCode(filePath, scriptTag);
  }
};
