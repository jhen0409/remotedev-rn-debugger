import createDevStore from './createDevStore.js';
import updateState from './updateState';
import { subscribe, dispatchRemotely } from '../services/messaging';

export default function createRemoteStore() {
  const store = createDevStore(dispatchRemotely);
  subscribe(msg => {
    updateState(store, msg);
  });
  return store;
}
