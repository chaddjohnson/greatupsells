import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  OptionList,
  DisplayText,
  TextField,
  Button,
  Popover,
  ChoiceList,
  Card,
  Tabs,
  Icon,
  Sheet,
  TextContainer,
  Scrollable,
  PageActions,
  Stack
} from '@shopify/polaris';
import { SearchMinor, MobileCancelMajor } from '@shopify/polaris-icons';
import { sortBy } from 'lodash';
import styled from 'styled-components';

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f6f8;
`;

const HeaderWrapper = styled.div`
  align-items: center;
  border-bottom: 1px solid #dfe3e8;
  display: flex;
  justify-content: space-between;
  padding: 1.6rem;
  width: 100%;
`;

const SearchWrapper = styled.div`
  padding: 1.6rem;
`;

const PageActionsWrapper = styled.div`
  width: 100%;
  padding: 1.6rem;
  padding-bottom: 0;
`;

const ThemeOptionWrapper = styled.div`
  border: 1px solid #c9cccf;
  border-radius: 3px;
  padding-bottom: 0.5rem;
  margin: auto;
  background-color: #ffffff;
`;

const ThemeThumbnailImage = styled.img`
  width: 350px;
  max-width: 100%;
  height: auto;
`;

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

const ThemeOption = ({ theme }) => (
  <ThemeOptionWrapper>
    <ThemeThumbnailImage src={theme.thumbnailImageUrl} alt={theme.name} />
    <Stack distribution="center">
      <TextContainer>{theme.name}</TextContainer>
    </Stack>
  </ThemeOptionWrapper>
);

ThemeOption.propTypes = {
  theme: PropTypes.shape({
    name: PropTypes.string.isRequired,
    thumbnailImageUrl: PropTypes.string.isRequired
  })
};

const tabs = [
  {
    id: 'explore',
    content: 'Explore',
    accessibilityLabel: 'Exlore',
    panelID: 'explore'
  },
  {
    id: 'history',
    content: 'History',
    accessibilityLabel: 'History',
    panelID: 'history'
  }
];

const ThemeSelector = ({ open, type, theme, themes, onChange, onClose }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState([theme && theme._id]);
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

  const handleTabChange = (index) => {
    setSelectedTabIndex(index);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);

    // TODO: Filter available templates within this component (`typeThemes`?).

    // TODO: Set theme to first theme in available categories on type change?
    // Maybe this doesn't make sense since categories are already filtered based on `type`.
  };

  const handleThemeSelect = (value) => {
    setSelectedTheme(value);
  };

  const handleSave = () => {
    if (selectedTheme?.[0]) {
      onChange(themes.find(({ _id }) => _id === selectedTheme[0]));
      onClose();
    }
  };

  return (
    <Sheet open={open} onClose={onClose} accessibilityLabel="Select theme">
      <InnerWrapper>
        <HeaderWrapper>
          <DisplayText size="small">Select theme</DisplayText>
          <Button
            accessibilityLabel="Cancel"
            icon={MobileCancelMajor}
            onClick={onClose}
            plain
          />
        </HeaderWrapper>
        <Scrollable>
          <Tabs
            tabs={tabs}
            selected={selectedTabIndex}
            onSelect={handleTabChange}
          >
            <SearchWrapper>
              {tabs[selectedTabIndex].id === 'explore' && (
                <Stack vertical spacing="tight">
                  <TextField
                    type="search"
                    placeholder="Search"
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
                  <Card>
                    <OptionList
                      options={themeOptions}
                      selected={selectedTheme}
                      onChange={handleThemeSelect}
                    />
                  </Card>
                </Stack>
              )}
              {tabs[selectedTabIndex].id === 'history' && (
                <Card>
                  <OptionList
                    options={themeOptions}
                    selected={selectedTheme}
                    onChange={handleThemeSelect}
                  />
                </Card>
              )}
            </SearchWrapper>
          </Tabs>
        </Scrollable>
        <PageActionsWrapper>
          <PageActions
            primaryAction={{
              content: 'Select',
              onAction: handleSave,
              disabled: !selectedTheme
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: onClose
              }
            ]}
          />
        </PageActionsWrapper>
      </InnerWrapper>
    </Sheet>
  );
};

ThemeSelector.propTypes = {
  open: PropTypes.bool,
  type: PropTypes.string.isRequired,
  theme: PropTypes.object,
  themes: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  onClose: PropTypes.func
};

ThemeSelector.defaultProps = {
  open: false,
  onChange: () => {},
  onClose: () => {}
};

export default ThemeSelector;
