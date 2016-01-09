import React from 'react';
import { render } from 'react-dom';
import Dock from 'react-dock';
import DevTools from '../app/containers/DevTools';
import createRemoteStore from '../app/store/createRemoteStore.js';
const store = createRemoteStore();

render(
  <Dock position="right" isVisible>
    <DevTools store={store}/>
  </Dock>,
  document.getElementById('remote-redux-devtools-inject-debugger')
);
