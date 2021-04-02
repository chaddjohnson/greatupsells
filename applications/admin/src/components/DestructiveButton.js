import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RED from '@material-ui/core/colors/red';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: RED[600],
    color: '#FFFFFF',

    '&:hover': {
      backgroundColor: RED[900]
    }
  }
}));

const DestructiveButton = ({ className, children, ...props }) => {
  const classes = useStyles();

  return (
    <Button className={clsx(classes.root, className)} {...props}>
      {children}
    </Button>
  );
};

DestructiveButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

export default DestructiveButton;
