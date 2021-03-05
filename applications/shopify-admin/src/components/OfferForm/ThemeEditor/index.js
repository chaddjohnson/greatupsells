import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  OptionList,
  Tabs,
  TextContainer,
  Heading,
  TextField,
  Button,
  Popover,
  ChoiceList,
  Icon
} from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { sortBy } from 'lodash';
import styled from 'styled-components';
import VariablesEditor from './VariablesEditor';
import FormFieldsEditor from './FormFieldsEditor';
import CodeEditor from './CodeEditor';

const ThemeOptionsContainer = styled.div`
  max-height: 32.5rem;
  overflow-y: auto;
  position: relative;
`;

const ThemeDescription = styled.div`
  margin-left: 1rem;
`;

const ThemeOption = ({ theme }) => (
  <>
    <img src={theme.thumbnailImageUrl} alt={theme.name} />
    <ThemeDescription>
      <TextContainer>
        <Heading>{theme.name}</Heading>
        Nostrud qui sit culpa cupidatat officia eu elit ex quis voluptate
        proident aute eu tempor aliqua reprehenderit ut magna.
      </TextContainer>
    </ThemeDescription>
  </>
);

ThemeOption.propTypes = {
  theme: PropTypes.shape({
    name: PropTypes.string.isRequired,
    thumbnailImageUrl: PropTypes.string
  })
};

ThemeOption.defaultProps = {
  theme: {
    thumbnailImageUrl: 'https://via.placeholder.com/200x150'
  }
};

const SearchFilter = ({ onChange }) => {
  const [active, setActive] = useState(false);

  return (
    <Popover
      active={active}
      activator={
        <Button disclosure onClick={() => setActive(!active)}>
          Type
        </Button>
      }
      preferredAlignment="right"
      sectioned
      onClose={() => setActive(false)}
    >
      <ChoiceList
        title="Type"
        titleHidden
        choices={[
          { value: '', label: 'All' },
          { value: 'upsell', label: 'Upsell' },
          { value: 'cross-sell', label: 'Cross-sell' },
          { value: 'email', label: 'Email' },
          { value: 'newsletter', label: 'Newsletter signup' },
          { value: 'survey', label: 'Survey' }
        ]}
        selected=""
        // selected={statusFilter || []}
        onChange={onChange}
      />
    </Popover>
  );
};

SearchFilter.propTypes = {
  onChange: PropTypes.func
};

SearchFilter.defaultProps = {
  onChange: () => {}
};

const tabs = [
  {
    id: 'preview',
    accessibilityLabel: 'Preview',
    panelID: 'preview',
    content: 'Preview'
  },
  {
    id: 'variables',
    accessibilityLabel: 'Variables',
    panelID: 'variables',
    content: 'Variables'
  },
  {
    id: 'form-fields',
    panelID: 'form-fields',
    content: 'Form fields'
  },
  {
    id: 'code-editor',
    panelID: 'code-editor',
    content: 'Code editor'
  }
];

const ThemeEditor = ({ theme, themes, previewElement, onChange }) => {
  const [selectedTheme, setSelectedTheme] = useState([theme && theme._id]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const themeOptions = useMemo(
    () =>
      sortBy(themes, 'displayOrder').map((item) => ({
        value: item._id,
        label: <ThemeOption theme={item} />
      })),
    [themes]
  );

  const handleThemeSelect = (value) => {
    setSelectedTheme(value);

    if (value?.[0]) {
      onChange(themes.find(({ _id }) => _id === value[0]));
    }
  };

  const handleTabChange = (index) => {
    setSelectedTabIndex(index);
  };

  const handleAddVariable = (variable) => {
    onChange({
      ...theme,
      variables: [...theme.variables, variable]
    });
  };

  const handleRemoveVariable = (index) => {
    onChange({
      ...theme,
      variables: [
        ...theme.variables.slice(0, index),
        ...theme.variables.slice(index + 1)
      ]
    });
  };

  const handleAddFormField = (formField) => {
    onChange({
      ...theme,
      formFields: [...theme.formFields, formField]
    });
  };

  const handleRemoveFormField = (index) => {
    onChange({
      ...theme,
      formFields: [
        ...theme.formFields.slice(0, index),
        ...theme.formFields.slice(index + 1)
      ]
    });
  };

  return (
    <Card title="Theme" actions={[{ content: 'Add theme' }]}>
      <Card.Section>
        <TextField
          type="search"
          placeholder="Search themes"
          prefix={<Icon source={SearchMinor} />}
          connectedRight={<SearchFilter onChange={() => {}} />}
          onChange={() => {}}
        />

        <ThemeOptionsContainer>
          <OptionList
            onChange={handleThemeSelect}
            options={themeOptions}
            selected={selectedTheme}
          />
        </ThemeOptionsContainer>
      </Card.Section>
      <Card.Section title="Settings" fullWidth>
        <Tabs
          tabs={tabs}
          selected={selectedTabIndex}
          onSelect={handleTabChange}
        >
          <Card.Section>
            {tabs[selectedTabIndex].panelID === 'preview' && previewElement}
            {tabs[selectedTabIndex].panelID === 'variables' && (
              <VariablesEditor
                variables={theme.variables}
                // onChange={() => {}}
                onAddItem={handleAddVariable}
                onRemoveItem={handleRemoveVariable}
              />
            )}
            {tabs[selectedTabIndex].panelID === 'form-fields' && (
              <FormFieldsEditor
                formFields={theme.formFields}
                onAddItem={handleAddFormField}
                onRemoveItem={handleRemoveFormField}
              />
            )}
            {tabs[selectedTabIndex].panelID === 'code-editor' && (
              <CodeEditor markup={theme.markup} onChange={() => {}} />
            )}
          </Card.Section>
        </Tabs>
      </Card.Section>
      {tabs[selectedTabIndex].panelID === 'code-editor' && (
        <Card.Section>{previewElement}</Card.Section>
      )}
    </Card>
  );
};

ThemeEditor.propTypes = {
  theme: PropTypes.object,
  themes: PropTypes.arrayOf(PropTypes.object),
  previewElement: PropTypes.node,
  onChange: PropTypes.func
};

ThemeEditor.defaultProps = {
  theme: {},
  themes: [],
  onChange: () => {}
};

export default ThemeEditor;
