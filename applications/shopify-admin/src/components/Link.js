import PropTypes from 'prop-types';
import NextLink from 'next/link';

const Link = ({ url, external, children, ...props }) => {
  if (external || url.match(/^https?:/)) {
    return (
      <NextLink href={url}>
        <a target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      </NextLink>
    );
  } else {
    return (
      <NextLink href={url}>
        <a {...props}>{children}</a>
      </NextLink>
    );
  }
};

Link.propTypes = {
  url: PropTypes.string.isRequired,
  external: PropTypes.bool,
  children: PropTypes.element.isRequired
};

Link.defaultProps = {
  external: false
};

export default Link;
