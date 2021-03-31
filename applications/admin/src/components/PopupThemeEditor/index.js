import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@material-ui/core';
import PopupTemplateEditor from './PopupTemplateEditor';
import PopupVariablesEditor from './PopupVariablesEditor';
import PopupFormFieldsEditor from './PopupFormFieldsEditor';

const TabPanel = ({ index, value, children, ...props }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...props}
  >
    {value === index && <Box py={2}>{children}</Box>}
  </div>
);

const PopupThemeEditor = ({ initialValues, onSubmit }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [popupTheme, setPopupTheme] = useState(initialValues);

  const handleTabChange = (event, index) => {
    setTabIndex(index);
  };

  const handleChange = (value) => {
    setPopupTheme(value);
  };

  const handleSubmit = () => {
    onSubmit(popupTheme);
  };

  return (
    <form onValidate onSubmit={handleSubmit}>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab id="tab-1" label="Design" />
        <Tab id="tab-2" label="Variables" />
        <Tab id="tab-3" label="Form Fields" />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <PopupTemplateEditor popupTheme={popupTheme} onChange={handleChange} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <PopupVariablesEditor popupTheme={popupTheme} onChange={handleChange} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <PopupFormFieldsEditor
          popupTheme={popupTheme}
          onChange={handleChange}
        />
      </TabPanel>
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
