const injectStyles = () => {
  const iframes = Array.from(document.getElementsByClassName('offer-iframe'));
  const parentStyleElement = document.getElementById('offer-styles');
  let styleElement = null;
  const styleElements = [];

  if (iframes.length > 0) {
    iframes.forEach((iframe) => {
      styleElement = iframe.contentDocument.createElement('style');
      styleElement.innerText = parentStyleElement.innerText;
      iframe.contentDocument.head.appendChild(styleElement);
      styleElements.push({
        parent: iframe.contentDocument.head,
        element: styleElement
      });
    });
  }

  return () => {
    styleElements.forEach(({ parent, element }) => {
      parent.removeChild(element);
    });
  };
};

export default injectStyles;
