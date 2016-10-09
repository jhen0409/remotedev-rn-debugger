import fs from 'fs';
import path from 'path';
import startRemoteDev from 'remotedev-server';

const readFile = filePath =>
  fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');

export default (options) => {
  const { protocol, key, cert } = options;
  const opts = {
    ...options,
    ...(
      protocol === 'https' ? {
        key: key ? readFile(key) : null,
        cert: cert ? readFile(cert) : null,
      } : null
    ),
  };
  return startRemoteDev(opts);
};
