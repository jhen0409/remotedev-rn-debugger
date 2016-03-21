#! /usr/bin/env node

const argv = require('minimist')(process.argv.slice(2), {
  boolean: ['runserver', 'injectserver', 'injectdebugger', 'desktop', 'revert'],
  default: {
    injectdebugger: true,
  },
});
require('./debugger')(argv);
