import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CodeEditor from './CodeEditor';
import Preview from './Preview';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    flexDirection: 'column',

    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row'
    }
  },
  gridItem: {
    maxWidth: `calc(100vw - ${theme.spacing(3)}px)`,

    [theme.breakpoints.up('lg')]: {
      maxWidth: '50%'
    }
  },
  paper: {
    width: '100%',
    height: '50vh',
    minHeight: '500px',

    [theme.breakpoints.up('lg')]: {
      height: `calc(100vh - (64px + 48px + ${theme.spacing(8)}px))`
    }
  },
  editor: {
    height: '100%',

    '& > .CodeMirror': {
      height: '100%',
      fontSize: '13px'
    }
  },
  preview: {
    width: '100%',
    height: '100%',
    border: 'none'
  }
}));

const PopupTemplateEditor = ({ popupTheme, onChange }) => {
  const classes = useStyles();

  const handleChange = (template) => {
    onChange({ ...popupTheme, template });
  };

  return (
    <Grid className={classes.root} container spacing={3}>
      <Grid className={classes.gridItem} item xs={12} sm={6}>
        <Paper className={classes.paper}>
          <CodeEditor
            className={classes.editor}
            value={popupTheme.template}
            onChange={handleChange}
          />
        </Paper>
      </Grid>
      <Grid className={classes.gridItem} item xs={12} sm={6}>
        <Paper className={classes.paper}>
          <Preview className={classes.preview} popupTheme={popupTheme} />
        </Paper>
      </Grid>
    </Grid>
  );
};

PopupTemplateEditor.propTypes = {
  popupTheme: PropTypes.object,
  onChange: PropTypes.func
};

PopupTemplateEditor.defaultProps = {
  popupTheme: {},
  onChange: () => {}
};

export default PopupTemplateEditor;
