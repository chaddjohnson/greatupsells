import React from 'react';
import ReactDOM from 'react-dom';
import { Banner } from '@neatowebsolutions/upselling-react-components';

const root = document.createElement('div');

root.setAttribute('id', 'upselling-banner-root');
document.body.appendChild(root);

ReactDOM.render(<Banner />, document.getElementById('upselling-banner-root'));
