#! /usr/bin/env node

var argv = require('minimist')(process.argv.slice(2), {
  boolean: ['secure', 'runserver', 'injectserver', 'injectdebugger', 'desktop', 'macos', 'revert'],
  default: {
    injectdebugger: true,
  },
});

argv.hostname = argv.hostname || process.env.npm_package_remotedev_hostname;
argv.port = Number(argv.port || process.env.npm_package_remotedev_port);
argv.secure = argv.secure || !!process.env.npm_package_remotedev_secure;

var result = require('../lib/main')(argv);
if (!result) process.exit(1);
