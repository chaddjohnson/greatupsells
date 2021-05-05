import { useState, useCallback, useEffect } from 'react';

const history = typeof window !== 'undefined' && window.history;
const pushState = history?.pushState;

// Listeners must be module-level because history is global.
const listeners = [];

const usePushState = (listener) => {
  const [listenerAdded, setListenerAdded] = useState(false);

  if (listener && !listenerAdded) {
    listeners.push(listener);
    setListenerAdded(true);
  }

  const handlePushState = useCallback((event) => {
    listeners.forEach((current) => current.call(current, event));
  }, []);

  // Reference: https://stackoverflow.com/a/4585031/83897
  useEffect(() => {
    window.addEventListener('popstate', handlePushState, true);
    history.onpushstate = handlePushState;
    history.pushState = (state, ...args) => {
      if (typeof history.onpushstate === 'function') {
        history.onpushstate({ state });
      }
      return pushState.apply(history, [state, ...args]);
    };
    return () => {
      window.removeEventListener('popstate', handlePushState, true);
      history.onpushstate = undefined;
      history.pushState = pushState;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export default usePushState;
