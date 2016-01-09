#! /usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../debugger.html');
const distPath = path.join(process.cwd(), 'node_modules/react-native/local-cli/server/util/debugger.html');

fs.writeFileSync(distPath, fs.readFileSync(filePath));
