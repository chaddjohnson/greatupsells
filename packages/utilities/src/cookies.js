import Cookies from 'universal-cookie';

const cookies = new Cookies();

const getCookieDomain = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  // Do not specify host for localhost.
  if (window.location.host.includes('localhost')) {
    return undefined;
  }

  // Use full host as cookies will not be used on multiple domains.
  return window.location.host;
};

export const getCookie = (name) => {
  // This automatically deserializes objects.
  return cookies.get(name);
};

export const setCookie = (name, value, options = {}) => {
  const path = '/';
  const maxAge = 60 * 60 * 24 * 30; // 30 days in relative seconds
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'; // Secure based on protocol.
  const sameSite = 'lax';
  const domain = getCookieDomain(); // Use top-level domain.
  const httpOnly = false; // Allow access on client side.

  // This automatically serializes objects.
  cookies.set(name, value, {
    path,
    maxAge,
    secure,
    sameSite,
    domain,
    httpOnly,
    ...options
  });
};

export const removeCookie = (name) => {
  const path = '/';
  const domain = getCookieDomain();

  cookies.remove(name, { path, domain });
};
