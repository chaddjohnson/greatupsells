import { useEffect } from 'react';

const useEventListener = (event, listener, options) => {
  useEffect(() => {
    if (document.addEventListener) {
      document.addEventListener(event, listener, options);
    } else if (document.attachEvent) {
      document.attachEvent(event, listener);
    }

    return () => {
      if (document.removeEventListener) {
        document.removeEventListener(event, listener, options);
      } else if (document.detachEvent) {
        document.detachEvent(event, listener);
      }
    };
  }, [event, listener, options]);
};

export default useEventListener;
