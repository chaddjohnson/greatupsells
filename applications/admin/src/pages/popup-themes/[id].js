import { useState } from 'react';
import { Tabs, Tab, Box } from '@material-ui/core';
import { Brush as PopupThemesIcon } from '@material-ui/icons';
import {
  Layout,
  Link,
  PopupThemeEditor,
  PopupVariablesEditor,
  PopupFormFieldsEditor
} from '../../components';
import { usePopupTheme } from '../../hooks';

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

const EditPopupThemePage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // TODO: Replace with data from API.
  const { popupTheme } = usePopupTheme();

  const handleTabChange = (event, index) => {
    setTabIndex(index);
  };

  const handleSubmit = (/* values */) => {
    // TODO
  };

  // TODO: Skeleton loading.

  return (
    <Layout
      title={
        <>
          <Link href="/popup-themes">Popup Themes</Link>&nbsp;/ Edit Popup Theme
        </>
      }
      icon={<PopupThemesIcon />}
    >
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab id="tab-1" label="Design" />
        <Tab id="tab-2" label="Variables" />
        <Tab id="tab-3" label="Form Fields" />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <PopupThemeEditor initialValues={popupTheme} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <PopupVariablesEditor initialValues={popupTheme} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <PopupFormFieldsEditor initialValues={popupTheme} />
      </TabPanel>
    </Layout>
  );
};

export default EditPopupThemePage;
