import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';

// TODO: Inject jQuery if unavailable and it is needed.

const root = document.createElement('div');
const rootId = 'upselling-popup-root';

root.setAttribute('id', rootId);
document.body.appendChild(root);

ReactDOM.render(<App />, document.getElementById(rootId));
