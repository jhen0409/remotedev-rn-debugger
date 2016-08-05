import React, { Component, PropTypes } from 'react';
import {
  getFromStorage, saveToStorage,
} from 'remotedev-app/lib/utils/localStorage';
import styles from 'remotedev-app/lib/styles';
import enhance from 'remotedev-app/lib/hoc';
import DevTools from 'remotedev-app/lib/containers/DevTools';
import Dispatcher from 'remotedev-app/lib/containers/monitors/Dispatcher';
import {
  createRemoteStore, updateStoreInstance, enableSync, startMonitoring,
} from 'remotedev-app/lib/store/createRemoteStore';
import Instances from 'remotedev-app/lib/components/Instances';
import MonitorSelector from 'remotedev-app/lib/components/MonitorSelector';
import SyncToggle from 'remotedev-app/lib/components/SyncToggle';

import DispatcherButton from 'remotedev-app/lib/components/buttons/DispatcherButton';
import SliderButton from 'remotedev-app/lib/components/buttons/SliderButton';
import ImportButton from 'remotedev-app/lib/components/buttons/ImportButton';
import ExportButton from 'remotedev-app/lib/components/buttons/ExportButton';
import TestGenerator from 'remotedev-app/lib/components/TestGenerator';

class App extends Component {
  static propTypes = {
    selectMonitor: PropTypes.string,
    socketOptions: PropTypes.shape({
      hostname: PropTypes.string,
      port: PropTypes.number,
      autoReconnect: PropTypes.bool,
      secure: PropTypes.bool,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      monitor: getFromStorage('select-monitor') || props.selectMonitor || 'default',
      modalIsOpen: false,
      dispatcherIsOpen: false,
      sliderIsOpen: true,
      instances: {},
      instance: null,
      shouldSync: false,
      error: null,
    };
    this.socketOptions = props.socketOptions;
    this.store = this.createStore();
    this.testComponent = p => (
      <TestGenerator
        name={this.state.instances[this.state.instance || this.store.liftedStore.getInstance()]}
        store={this.store}
        useCodemirror
        testTemplates={getFromStorage('test-templates')}
        selectedTemplate={getFromStorage('test-templates-sel')}
        {...p}
      />
    );
  }

  handleError = error => {
    this.setState({ error });
  };

  clearError = () => {
    this.setState({ error: null });
  };

  handleInstancesChanged = (instance, name, toRemove) => {
    const instances = this.state.instances;
    if (toRemove) {
      delete instances[instance];
      this.store.liftedStore.deleteInstance(instance);
      if (this.state.instance === instance) {
        updateStoreInstance(null);
        this.setState({ instance: null, shouldSync: false, instances });
        return;
      }
    } else {
      instances[instance] = name || instance;
      startMonitoring(instance);
    }
    this.setState({ instances });
  };

  handleSelectInstance = (event, index, instance) => {
    updateStoreInstance(instance);
    this.setState({ instance, shouldSync: false });
  };

  handleSelectMonitor = (event, index, value) => {
    this.setState({ monitor: saveToStorage('select-monitor', value) });
  };

  handleSyncToggle = () => {
    const shouldSync = !this.state.shouldSync;
    enableSync(shouldSync);
    this.setState({ shouldSync });
  };

  createStore = () =>
    createRemoteStore(
      this.socketOptions,
      this.handleInstancesChanged,
      this.handleError,
      this.state.instance
    );

  saveSettings = (isLocal, options) => {
    this.socketOptions = saveToStorage(
      !isLocal, ['hostname', 'port', 'secure'], options
    ) || undefined;
    this.store = this.createStore();
    this.closeModal();
  };

  toggleDispatcher = () =>
    this.setState({ dispatcherIsOpen: !this.state.dispatcherIsOpen });

  toggleSlider = () =>
    this.setState({ sliderIsOpen: !this.state.sliderIsOpen });

  openModal = content => {
    this.modalContent = content;
    this.setState({ modal: this.modal, modalIsOpen: true });
  };

  closeModal = () => {
    this.modalContent = null;
    this.setState({ modalIsOpen: false });
  };

  render() {
    const { error, monitor } = this.state;
    const key = (this.socketOptions ? this.socketOptions.hostname : '') + this.state.instance;
    return (
      <div style={styles.container}>
        <div style={styles.buttonBar}>
          <MonitorSelector selected={this.state.monitor} onSelect={this.handleSelectMonitor} />
          <Instances
            instances={this.state.instances} onSelect={this.handleSelectInstance}
            selected={this.state.instance}
          />
          <SyncToggle
            on={this.state.shouldSync}
            onClick={this.handleSyncToggle}
            style={!this.state.instance ? { display: 'none' } : null}
          />
        </div>
        <DevTools
          monitor={monitor}
          store={this.store}
          key={`${monitor}-${key}`}
          testComponent={this.testComponent}
        />
        {this.state.sliderIsOpen && <div style={styles.sliderMonitor}>
          <DevTools monitor="SliderMonitor" store={this.store} key={`Slider-${key}`} />
        </div>}
        {this.state.dispatcherIsOpen && this.store.liftedStore.getInstance() &&
          <Dispatcher
            store={this.store}
            error={error}
            clearError={this.clearError}
            key={`Dispatch-${key}`}
          />
        }
        <div style={styles.buttonBar}>
          <DispatcherButton
            dispatcherIsOpen={this.state.dispatcherIsOpen}
            onClick={this.toggleDispatcher}
          />
          <SliderButton
            isOpen={this.state.sliderIsOpen}
            onClick={this.toggleSlider}
          />
          <ImportButton importState={this.store.liftedStore.importState} />
          <ExportButton exportState={this.store.liftedStore.getState} />
        </div>
      </div>
    );
  }
}

export default enhance(App);
