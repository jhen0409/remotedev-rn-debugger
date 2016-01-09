const fs = require('fs');
const ejs = require('ejs');

fs.writeFileSync(
  './debugger.html',
  ejs.render(fs.readFileSync('./debugger.ejs', 'utf-8'), {
    bundleCode: fs.readFileSync('./bundle.js', 'utf-8')
  })
);
