import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Card, CardContent, Tabs, Tab, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormActions from '../FormActions';
import DestructiveButton from '../DestructiveButton';
import PopupSettingsEditor from './PopupSettingsEditor';
import PopupTemplateEditor from './PopupTemplateEditor';
import PopupVariablesEditor from './PopupVariablesEditor';
import PopupFormFieldsEditor from './PopupFormFieldsEditor';

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
    paddingTop: theme.spacing(2),
    height: '100%'
  },
  card: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(3)
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
  settings: 0,
  design: 1,
  variables: 2,
  formFields: 3
};

const TabPanel = ({ index, value, children, ...props }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...props}
  >
    {value === index && children}
  </div>
);

TabPanel.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
};

const PopupThemeEditor = ({ initialValues, onSubmit }) => {
  const classes = useStyles();

  const [tabIndex, setTabIndex] = useState(0);
  const [popupTheme, setPopupTheme] = useState(initialValues);

  const handleTabChange = (event, index) => {
    setTabIndex(index);
  };

  const handleChange = (value) => {
    setPopupTheme(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(popupTheme);
  };

  return (
    <form
      className={clsx({
        [classes.rootFullHeight]: tabIndex === tabIndexes.design
      })}
      onValidate
      onSubmit={handleSubmit}
    >
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab id="tab-1" label="Settings" />
        <Tab id="tab-2" label="Design" />
        <Tab id="tab-3" label="Variables" />
        <Tab id="tab-4" label="Form Fields" />
      </Tabs>
      <Card
        className={clsx(classes.card, {
          [classes.cardFullHeight]: tabIndex === tabIndexes.design
        })}
      >
        <CardContent className={classes.cardContent}>
          <TabPanel className={classes.tabPanel} value={tabIndex} index={0}>
            <PopupSettingsEditor
              popupTheme={popupTheme}
              onChange={handleChange}
            />
          </TabPanel>
          <TabPanel className={classes.tabPanel} value={tabIndex} index={1}>
            <PopupTemplateEditor
              popupTheme={popupTheme}
              onChange={handleChange}
            />
          </TabPanel>
          <TabPanel className={classes.tabPanel} value={tabIndex} index={2}>
            <PopupVariablesEditor
              popupTheme={popupTheme}
              onChange={handleChange}
            />
          </TabPanel>
          <TabPanel className={classes.tabPanel} value={tabIndex} index={3}>
            <PopupFormFieldsEditor
              popupTheme={popupTheme}
              onChange={handleChange}
            />
          </TabPanel>
        </CardContent>
      </Card>
      <FormActions>
        <DestructiveButton variant="contained" onClick={() => {}}>
          Delete
        </DestructiveButton>
        <span className={classes.actionSpacer} />
        <Button variant="contained" onClick={() => {}}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </FormActions>
    </form>
  );
};

PopupThemeEditor.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func
};

PopupThemeEditor.defaultProps = {
  initialValues: {},
  onSubmit: () => {}
};

export default PopupThemeEditor;
