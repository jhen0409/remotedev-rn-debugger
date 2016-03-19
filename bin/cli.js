#! /usr/bin/env node

const argv = require('minimist')(process.argv.slice(2), {
  boolean: ['runserver', 'injectserver', 'desktop', 'revert'],
});
require('./debugger')(argv);
