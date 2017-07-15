import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import * as injectDebugger from './injectDebugger';
import * as injectServer from './injectServer';
import runServer from './runServer';

const bundleCode = fs.readFileSync(path.join(__dirname, '../bundle.js'), 'utf-8');

const getModuleName = (type) => {
  switch (type) {
    case 'macos':
      return 'react-native-macos';
    // react-native-macos is renamed from react-native-desktop
    case 'desktop':
      return 'react-native-desktop';
    default:
      return 'react-native';
  }
};
const getModulePath = moduleName => path.join(process.cwd(), 'node_modules', moduleName);
const getModule = (type) => {
  let moduleName = getModuleName(type);
  let modulePath = getModulePath(moduleName);
  if (type === 'desktop' && !fs.existsSync(modulePath)) {
    moduleName = getModuleName('macos');
    modulePath = getModulePath(moduleName);
  }
  return { moduleName, modulePath };
};

const log = (pass, msg) => {
  const prefix = pass ? chalk.green.bgBlack('PASS') : chalk.red.bgBlack('FAIL');
  const color = pass ? chalk.blue : chalk.red;
  console.log(prefix, color(msg));
};

const getFullPath = filePath => path.resolve(process.cwd(), filePath);
const assignSecureOptions = (options, { secure, key, cert, passphrase }) => ({
  ...options,
  ...(secure
    ? {
      protocol: 'https',
      key: key ? getFullPath(key) : null,
      cert: cert ? getFullPath(cert) : null,
      passphrase: passphrase || null,
    }
    : null),
});

module.exports = (argv) => {
  const type = argv.desktop ? 'desktop' : argv.macos && 'macos';
  const { moduleName, modulePath } = getModule(type);
  const serverPath = path.join(moduleName, injectServer.fullPath);
  const debuggerPath = path.join(moduleName, injectDebugger.fullPath);

  // Revert all injection
  if (argv.revert) {
    const passServ = injectServer.revert(modulePath, moduleName);
    let msg = 'Revert injection of RemoteDev server from React Native local server';
    log(passServ, msg + (!passServ ? `, the file '${serverPath}' not found.` : '.'));

    const passDbg = injectDebugger.revert(modulePath);
    msg = 'Revert injection of RemoteDev monitor from React Native debugger';
    log(passDbg, msg + (!passDbg ? `, the file '${debuggerPath}' not found.` : '.'));

    return passServ && passDbg;
  }

  const defaultOptions = { showtips: argv.showtips };
  const options =
    argv.hostname || argv.port
      ? {
        secure: argv.secure,
        hostname: argv.hostname || 'localhost',
        port: argv.port || 8000,
        ...defaultOptions,
      }
      : defaultOptions;

  // Inject server
  if (argv.injectserver) {
    const pass = injectServer.inject(modulePath, assignSecureOptions(options, argv), moduleName);
    const msg = 'Inject RemoteDev server into React Native local server';
    log(pass, msg + (pass ? '.' : `, the file '${serverPath}' not found.`));
    if (!pass) return false;
  }

  // Inject debugger
  if (argv.injectdebugger) {
    const pass = injectDebugger.inject(modulePath, bundleCode, options);
    const msg = 'Inject RemoteDev monitor into React Native debugger';
    log(pass, msg + (pass ? '.' : `, the file '${debuggerPath}' not found.`));
    if (!pass) return false;
  }

  // Run RemoteDev server
  if (argv.runserver) {
    return runServer(assignSecureOptions({ secure: argv.secure, port: 8000, ...options }, argv));
  }
  return true;
};
