import PropTypes from 'prop-types';
import NextLink from 'next/link';

const dynamicHrefs = [
  {
    regex: /^\/offers\/[a-z0-9]+\/analytics\/?$/,
    href: '/offers/[id]/analytics'
  },
  {
    regex: /^\/offers\/[a-z0-9]+\/?$/,
    href: '/offers/[id]'
  }
];

const Link = ({ url, external, children, ...props }) => {
  if (external || url.match(/^https?:/)) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  } else {
    const dynamicHref = dynamicHrefs.find(({ regex }) => url.match(regex));
    const href = (dynamicHref && dynamicHref.href) || url;
    const as = url;

    return (
      <NextLink href={href} as={as} prefetch={false}>
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
