const fs = require('fs');
const path = require('path');
const name = 'react-native';
const startRemoteDev = require('remotedev-server');
const injectDebugger = require('./injectDebugger');
const injectServer = require('./injectServer');
const bundleCode = fs.readFileSync(path.join(__dirname, '../bundle.js'), 'utf-8');

const getModulePath = moduleName => {
  const cwd = process.cwd();
  // Use case: run node_modules/${moduleName}/packager/packager.sh with XCode/RunAndroid
  if (cwd.indexOf(path.join(`node_modules/${moduleName}/packager`)) !== -1) {
    return path.join(cwd, `../../../node_modules/${moduleName}`);
  }
  return path.join(cwd, `node_modules/${moduleName}`);
};

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
    injectDebugger.inject(modulePath, bundleCode, {
      hostname: argv.hostname,
      port: argv.port || 8000,
      autoReconnect: true,
    });
  } else {
    injectDebugger.inject(modulePath, bundleCode);
  }

  // Run RemoteDev server
  if (argv.runserver) {
    return startRemoteDev(Object.assign({}, argv, { port: argv.port || 8000 }));
  }
};
