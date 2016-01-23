# Remote Redux DevTools monitor on React Native Debugger UI

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

The `hostname`, `port` is optional, when you open `debugger-ui`, will connect to your [remotedev server](https://github.com/zalmoxisus/remotedev-server) point with options (you can also set in the UI). if you not set `hostname`, it will apply [default options](https://github.com/zalmoxisus/remotedev-app/blob/master/src/app/constants/socketOptions.js).

## Use custom options in React Native project

You can ignore this guide if you used [default options](https://github.com/zalmoxisus/remotedev-app/blob/master/src/app/constants/socketOptions.js).

#### Install dev dependencies

```bash
$ npm install --save-dev remote-redux-devtools remotedev-server remote-redux-devtools-on-debugger
```

#### Add to scripts field (package.json)

```json
"debugger-replace": "remotedev-debugger-replace --hostname localhost --port 5678",
"remotedev": "npm run debugger-replace && remotedev --hostname localhost --port 5678",
```

If you debug on real device, you should use LAN IP instead of `localhost`.

#### Edit configureStore.js

```js
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import reducer from '../reducers';

export default function configureStore(initialState) {
  const finalCreateStore = compose(
    applyMiddleware(thunk),
    devTools({
      name: 'InstanceNameHere',
      hostname: 'localhost',
      port: 5678
    })
  )(createStore);
  return finalCreateStore(reducer, initialState);
}
```

On Android, you should use `10.0.2.2` (Genymotion: `10.0.3.2`) instead of `localhost`.

#### Run

```bash
$ npm run remotedev
# on another terminal tab
$ npm start
```

You can reference [this example](https://github.com/jhen0409/react-native-boilerplate/blob/master/package.json).

## License

[MIT](LICENSE)
