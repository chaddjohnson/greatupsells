import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Tabs, Tab, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormActions from '../FormActions';
import DestructiveButton from '../DestructiveButton';
import PopupTemplateEditor from './PopupTemplateEditor';
import PopupVariablesEditor from './PopupVariablesEditor';
import PopupFormFieldsEditor from './PopupFormFieldsEditor';

const useStyles = makeStyles((theme) => ({
  root: {
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
    flex: 1,
    height: '100%',
    marginTop: theme.spacing(2)
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
    <form className={classes.root} onValidate onSubmit={handleSubmit}>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab id="tab-1" label="Design" />
        <Tab id="tab-2" label="Variables" />
        <Tab id="tab-3" label="Form Fields" />
      </Tabs>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <TabPanel className={classes.tabPanel} value={tabIndex} index={0}>
            <PopupTemplateEditor
              popupTheme={popupTheme}
              onChange={handleChange}
            />
          </TabPanel>
          <TabPanel className={classes.tabPanel} value={tabIndex} index={1}>
            <PopupVariablesEditor
              popupTheme={popupTheme}
              onChange={handleChange}
            />
          </TabPanel>
          <TabPanel className={classes.tabPanel} value={tabIndex} index={2}>
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
