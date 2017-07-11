import React from 'react';
import PropTypes from 'prop-types';
import { getFromStorage, saveToStorage } from 'remotedev-app/lib/utils/localStorage';
import { render } from 'react-dom';
import Dock from 'react-dock';
import DevTools from 'remotedev-app';
import parseKey from 'parse-key';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/night.css';
import './app.css';

const positionKeys = ['right', 'bottom', 'left', 'top'];

function saveStorage(state) {
  saveToStorage('remotedev-dock-size', state.size);
  saveToStorage('remotedev-dock-position', state.position);
}

function matchesKey(key, event) {
  if (!key) {
    return false;
  }

  const charCode = event.keyCode || event.which;
  const char = String.fromCharCode(charCode);
  return (
    key.name.toUpperCase() === char.toUpperCase() &&
    key.alt === event.altKey &&
    key.ctrl === event.ctrlKey &&
    key.meta === event.metaKey &&
    key.shift === event.shiftKey
  );
}

class DevToolsDock extends React.Component {
  static propTypes = {
    size: PropTypes.number,
    position: PropTypes.number,
    options: PropTypes.object,
  };

  static defaultProps = {
    size: Number(getFromStorage('remotedev-dock-size')),
    position: Number(getFromStorage('remotedev-dock-position')),
    options: window.remotedevOptions,
  };

  constructor(props) {
    super(props);
    this.state = {
      size: props.size || 0.5,
      position: props.position || 0,
      visible: true,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate() {
    saveStorage(this.state);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible });
  changePosition = () =>
    this.setState({ position: (this.state.position + 1) % positionKeys.length });

  handleKeyDown = (e) => {
    if (
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      (e.target.tagName === 'INPUT' ||
        e.target.tagName === 'SELECT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable)
    ) {
      return;
    }

    const visibilityKey = parseKey('ctrl-h');
    const positionKey = parseKey('ctrl-q');

    if (matchesKey(visibilityKey, e)) {
      e.preventDefault();
      this.toggleVisibility();
    } else if (matchesKey(positionKey, e)) {
      e.preventDefault();
      this.changePosition();
    }
  };

  handleSizeChange = (eventSize) => {
    let size = eventSize > 1 ? 1 : eventSize;
    size = size < 0.1 ? 0.1 : size;
    this.setState({ size });
  };

  render() {
    return (
      <Dock
        zIndex={500} // Must be less than material-ui z-index
        position={positionKeys[this.state.position]}
        dimMode="none"
        size={this.state.size}
        isVisible={this.state.visible}
        onSizeChange={this.handleSizeChange}
      >
        <div className="redux-container">
          <DevTools useCodemirror noSettings socketOptions={this.props.options} />
        </div>
      </Dock>
    );
  }
}

render(<DevToolsDock />, document.getElementById('remote-redux-devtools-on-debugger'));
