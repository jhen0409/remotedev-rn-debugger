const getport = require('getport');
const startRemoteDev = require('remotedev-server');

module.exports = options => {
  const port = options.port;
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
        resolve(startRemoteDev(options));
      }
    });
  });
};
