import { useState, useCallback, useEffect } from 'react';

// Reference: https://stackoverflow.com/a/38710376/83897
const useDocumentVisibility = (callback) => {
  const [visible, setVisibility] = useState(true);

  if (!callback) {
    throw new Error('no callback given');
  }

  const focused = useCallback(() => {
    if (!visible) {
      setVisibility(true);
      callback(true);
    }
  }, [callback, visible]);

  const unfocused = useCallback(() => {
    if (visible) {
      setVisibility(false);
      callback(false);
    }
  }, [callback, visible]);

  const listener = useCallback(() => {
    // Standards
    if ('hidden' in document) {
      (document.hidden ? unfocused : focused)();
    }
    if ('mozHidden' in document) {
      (document.mozHidden ? unfocused : focused)();
    }
    if ('webkitHidden' in document) {
      (document.webkitHidden ? unfocused : focused)();
    }
    if ('msHidden' in document) {
      (document.msHidden ? unfocused : focused)();
    }
  }, [focused, unfocused]);

  useEffect(() => {
    // Standards
    if ('hidden' in document) {
      document.addEventListener('visibilitychange', listener);
    }
    if ('mozHidden' in document) {
      document.addEventListener('mozvisibilitychange', listener);
    }
    if ('webkitHidden' in document) {
      document.addEventListener('webkitvisibilitychange', listener);
    }
    if ('msHidden' in document) {
      document.addEventListener('msvisibilitychange', listener);
    }

    // IE 9 and lower
    if ('onfocusin' in document) {
      document.onfocusin = focused;
      document.onfocusout = unfocused;
    }

    // All others
    window.onpageshow = focused; // eslint-disable-line no-multi-assign
    window.onpagehide = unfocused; // eslint-disable-line no-multi-assign

    return () => {
      // Standards
      if ('hidden' in document) {
        document.removeEventListener('visibilitychange', listener);
      }
      if ('mozHidden' in document) {
        document.removeEventListener('mozvisibilitychange', listener);
      }
      if ('webkitHidden' in document) {
        document.removeEventListener('webkitvisibilitychange', listener);
      }
      if ('msHidden' in document) {
        document.removeEventListener('msvisibilitychange', listener);
      }

      // IE 9 and lower
      if ('onfocusin' in document) {
        document.onfocusin = undefined;
        document.onfocusout = undefined;
      }

      // All others
      window.onpageshow = undefined; // eslint-disable-line no-multi-assign
      window.onpagehide = undefined; // eslint-disable-line no-multi-assign
    };
  }, [focused, unfocused, listener]);
};

export default useDocumentVisibility;
