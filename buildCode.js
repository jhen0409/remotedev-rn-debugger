const fs = require('fs');
const key = '__remotedevBundleCode__';
const bundleCode = fs.readFileSync('./bundle.js', 'utf-8');
const html = fs.readFileSync('./debugger.tmpl.html', 'utf-8');

fs.writeFileSync('./debugger.html', html.replace(key, bundleCode));
