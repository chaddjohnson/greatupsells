import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    right: theme.spacing(6),
    bottom: theme.spacing(6)
  }
}));

const AddButton = ({ className, color = 'primary', ...props }) => {
  const classes = useStyles();

  return (
    <Fab className={clsx(classes.root, className)} color={color} {...props}>
      <AddIcon />
    </Fab>
  );
};

AddButton.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string
};

export default AddButton;
