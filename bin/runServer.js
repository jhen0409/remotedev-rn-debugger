const fs = require('fs');
const path = require('path');
const getport = require('getport');
const startRemoteDev = require('remotedev-server');

const readFile = filePath =>
  fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');

module.exports = options => {
  const port = options.port;
  const opts = Object.assign({}, options, options.protocol !== 'https' ? null : {
    key: options.key ? readFile(options.key) : null,
    cert: options.cert ? readFile(options.cert) : null,
  });
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
