import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Card, CardContent, Tabs, Tab, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormActions from '../FormActions';
import DestructiveButton from '../DestructiveButton';
import ThemeSettingsEditor from './ThemeSettingsEditor';
import ThemeTemplateEditor from './ThemeTemplateEditor';
import ThemeVariablesEditor from './ThemeVariablesEditor';
import ThemeFormFieldsEditor from './ThemeFormFieldsEditor';

const useStyles = makeStyles((theme) => ({
  rootFullHeight: {
    display: 'block',

    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  },
  tabPanel: {
    paddingTop: theme.spacing(1),
    height: '100%'
  },
  card: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    minHeight: 500
  },
  cardFullHeight: {
    flex: 1,
    padding: 0
  },
  cardContent: {
    '&&': {
      paddingTop: 0,
      paddingBottom: '0',
      height: '100%'
    }
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  actionSpacer: {
    flexGrow: 1
  }
}));

const tabIndexes = {
  design: 0,
  settings: 1,
  variables: 2,
  formFields: 3
};

const TabPanel = ({ index, value, children, ...props }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`theme-tabpanel-${index}`}
    aria-labelledby={`theme-tab-${index}`}
    {...props}
  >
    {children}
  </div>
);

TabPanel.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
};

const ThemeEditor = ({ initialValues, onSubmit }) => {
  const classes = useStyles();

  const [tabIndex, setTabIndex] = useState(0);
  const [theme, setTheme] = useState(initialValues);
  const [saving, setSaving] = useState(false);

  const handleTabChange = (event, index) => {
    setTabIndex(index);
  };

  const handleChange = (value) => {
    setTheme(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      await onSubmit(theme);
    } catch (error) {
      setSaving(false);
    }

    setSaving(false);
  };

  return (
    <form
      className={clsx({
        [classes.rootFullHeight]: tabIndex === tabIndexes.design
      })}
      noValidate
      onSubmit={handleSubmit}
    >
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab id="theme-tab-1" label="Design" />
        <Tab id="theme-tab-2" label="Settings" />
        <Tab id="theme-tab-3" label="Variables" />
        <Tab id="theme-tab-4" label="Form Fields" />
      </Tabs>
      <Card
        className={clsx(classes.card, {
          [classes.cardFullHeight]: tabIndex === tabIndexes.design
        })}
      >
        <CardContent className={classes.cardContent}>
          <TabPanel
            className={classes.tabPanel}
            value={tabIndex}
            index={tabIndexes.design}
          >
            <ThemeTemplateEditor theme={theme} onChange={handleChange} />
          </TabPanel>
          <TabPanel
            className={classes.tabPanel}
            value={tabIndex}
            index={tabIndexes.settings}
          >
            <ThemeSettingsEditor theme={theme} onChange={handleChange} />
          </TabPanel>
          <TabPanel
            className={classes.tabPanel}
            value={tabIndex}
            index={tabIndexes.variables}
          >
            <ThemeVariablesEditor theme={theme} onChange={handleChange} />
          </TabPanel>
          <TabPanel
            className={classes.tabPanel}
            value={tabIndex}
            index={tabIndexes.formFields}
          >
            <ThemeFormFieldsEditor theme={theme} onChange={handleChange} />
          </TabPanel>
        </CardContent>
      </Card>
      <FormActions>
        <DestructiveButton
          variant="contained"
          disabled={saving}
          onClick={() => {}}
        >
          Delete
        </DestructiveButton>
        <span className={classes.actionSpacer} />
        <Button variant="contained" onClick={() => {}}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={saving}
        >
          Save
        </Button>
      </FormActions>
    </form>
  );
};

ThemeEditor.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func
};

ThemeEditor.defaultProps = {
  initialValues: {},
  onSubmit: () => {}
};

export default ThemeEditor;
