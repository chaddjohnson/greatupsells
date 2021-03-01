import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  OptionList,
  Tabs,
  TextContainer,
  Heading,
  Subheading,
  FormLayout,
  TextField,
  Icon
} from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { groupBy, sortBy } from 'lodash';
import styled from 'styled-components';
import ColorPicker from '../ColorPicker';

const ThemeOptionsContainer = styled.div`
  max-height: 32.5rem;
  overflow-y: auto;
  position: relative;

  /* .Polaris-OptionList__Title {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: white;
    margin-left: -1rem;
    padding-left: 1.75rem;
    margin-top: 1rem;
  } */
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

const VariablesEditor = ({ theme }) => {
  const variablesByType = useMemo(() => groupBy(theme.themeVariables, 'type'), [
    theme.themeVariables
  ]);
  const types = [
    {
      value: 'text',
      name: 'Texts'
    },
    {
      value: 'color',
      name: 'Colors'
    }
  ];

  return (
    <>
      {types.map((type) => {
        const typeVariables = variablesByType[type.value];

        return (
          <Card.Section key={type.value} fullWidth>
            <FormLayout>
              <Subheading>{type.name}</Subheading>
              {typeVariables.map(({ name, description, value }) => (
                <div key={name}>
                  {type.value === 'text' && (
                    <TextField
                      type="text"
                      label={name}
                      helpText={description}
                      value={value}
                      onChange={() => {}}
                    />
                  )}
                  {type.value === 'color' && (
                    <ColorPicker
                      label={name}
                      value={value}
                      onChange={() => {}}
                    />
                  )}
                </div>
              ))}
            </FormLayout>
          </Card.Section>
        );
      })}
    </>
  );
};

VariablesEditor.propTypes = {
  theme: PropTypes.shape({
    themeVariables: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        description: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    )
  }).isRequired
};

const InputFieldsEditor = ({ theme }) => <>Text fields editor here</>;

InputFieldsEditor.propTypes = {
  theme: PropTypes.object.isRequired
};

const CodeEditor = ({ theme }) => <>Code editor here</>;

CodeEditor.propTypes = {
  theme: PropTypes.object.isRequired
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
    id: 'input-fields',
    panelID: 'input-fields',
    content: 'Text fields'
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

  const themeOptionSections = useMemo(() => {
    const themesByCategory = groupBy(themes, 'category');
    const categories = Object.keys(themesByCategory);
    const sections = categories.map((category) => {
      const categoryThemes = sortBy(themesByCategory[category], 'displayOrder');

      return {
        title: category,
        options: categoryThemes.map((categoryTheme) => ({
          value: categoryTheme._id,
          label: <ThemeOption theme={categoryTheme} />
        }))
      };
    });

    return sections;
  }, [themes]);

  const handleThemeSelect = (value) => {
    setSelectedTheme(value);

    if (value?.[0]) {
      onChange(themes.find(({ _id }) => _id === value[0]));
    }
  };

  const handleTabChange = (index) => {
    setSelectedTabIndex(index);
  };

  return (
    <Card title="Theme" actions={[{ content: 'Add theme' }]}>
      <Card.Section>
        <TextField
          type="search"
          placeholder="Search themes"
          prefix={<Icon source={SearchMinor} />}
          onChange={() => {}}
        />

        <ThemeOptionsContainer>
          <OptionList
            onChange={handleThemeSelect}
            sections={themeOptionSections}
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
          <Card.Section
            fullWidth={tabs[selectedTabIndex].panelID === 'preview'}
          >
            {tabs[selectedTabIndex].panelID === 'preview' && previewElement}
            {tabs[selectedTabIndex].panelID === 'variables' && (
              <VariablesEditor theme={theme} />
            )}
            {tabs[selectedTabIndex].panelID === 'input-fields' && (
              <InputFieldsEditor theme={theme} />
            )}
            {tabs[selectedTabIndex].panelID === 'code-editor' && (
              <CodeEditor theme={theme} />
            )}
          </Card.Section>
        </Tabs>
      </Card.Section>
      {tabs[selectedTabIndex].panelID === 'code-editor' && (
        <Card.Section flush fullWidth>
          {previewElement}
        </Card.Section>
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
