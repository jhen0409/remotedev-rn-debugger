export default function createDevToolsStore(onDispatch) {
  let currentState = {
    actionsById: {},
    computedStates: [],
    currentStateIndex: 0,
    monitorState: {},
    nextActionId: 0,
    skippedActionIds: [],
    stagedActionIds: []
  };
  let listeners = [];
  let initiated = false;

  function dispatch(action) {
    if (action.type[0] !== '@') onDispatch(action);
    return action;
  }

  function getState() {
    return currentState;
  }

  function isSet() {
    return initiated;
  }

  function setState(state) {
    currentState = state;
    listeners.forEach(listener => listener());
    initiated = true;
  }

  function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  return {
    dispatch,
    getState,
    subscribe,
    liftedStore: {
      dispatch,
      getState,
      setState,
      subscribe,
      isSet
    }
  };
}
