import React from 'react';
import { render } from 'preact';
import App from './App';

let initialized = false;

const init = () => {
  if (initialized) {
    return;
  }

  initialized = true;

  const container = document.createElement('div');
  const containerId = 'greatupsells-popup-container';

  container.setAttribute('id', containerId);
  document.body.appendChild(container);

  render(<App />, container);
};

// Initialize when document becomes ready.
document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    init();
  }
};

// Initialize now if document is ready.
if (document.readyState === 'complete') {
  init();
}
