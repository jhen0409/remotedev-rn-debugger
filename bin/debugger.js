'use strict';

const fs = require('fs');
const path = require('path');
const name = 'react-native';
const startRemoteDev = require('remotedev-server');
const injectDebugger = require('./injectDebugger');
const injectServer = require('./injectServer');

const getModulePath = moduleName => path.join(
  process.cwd(),
  `node_modules/${moduleName}`
);

module.exports = argv => {
  const modulePath = getModulePath(argv.desktop ? 'react-native-desktop' : name);

  // Inject server
  if (argv.injectserver) {
    if (argv.hostname || argv.port) {
      injectServer(modulePath, {
        hostname: argv.hostname,
        port: argv.port || 8000
      });
    } else {
      injectServer(modulePath);
    }
    return;
  }

  // Inject debugger
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
    return startRemoteDev(argv);
  }
};
