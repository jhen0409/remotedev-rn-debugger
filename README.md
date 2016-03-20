# Remote Redux DevTools monitor on React Native Debugger UI

[![Build Status](https://travis-ci.org/jhen0409/remote-redux-devtools-on-debugger.svg)](https://travis-ci.org/jhen0409/remote-redux-devtools-on-debugger)
[![NPM version](http://img.shields.io/npm/v/remote-redux-devtools-on-debugger.svg?style=flat)](https://www.npmjs.com/package/remote-redux-devtools-on-debugger)
[![Dependency Status](https://david-dm.org/jhen0409/remote-redux-devtools-on-debugger.svg)](https://david-dm.org/jhen0409/remote-redux-devtools-on-debugger)
[![devDependency Status](https://david-dm.org/jhen0409/remote-redux-devtools-on-debugger/dev-status.svg)](https://david-dm.org/jhen0409/remote-redux-devtools-on-debugger#info=devDependencies)

![Demo](demo.gif)

Inject [remote-redux-devtools](https://github.com/zalmoxisus/remote-redux-devtools) / [remotedev](https://github.com/zalmoxisus/remotedev) monitor to React Native debugger. The monitor is used [remotedev-app](https://github.com/zalmoxisus/remotedev-app).

## Installation

```bash
$ npm install -g remote-redux-devtools-on-debugger
```

## Usage

```bash
$ remotedev-debugger [options]
```

The `./node_modules/react-native/local-cli/server/util/debugger.html` will be replaced.

#### Options

* --hostname: the [remotedev-server](https://github.com/zalmoxisus/remotedev-server) hostname, will apply `debugger.html` settings.  
(default: `localhost` if `port` is set)
* --port: the [remotedev-server](https://github.com/zalmoxisus/remotedev-server) port, will apply `debugger.html` settings.  
(default: `8000` if `runserver` or `hostname` is set)
* --runserver: start the [remotedev-server](https://github.com/zalmoxisus/remotedev-server) with `hostname`, `port` option on local.
* --injectserver: inject [remotedev-server](https://github.com/zalmoxisus/remotedev-server) with `hostname`, `port` option to `./node_modules/react-native/local-cli/server/server.js`, then you can start ReactNative local server and RemoteDev local server with one command (`$ npm start`).
* --desktop: replace [react-native-desktop](https://github.com/ptmt/react-native-desktop) debugger.
* --revert: revert all injection.

If you not set `hostname` or `port`, it will apply [default options](https://github.com/zalmoxisus/remotedev-app/blob/master/src/app/constants/socketOptions.js).

## Use custom options in React Native project

You can ignore this guide if you used [default options](https://github.com/zalmoxisus/remotedev-app/blob/master/src/app/constants/socketOptions.js).

#### Install dev dependencies

```bash
$ npm install --save-dev remote-redux-devtools
$ npm install --save-dev remote-redux-devtools-on-debugger # or global
```

#### Add command

Add command to package.json:

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
