import { useEffect } from 'react';

const useTimeout = (callback, seconds) => {
  useEffect(() => {
    const timeout = setTimeout(callback, seconds * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [callback, seconds]);
};

export default useTimeout;
