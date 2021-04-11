import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import Link from './Link';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    right: theme.spacing(6),
    bottom: theme.spacing(6)
  }
}));

const AddButton = ({ className, color, ...props }) => {
  const classes = useStyles();

  return (
    <Fab
      className={clsx(classes.root, className)}
      color={color}
      component={Link}
      {...props}
    >
      <AddIcon />
    </Fab>
  );
};

AddButton.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string
};

AddButton.defaultProps = {
  color: 'primary'
};

export default AddButton;
