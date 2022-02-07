import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { OfferPopup } from '@greatupsells/react-components';
import CodeEditor from './CodeEditor';
import dummyData from '../../dummyCrossSellData.json';
// import dummyData from '../../dummyUpsellData.json'

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

const ThemeTemplateEditor = ({ theme, onChange }) => {
  const classes = useStyles();

  const [template, setTemplate] = useState(theme.template);
  const [designMode, setDesignMode] = useState(true);
  const [previewActive, setPreviewActive] = useState(false);
  const debounceChange = useRef();

  // Use debouncing to delay updating the preview.
  const handleChange = (newTemplate) => {
    setTemplate(newTemplate);

    if (debounceChange.current) {
      clearTimeout(debounceChange.current);
    }

    debounceChange.current = setTimeout(
      () => onChange({ ...theme, template: newTemplate }),
      1.5 * 1000
    );
  };

  const handleClosePreview = () => {
    setPreviewActive(false);
    setTimeout(() => setDesignMode(true));
  };

  const handlePreview = () => {
    setDesignMode(false);
    setTimeout(() => setPreviewActive(true));
  };

  return (
    <Grid className={classes.root} container spacing={3}>
      <Grid className={classes.gridItem} item xs={12} sm={6}>
        <CodeEditor
          className={classes.editor}
          template={template}
          onChange={handleChange}
        />
      </Grid>
      <Grid className={classes.gridItem} item xs={12} sm={6}>
        <Paper className={classes.previewPaper} variant="outlined" square>
          <OfferPopup
            className={classes.preview}
            open={designMode || previewActive}
            designMode={designMode}
            forceDisplayType="desktop"
            shop={dummyData.shop}
            theme={theme}
            offer={dummyData.offer}
            triggerProduct={dummyData.triggerProduct}
            offeredProducts={dummyData.offeredProducts}
            onClose={handleClosePreview}
            onClick={handlePreview}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

ThemeTemplateEditor.propTypes = {
  theme: PropTypes.object,
  onChange: PropTypes.func
};

ThemeTemplateEditor.defaultProps = {
  theme: {},
  onChange: () => {}
};

export default ThemeTemplateEditor;
