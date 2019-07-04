import fs from 'fs';
import path from 'path';
import semver from 'semver';

const name = 'remote-redux-devtools-on-debugger';
const flag = `<!--  ${name} -->`;
const end = '</body>\n</html>\n';

const tips = `
  <div class="content">
    <p>Redux DevTools: Type <kbd id='dev_tools_shortcut' class="shortcut">⌃H</kbd> for toggle the dock visibility, <kbd id='dev_tools_shortcut'
        class="shortcut">⌃Q</kbd> for toggle the dock position.</p>
  </div>
`;

export const fileInfos = {
  'react-native': {
    '0.50.0-rc.0': {
      dir: 'local-cli/server/util/debugger-ui',
      file: 'index.html',
      path: 'local-cli/server/util/debugger-ui/index.html',
    },
    '0.59.0-rc.0': {
      dir: '../@react-native-community/cli/build/commands/server/debugger-ui',
      file: 'index.html',
      path: '../@react-native-community/cli/build/commands/server/debugger-ui/index.html'
    },
  },
  default: {
    dir: 'local-cli/server/util',
    file: 'debugger.html',
    path: 'local-cli/server/util/debugger.html',
  },
};

const getModuleInfo = (modulePath) => {
  const pkg = JSON.parse(fs.readFileSync(path.join(modulePath, 'package.json'))); // eslint-disable-line
  return { version: pkg.version, name: pkg.name };
};

export function getFileInfo(moduleName, version) {
  const list = fileInfos[moduleName || 'react-native'] || {};
  const versions = Object.keys(list);
  let info = fileInfos.default;
  for (let i = 0; i < versions.length; i += 1) {
    if (semver.gte(version, versions[i])) {
      info = list[versions[i]];
    }
  }
  return info;
}

export const inject = (modulePath, bundleCode, options) => {
  const info = getModuleInfo(modulePath);
  const filePath = path.join(modulePath, getFileInfo(info.name, info.version).path);
  if (!fs.existsSync(filePath)) return false;

  const opts = { ...options, autoReconnect: true };
  // Check development mode
  const bundleTag = !process.env.__DEV__
    ? `  <script>\n    ${bundleCode}\n  </script>`
    : '  <script src="http://localhost:3030/js/bundle.js"></script>';
  const optionsTag = options
    ? `  <script>window.remotedevOptions = ${JSON.stringify(opts)};</script>`
    : '';
  const code = [
    flag,
    '  </audio>', // Fix for RN ^0.44, it will skiped on Chrome for old versions of RN
    options.showtips ? tips : '',
    '  <style>',
    '    body { overflow: hidden; }',
    '  </style>',
    `  <div id="${name}"></div>`,
    optionsTag,
    bundleTag,
    end,
  ].join('\n');

  const html = fs.readFileSync(filePath, 'utf-8');
  let position = html.indexOf(flag); // already injected ?
  if (position === -1) {
    position = html.indexOf('</body>');
  }
  fs.writeFileSync(filePath, html.substr(0, position) + code);
  return true;
};

export const revert = (modulePath) => {
  const info = getModuleInfo(modulePath);
  const filePath = path.join(modulePath, getFileInfo(info.name, info.version).path);
  if (!fs.existsSync(filePath)) return false;

  const html = fs.readFileSync(filePath, 'utf-8');
  const position = html.indexOf(flag);
  if (position !== -1) {
    fs.writeFileSync(filePath, html.substr(0, position) + end);
  }
  return true;
};
