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
import WysiwygEditor from './WysiwygEditor';
import FormFieldsEditor from './FormFieldsEditor';

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

const SearchFilter = ({ type, category, onChange }) => {
  const [active, setActive] = useState(false);

  const choices = useMemo(() => {
    if (type === 'UPSELL') {
      return [{ value: 'upsell', label: 'Upsell' }];
    } else if (type === 'CROSS_SELL') {
      return [{ value: 'cross-sell', label: 'Cross-sell' }];
    } else if (type === 'POPUP') {
      return [
        { value: '', label: 'All' },
        { value: 'email', label: 'Email' },
        { value: 'newsletter', label: 'Newsletter signup' },
        { value: 'survey', label: 'Survey' }
      ];
    } else {
      return [];
    }
  }, [type]);

  // TODO: Select the first available choice when `type` changes.

  const handleChange = ([value]) => {
    onChange(value);
  };

  return (
    <Popover
      active={active}
      activator={
        <Button disclosure onClick={() => setActive(!active)}>
          Category
        </Button>
      }
      preferredAlignment="right"
      sectioned
      onClose={() => setActive(false)}
    >
      <ChoiceList
        title="Category"
        titleHidden
        choices={choices}
        selected={category}
        onChange={handleChange}
      />
    </Popover>
  );
};

SearchFilter.propTypes = {
  type: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

SearchFilter.defaultProps = {
  onChange: () => {}
};

const tabs = [
  // {
  //   id: 'preview',
  //   accessibilityLabel: 'Preview',
  //   panelID: 'preview',
  //   content: 'Preview'
  // },
  {
    id: 'design',
    accessibilityLabel: 'Design',
    panelID: 'design',
    content: 'Design'
  },
  {
    id: 'data-collection',
    panelID: 'data-collection',
    content: 'Data collection'
  }
];

const ThemeEditor = ({ type, theme, themes, previewElement, onChange }) => {
  const [selectedTheme, setSelectedTheme] = useState([theme && theme._id]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [category, setCategory] = useState('');

  const typeThemes = useMemo(() => {
    if (type === 'UPSELL') {
      return themes.filter((item) => item.type === 'UPSELL');
    } else if (type === 'CROSS_SELL') {
      return themes.filter((item) => item.type === 'CROSS_SELL');
    } else if (type === 'POPUP') {
      return themes.filter((item) => item.type === 'POPUP');
    }
  }, [type, themes]);

  const themeOptions = useMemo(
    () =>
      sortBy(typeThemes, 'displayOrder').map((item) => ({
        value: item._id,
        label: <ThemeOption theme={item} />
      })),
    [typeThemes]
  );

  const handleThemeSelect = (value) => {
    setSelectedTheme(value);

    if (value?.[0]) {
      onChange(themes.find(({ _id }) => _id === value[0]));
    }
  };

  const handleCategoryChange = (value) => {
    setCategory(value);

    // TODO: Filter available templates within this component (`typeThemes`?).

    // TODO: Set theme to first theme in available categories on type change?
    // Maybe this doesn't make sense since categories are already filtered based on `type`.
  };

  const handleTabChange = (index) => {
    setSelectedTabIndex(index);
  };

  const handleTemplateChange = (value) => {
    onChange({ ...theme, template: value });
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
          connectedRight={
            <SearchFilter
              type={type}
              category={category}
              onChange={handleCategoryChange}
            />
          }
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
          fullWidth
        >
          <Card.Section>
            {tabs[selectedTabIndex].panelID === 'design' && (
              <WysiwygEditor
                template={theme.template}
                onChange={handleTemplateChange}
              />
            )}
            {tabs[selectedTabIndex].panelID === 'data-collection' && (
              <FormFieldsEditor
                formFields={theme.formFields}
                onAddItem={handleAddFormField}
                onRemoveItem={handleRemoveFormField}
              />
            )}
          </Card.Section>
        </Tabs>
      </Card.Section>
    </Card>
  );
};

ThemeEditor.propTypes = {
  type: PropTypes.string.isRequired,
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
