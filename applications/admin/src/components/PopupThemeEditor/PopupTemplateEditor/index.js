import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CodeEditor from './CodeEditor';
import Preview from './Preview';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  gridItem: {
    maxWidth: '100%',
    height: 'auto',
    flexBasis: '100%',
    position: 'relative',

    [theme.breakpoints.up('lg')]: {
      maxWidth: '50%',
      height: '100%'
    }
  },
  previewPaper: {
    width: '100%',
    minHeight: 500,

    [theme.breakpoints.up('lg')]: {
      height: '100%'
    }
  },
  editor: {
    height: '100%',
    position: 'relative',
    minHeight: 500,

    '& > .CodeMirror': {
      fontSize: '13px',
      height: '100%',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
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
        <CodeEditor
          className={classes.editor}
          value={popupTheme.template}
          onChange={handleChange}
        />
      </Grid>
      <Grid className={classes.gridItem} item xs={12} sm={6}>
        <Paper className={classes.previewPaper} variant="outlined" square>
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
