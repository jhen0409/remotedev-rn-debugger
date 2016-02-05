'use strict';

const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../debugger.html');
const startRemoteDev = require('remotedev-server');

const html = fs.readFileSync(filePath, 'utf-8');
const name = 'react-native';

module.exports = function(argv) {
  let moduleName = name;
  if (argv.desktop) {
    moduleName = 'react-native-desktop';
  }
  const distPath = path.join(process.cwd(), `node_modules/${moduleName}/local-cli/server/util/debugger.html`);
  if (argv.hostname) {
    fs.writeFileSync(
      distPath,
      html.replace(
        '__remotedevOptionsSet__',
        'window.remotedevOptions = ' + JSON.stringify({
          hostname: argv.hostname,
          port: argv.port || 8000,
          autoReconnect: true
        })
      )
    );
    // have hostname, start remotedev server
    if (argv.runserver) {
      startRemoteDev(argv);
    }
  } else {
    fs.writeFileSync(distPath, html);
  }
};
