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

  // Revert all injection
  if (argv.revert) {
    injectServer.revert(modulePath);
    injectDebugger.revert(modulePath);
    return;
  }

  // Inject server
  if (argv.injectserver) {
    if (argv.hostname || argv.port) {
      injectServer.inject(modulePath, {
        hostname: argv.hostname,
        port: argv.port || 8000,
      });
    } else {
      injectServer.inject(modulePath);
    }
    return;
  }

  // Inject debugger
  if (argv.hostname || argv.port) {
    injectDebugger.inject(modulePath, {
      hostname: argv.hostname,
      port: argv.port || 8000,
      autoReconnect: true,
    });
  } else {
    injectDebugger.inject(modulePath);
  }

  // Run RemoteDev server
  if (argv.runserver) {
    return startRemoteDev(Object.assign({}, argv, { port: argv.port || 8000 }));
  }
};
