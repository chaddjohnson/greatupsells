import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

let initialized = false;

const init = () => {
  if (initialized) {
    return;
  }

  initialized = true;

  const root = document.createElement('div');
  const rootId = 'greatupsells-popup-root';

  root.setAttribute('id', rootId);
  document.body.appendChild(root);

  ReactDOM.render(<App />, document.getElementById(rootId));
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
