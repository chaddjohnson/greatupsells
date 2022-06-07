import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const handleLink = (context, child) => {
  const { rel, href } = child.props;
  let link = null;
  const documentContext =
    context?.contentWindow?.document ||
    context?.contentDocument ||
    context?.document;

  if (!documentContext) {
    return;
  }
  if (rel !== 'stylesheet') {
    return;
  }

  link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;

  documentContext.head.appendChild(link);

  return () => {
    if (documentContext) {
      documentContext.head.removeChild(link);
    }
  };
};

const Head = ({ context, children }) => {
  context = context || window;

  useEffect(() => {
    let handler = () => {};

    React.Children.forEach(children, (child) => {
      switch (child.type) {
        case 'link':
          handler = handleLink(context, child);
          break;
        default:
          break;
      }
    });

    return handler;
  }, [context, children]);

  return null;
};

Head.propTypes = {
  context: PropTypes.object,
  children: PropTypes.node
};

export default Head;
