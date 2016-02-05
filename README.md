# Remote Redux DevTools monitor on React Native Debugger UI

[![NPM version](http://img.shields.io/npm/v/remote-redux-devtools-on-debugger.svg?style=flat)](https://www.npmjs.com/package/remote-redux-devtools-on-debugger)
[![Dependency Status](https://david-dm.org/jhen0409/remote-redux-devtools-on-debugger.svg)](https://david-dm.org/jhen0409/remote-redux-devtools-on-debugger)
[![devDependency Status](https://david-dm.org/jhen0409/remote-redux-devtools-on-debugger/dev-status.svg)](https://david-dm.org/jhen0409/remote-redux-devtools-on-debugger#info=devDependencies)

![Demo](demo.gif)

Inject [remote-redux-devtools](https://github.com/zalmoxisus/remote-redux-devtools) monitor to React Native debugger. The monitor is used [remotedev-app](https://github.com/zalmoxisus/remotedev-app).

## Installation

```bash
$ npm install -g remote-redux-devtools-on-debugger
```

## Usage

```bash
$ remotedev-debugger-replace --hostname localhost --port 5678
```

The `./node_modules/react-native/local-cli/server/util/debugger.html` will be replaced.

#### Options

* --hostname: the [remotedev-server](https://github.com/zalmoxisus/remotedev-server) hostname, will apply `debugger.html` settings.
* --port: the [remotedev-server](https://github.com/zalmoxisus/remotedev-server) port, will apply `debugger.html` settings.
* --runserver: if you have set `hostname`, will start the [remotedev-server](https://github.com/zalmoxisus/remotedev-server) with options on local.
* --desktop: replace [react-native-desktop](https://github.com/ptmt/react-native-desktop) debugger.

If you not set `hostname`, it will apply [default options](https://github.com/zalmoxisus/remotedev-app/blob/master/src/app/constants/socketOptions.js).

## Use custom options in React Native project

You can ignore this guide if you used [default options](https://github.com/zalmoxisus/remotedev-app/blob/master/src/app/constants/socketOptions.js).

#### Install dev dependencies

```bash
$ npm install --save-dev remote-redux-devtools remote-redux-devtools-on-debugger
```

#### Add to scripts field (package.json)

```json
"remotedev": "remotedev-debugger --hostname localhost --port 5678 --runserver",
```

If you debug on real device, you should use LAN IP instead of `localhost`.

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

#### Run

```bash
$ npm run remotedev
# on another terminal tab
$ npm start
```

You can reference [this example](https://github.com/jhen0409/react-native-boilerplate/blob/master/package.json).

## License

[MIT](LICENSE)
