#! /usr/bin/env node

'use strict';

const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');

let name = 'react-native';
if (argv.desktop) {
  name = 'react-native-desktop';
}

const filePath = path.join(__dirname, '../debugger.html');
const distPath = path.join(process.cwd(), `node_modules/${name}/local-cli/server/util/debugger.html`);

const html = fs.readFileSync(filePath, 'utf-8');
if (argv.hostname) {
  fs.writeFileSync(
    distPath,
    html.replace(
      '__remotedevOptionsSet__',
      'window.remotedevOptions = ' + JSON.stringify({
        hostname: argv.hostname,
        port: argv.port || 80,
        autoReconnect: true
      })
    )
  );
} else {
  fs.writeFileSync(distPath, html);
}
