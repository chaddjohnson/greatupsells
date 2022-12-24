const cache =
  (typeof window !== 'undefined' &&
    localStorage.getItem('greatupsellsCache') &&
    JSON.parse(localStorage.getItem('greatupsellsCache'))) ||
  {};

const useCache = () => {
  const getCache = (key) => {
    const { data, expiresAt } = cache[key] || {};
    const cacheExpired = !!expiresAt && new Date(expiresAt) < new Date();

    if (!data || cacheExpired) {
      return;
    }

    return data;
  };

  const setCache = (key, data, expiresAt) => {
    if (expiresAt) {
      expiresAt = new Date(expiresAt).toISOString();
    }

    cache[key] = { data, expiresAt };
    localStorage.setItem('greatupsellsCache', JSON.stringify(cache));
  };

  return { getCache, setCache };
};

export default useCache;
