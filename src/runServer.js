import fs from 'fs';
import path from 'path';
import getport from 'getport';
import startRemoteDev from 'remotedev-server';

const readFile = filePath =>
  fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');

export default options => {
  const { port, protocol, key, cert } = options;
  const opts = {
    ...options,
    ...(
      protocol === 'https' ? {
        key: key ? readFile(key) : null,
        cert: cert ? readFile(cert) : null,
      } : null
    ),
  };
  return new Promise(resolve => {
    // Check port already used
    getport(port, (err, p) => {
      if (err) return console.error(err);
      if (port !== p) {
        console.log(`[RemoveDev] Server port ${port} is already used.`);
        resolve({ portAlreadyUsed: true, on: (status, cb) => cb() });
      } else {
        console.log('[RemoveDev] Server starting...');
        console.log('-'.repeat(80) + '\n');
        resolve(startRemoteDev(opts));
      }
    });
  });
};
