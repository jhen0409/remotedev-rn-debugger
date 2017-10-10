import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import * as injectDebugger from '../src/injectDebugger';

const versions = ['0.21', '0.44', '0.50'];
const fixturePath = 'fixtures/debugger';

const run = (version) => {
  describe(`RN v${version}`, () => {
    const actualCode = fs.readFileSync(
      path.join(__dirname, fixturePath, `${version}.actual.html`),
      'utf-8'
    );
    const expectedCode = fs.readFileSync(
      path.join(__dirname, fixturePath, `${version}.expected.html`),
      'utf-8'
    );
    const modulePath = path.join(__dirname, 'temp', version);
    const { dir, file } = injectDebugger.getFileInfo('react-native', `${version}.0`);
    const dirPath = path.join(modulePath, dir);
    const debuggerPath = path.join(dirPath, file);
    fs.mkdirsSync(dirPath);
    fs.writeFileSync(debuggerPath, actualCode);
    fs.writeFileSync(
      path.join(modulePath, 'package.json'),
      JSON.stringify({
        version: `${version}.0`,
        name: 'react-native',
      })
    );

    it('should inject debugger', () => {
      let pass = injectDebugger.inject(modulePath, '__THIS_IS_A_BUNDLE_CODE__', {
        secure: false,
        hostname: 'test',
        port: 1234,
      });
      expect(pass).to.be.true;
      const debuggerCode = fs.readFileSync(debuggerPath, 'utf-8');
      expect(debuggerCode).to.equal(expectedCode);

      pass = injectDebugger.inject('');
      expect(pass).to.be.false;
    });

    it('should revert debugger', () => {
      let pass = injectDebugger.revert(modulePath);
      const debuggerCode = fs.readFileSync(debuggerPath, 'utf-8');
      expect(debuggerCode).to.equal(actualCode);
      expect(pass).to.be.true;

      pass = injectDebugger.revert('');
      expect(pass).to.be.false;
    });
  });
};

describe('Inject debugger', () => versions.forEach(run));
