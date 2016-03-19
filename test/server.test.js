import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import injectServer from '../bin/injectServer';

const versions = ['0.21'];
const fixturePath = 'fixtures/server';

const run = version => {
  describe(`RN v${version} local-cli/server/server.js`, () => {
    const actualCode = fs.readFileSync(
      path.join(__dirname, fixturePath, `${version}.actual.js`),
      'utf-8'
    );
    const expectedCode = fs.readFileSync(
      path.join(__dirname, fixturePath, `${version}.expected.js`),
      'utf-8'
    );
    const modulePath = `${__dirname}/temp/${version}`;
    const dirPath = `${modulePath}/local-cli/server`;
    const serverPath = path.join(dirPath, 'server.js');
    fs.mkdirsSync(dirPath);
    fs.writeFileSync(serverPath, actualCode);

    it('should inject server', () => {
      injectServer.inject(modulePath, {
        hostname: 'test',
        port: 1234,
      });
      const serverCode = fs.readFileSync(serverPath, 'utf-8');
      expect(serverCode).to.equal(expectedCode);
    });

    it('should revert server', () => {
      injectServer.revert(modulePath);
      const serverCode = fs.readFileSync(serverPath, 'utf-8');
      expect(serverCode).to.equal(actualCode);
    });
  });
};

describe('Inject server', () => versions.forEach(run));
