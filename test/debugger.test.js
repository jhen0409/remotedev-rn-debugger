import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import injectDebugger from '../bin/injectDebugger';

const versions = ['0.21'];
const fixturePath = 'fixtures/debugger';

const run = version => {
  describe(`RN v${version} local-cli/server/util/debugger.html`, () => {
    const actualCode = fs.readFileSync(
      path.join(__dirname, fixturePath, `${version}.actual.html`),
      'utf-8'
    );
    const expectedCode = fs.readFileSync(
      path.join(__dirname, fixturePath, `${version}.expected.html`),
      'utf-8'
    );
    const modulePath = `${__dirname}/temp/${version}`;
    const dirPath = `${modulePath}/local-cli/server/util`;
    const debuggerPath = path.join(dirPath, 'debugger.html');
    fs.mkdirsSync(dirPath);
    fs.writeFileSync(debuggerPath, actualCode);

    it('should inject debugger', () => {
      injectDebugger.inject(modulePath, '__THIS_IS_A_BUNDLE_CODE__', {
        hostname: 'test',
        port: 1234,
        autoReconnect: true,
      });
      const debuggerCode = fs.readFileSync(debuggerPath, 'utf-8');
      expect(debuggerCode).to.equal(expectedCode);
    });

    it('should revert debugger', () => {
      injectDebugger.revert(modulePath);
      const debuggerCode = fs.readFileSync(debuggerPath, 'utf-8');
      expect(debuggerCode).to.equal(actualCode);
    });
  });
};

describe('Inject debugger', () => versions.forEach(run));
