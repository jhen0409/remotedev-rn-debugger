import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import * as injectDebugger from './injectDebugger';
import * as injectServer from './injectServer';
import runServer from './runServer';

const name = 'react-native';
const bundleCode = fs.readFileSync(path.join(__dirname, '../bundle.js'), 'utf-8');

const getModulePath = moduleName =>
  path.join(process.cwd(), 'node_modules', moduleName);

const log = (pass, msg) => {
  const prefix = pass ? chalk.green.bgBlack('PASS') : chalk.red.bgBlack('FAIL');
  const color = pass ? chalk.blue : chalk.red;
  console.log(prefix, color(msg));
};

const getFullPath = filePath => path.resolve(process.cwd(), filePath);

const assignSecureOptions = (options, { secure, key, cert, passphrase }) => ({
  ...options,
  ...(
    secure ? {
      protocol: 'https',
      key: key ? getFullPath(key) : null,
      cert: cert ? getFullPath(cert) : null,
      passphrase: passphrase || null,
    } : null
  ),
});

module.exports = argv => {
  const modulePath = getModulePath(argv.desktop ? 'react-native-desktop' : name);

  // Revert all injection
  if (argv.revert) {
    const passServ = injectServer.revert(modulePath);
    let msg = 'Revert injection of RemoteDev server from React Native local server';
    log(passServ, msg + (!passServ ? `, the file '${injectServer.fullPath}' not found.` : '.'));

    const passDbg = injectDebugger.revert(modulePath);
    msg = 'Revert injection of RemoteDev monitor from React Native debugger';
    log(passDbg, msg + (!passDbg ? `, the file '${injectDebugger.fullPath}' not found.` : '.'));

    if (!passServ || !passDbg) return false;
    return true;
  }

  const options = argv.hostname || argv.port ? {
    secure: argv.secure,
    hostname: argv.hostname || 'localhost',
    port: argv.port || 8000,
  } : null;

  // Inject server
  if (argv.injectserver) {
    const pass = injectServer.inject(modulePath, assignSecureOptions(options, argv));
    const msg = 'Inject RemoteDev server into React Native local server';
    log(pass, msg + (pass ? '.' : `, the file '${injectServer.fullPath}' not found.`));
    if (!pass) return false;
  }

  // Inject debugger
  if (argv.injectdebugger) {
    const pass = injectDebugger.inject(modulePath, bundleCode, options);
    const msg = 'Inject RemoteDev monitor into React Native debugger';
    log(pass, msg + (pass ? '.' : `, the file '${injectDebugger.fullPath}' not found.`));
    if (!pass) return false;
  }

  // Run RemoteDev server
  if (argv.runserver) {
    return runServer(assignSecureOptions(options || { secure: argv.secure, port: 8000 }, argv));
  }
  return true;
};
