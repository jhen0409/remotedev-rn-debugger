'use strict';

const fs = require('fs');
const path = require('path');
const name = 'react-native';
const startRemoteDev = require('remotedev-server');
const injectDebugger = require('./injectDebugger');

const getModulePath = moduleName => path.join(
  process.cwd(),
  `node_modules/${moduleName}`
);

module.exports = argv => {
  // Inject debugger
  const modulePath = getModulePath(argv.desktop ? 'react-native-desktop' : name);
  if (argv.hostname || argv.port) {
    injectDebugger(modulePath, {
      hostname: argv.hostname,
      port: argv.port || 8000,
      autoReconnect: true
    });
  } else {
    injectDebugger(modulePath);
  }

  // Run RemoteDev server
  if (argv.runserver) {
    argv.port = argv.port || 8000;
    startRemoteDev(argv);
  }
};
