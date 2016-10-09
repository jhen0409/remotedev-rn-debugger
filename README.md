# Remote Redux DevTools monitor on React Native Debugger

[![Build Status](https://travis-ci.org/jhen0409/remote-redux-devtools-on-debugger.svg?branch=master)](https://travis-ci.org/jhen0409/remote-redux-devtools-on-debugger)
[![NPM version](http://img.shields.io/npm/v/remote-redux-devtools-on-debugger.svg?style=flat)](https://www.npmjs.com/package/remote-redux-devtools-on-debugger)
[![Dependency Status](https://david-dm.org/jhen0409/remote-redux-devtools-on-debugger.svg)](https://david-dm.org/jhen0409/remote-redux-devtools-on-debugger)
[![devDependency Status](https://david-dm.org/jhen0409/remote-redux-devtools-on-debugger/dev-status.svg)](https://david-dm.org/jhen0409/remote-redux-devtools-on-debugger?type=dev)

![Demo](https://cloud.githubusercontent.com/assets/3001525/14691258/d38b0f0c-0782-11e6-8602-8ef5e1511bf1.png)

Injecting [remote-redux-devtools](https://github.com/zalmoxisus/remote-redux-devtools) / [remotedev](https://github.com/zalmoxisus/remotedev) monitor into React Native debugger. The monitor is used [remotedev-app](https://github.com/zalmoxisus/remotedev-app).

## Installation

```bash
$ npm install --save-dev remote-redux-devtools-on-debugger
```

## Usage

Add command to your project's package.json:

```
"scripts": {
  "postinstall": "remotedev-debugger [options]"
}
```

It will be run after `npm install`. (You can run `npm run postinstall` first)  
The `./node_modules/react-native/local-cli/server/util/debugger.html` will be replaced.

#### Options (--option)

Name | Description
--- | ---
hostname | The [remotedev-server](https://github.com/zalmoxisus/remotedev-server) hostname. (*default*: `localhost` if `port` is set)
port | The [remotedev-server](https://github.com/zalmoxisus/remotedev-server) port. (*default*: `8000` if `runserver` or `hostname` is set)
runserver | Start the [remotedev-server](https://github.com/zalmoxisus/remotedev-server) with `hostname`, `port` option on local. (*default*: `false`)
secure | Use https protocol for `hostname`. If you're use `runserver` or `injectserver` option, you can provide `key`, `cert`, `passphrase` options for `remotedev-server`. (*default*: `false`)
injectserver | Inject [remotedev-server](https://github.com/zalmoxisus/remotedev-server) with `hostname`, `port` option to `node_modules/react-native/local-cli/server/server.js`, then you can start ReactNative local server and RemoteDev local server with one command (`$ npm start`). (*default*: `false`)
injectdebugger | Inject [remotedev-app](https://github.com/zalmoxisus/remotedev-app) with `hostname`, `port` option to `node_modules/react-native/local-cli/server/util/debugger.html`. (*default*: `true`)
macos | Use [react-native-macos](https://github.com/ptmt/react-native-macos) module name instead of react-native. (*default*: `false`)
revert | Revert all injection. (*default*: `false`)

If you not set `hostname` or `port` or `runserver` or `injectserver`, it will apply [default options](https://github.com/zalmoxisus/remotedev-app/blob/master/src/app/constants/socketOptions.js).

## Example - Use custom options in React Native project

You can ignore this guide if you used [default options](https://github.com/zalmoxisus/remotedev-app/blob/master/src/app/constants/socketOptions.js).

#### Install dev dependencies

```bash
$ npm install --save-dev remote-redux-devtools
$ npm install --save-dev remote-redux-devtools-on-debugger
```

#### Add command

Add command to your project's package.json:

```
"scripts": {
  "postinstall": "remotedev-debugger --hostname localhost --port 5678 --injectserver"
}
```

It will be run after `npm install`. (You can run `npm run postinstall` first)  
If you debug on real device, you should use LAN IP as a `hostname`.

#### Edit configureStore.js

```js
import { Platform } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import reducer from '../reducers';

export default function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(thunk),
    devTools({
      name: Platform.OS,
      hostname: 'localhost',
      port: 5678
    })
  );
  return createStore(reducer, initialState, enhancer);
}
```

You can reference [this example](https://github.com/jhen0409/react-native-boilerplate/blob/master/package.json).

## License

[MIT](LICENSE)
