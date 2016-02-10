import React from 'react';
import { render } from 'react-dom';
import Dock from 'react-dock';
import DevTools from 'remotedev-app';

// Now disabled buttonbar
// prevent setting from previous UI settings
localStorage.removeItem('s:hostname');
localStorage.removeItem('s:port');

render(
  <Dock position="right" dimMode="transparent" defaultSize={0.5} isVisible>
    <DevTools socketOptions={window.remotedevOptions} noButtonBar />
  </Dock>,
  document.getElementById('remote-redux-devtools-on-debugger')
);
