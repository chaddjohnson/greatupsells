import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),

    '& > :not(:first-of-type)': {
      marginLeft: theme.spacing(2)
    }
  }
}));

const FormActions = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
};

FormActions.propTypes = {
  children: PropTypes.node.isRequired
};

export default FormActions;
