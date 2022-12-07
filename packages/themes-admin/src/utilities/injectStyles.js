const stylesCache = {};

const injectStyles = (themeKey) => {
  const iframes = Array.from(document.getElementsByClassName('offer-iframe'));
  const parentStyleElement = document.getElementById('offer-styles');
  let styleElement = null;
  const styleElements = [];

  if (iframes.length > 0) {
    iframes.forEach((iframe) => {
      styleElement = iframe.contentDocument.createElement('style');
      stylesCache[themeKey] =
        stylesCache[themeKey] || parentStyleElement?.textContent;
      styleElement.textContent = stylesCache[themeKey];
      iframe.contentDocument.head.appendChild(styleElement);
      styleElements.push({
        parent: iframe.contentDocument.head,
        element: styleElement
      });
    });
  }

  // Prevent checkout-ui-react styles from interfering with the admin app.
  if (parentStyleElement) {
    parentStyleElement.remove();
  }

  return () => {
    styleElements.forEach(({ parent, element }) => {
      parent.removeChild(element);
    });
  };
};

export default injectStyles;
