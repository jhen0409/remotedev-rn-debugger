import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import * as injectServer from '../src/injectServer';

const versions = ['0.21', '0.31'];
const fixturePath = 'fixtures/server';

const run = version => {
  describe(`RN v${version} ${injectServer.fullPath}`, () => {
    const actualCode = fs.readFileSync(
      path.join(__dirname, fixturePath, `${version}.actual.js`),
      'utf-8'
    );
    const expectedCode = fs.readFileSync(
      path.join(__dirname, fixturePath, `${version}.expected.js`),
      'utf-8'
    );
    const modulePath = path.join(__dirname, 'temp', version);
    const dirPath = path.join(modulePath, injectServer.dir);
    const serverPath = path.join(dirPath, injectServer.file);
    const pkgPath = path.join(modulePath, 'package.json');
    fs.mkdirsSync(dirPath);
    fs.writeFileSync(serverPath, actualCode);
    fs.writeFileSync(pkgPath, `{ "version": "${version}.0-rc.1" }`);

    it('should inject server', () => {
      let pass = injectServer.inject(modulePath, {
        hostname: 'test',
        port: 1234,
      });
      expect(pass).to.be.true;
      const serverCode = fs.readFileSync(serverPath, 'utf-8');
      expect(serverCode).to.equal(expectedCode);

      pass = injectServer.inject('');
      expect(pass).to.be.false;
    });

    it('should revert server', () => {
      let pass = injectServer.revert(modulePath);
      expect(pass).to.be.true;
      const serverCode = fs.readFileSync(serverPath, 'utf-8');
      expect(serverCode).to.equal(actualCode);

      pass = injectServer.revert('');
      expect(pass).to.be.false;
    });
  });
};

describe('Inject server', () => versions.forEach(run));
