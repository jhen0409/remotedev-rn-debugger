'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const name = 'react-native';
const startRemoteDev = require('remotedev-server');
const injectDebugger = require('./injectDebugger');
const injectServer = require('./injectServer');
const bundleCode = fs.readFileSync(path.join(__dirname, '../bundle.js'), 'utf-8');

const getModulePath = moduleName =>
  path.join(process.cwd(), 'node_modules', moduleName);

const log = (pass, msg) => {
  const prefix = pass ? chalk.green.bgBlack('PASS') : chalk.red.bgBlack('FAIL');
  const color = pass ? chalk.blue : chalk.red;
  console.log(prefix, color(msg));
};

module.exports = argv => {
  const modulePath = getModulePath(argv.desktop ? 'react-native-desktop' : name);

  // Revert all injection
  if (argv.revert) {
    const passServ = injectServer.revert(modulePath);
    let msg = 'Revert injection of RemoteDev server from React Native local server';
    log(passServ, msg + (!passServ ? `, the file '${injectServer.path}' not found.` : '.'));

    const passDbg = injectDebugger.revert(modulePath);
    msg = 'Revert injection of RemoteDev monitor from React Native debugger';
    log(passDbg, msg + (!passDbg ? `, the file '${injectDebugger.path}' not found.` : '.'));

    if (!passServ || !passDbg) return false;
    return true;
  }

  const options = argv.hostname || argv.port ? {
    hostname: argv.hostname || 'localhost',
    port: argv.port || 8000,
  } : null;

  // Inject server
  if (argv.injectserver) {
    const pass = injectServer.inject(modulePath, options);
    const msg = 'Inject RemoteDev server into React Native local server';
    log(pass, msg + (pass ? '.' : `, the file '${injectServer.path}' not found.`));
    if (!pass) return false;
  }

  // Inject debugger
  if (argv.injectdebugger) {
    const pass = injectDebugger.inject(modulePath, bundleCode, options);
    const msg = 'Inject RemoteDev monitor into React Native debugger';
    log(pass, msg + (pass ? '.' : `, the file '${injectDebugger.path}' not found.`));
    if (!pass) return false;
  }

  // Run RemoteDev server
  if (argv.runserver) {
    return startRemoteDev(options || { port: 8000 });
  }
  return true;
};
