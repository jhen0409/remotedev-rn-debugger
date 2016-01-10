import React from 'react';
import { render } from 'react-dom';
import Dock from 'react-dock';
import DevTools from 'remotedev-app';

render(
  <Dock position="right" isVisible>
    <DevTools/>
  </Dock>,
  document.getElementById('remote-redux-devtools-inject-debugger')
);
