import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import injectDebugger from '../bin/injectDebugger';

const versions = ['0.21'];
const fixturePath = 'fixtures/debugger';

const run = version => {
  describe(`RN v${version} ${injectDebugger.path}`, () => {
    const actualCode = fs.readFileSync(
      path.join(__dirname, fixturePath, `${version}.actual.html`),
      'utf-8'
    );
    const expectedCode = fs.readFileSync(
      path.join(__dirname, fixturePath, `${version}.expected.html`),
      'utf-8'
    );
    const modulePath = path.join(__dirname, 'temp', version);
    const dirPath = path.join(modulePath, injectDebugger.dir);
    const debuggerPath = path.join(dirPath, injectDebugger.file);
    fs.mkdirsSync(dirPath);
    fs.writeFileSync(debuggerPath, actualCode);

    it('should inject debugger', () => {
      let pass = injectDebugger.inject(modulePath, '__THIS_IS_A_BUNDLE_CODE__', {
        hostname: 'test',
        port: 1234,
        autoReconnect: true,
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
