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
  EmptyState,
  Stack
} from '@shopify/polaris';
import { SearchMinor, MobileCancelMajor } from '@shopify/polaris-icons';
import { sortBy, groupBy } from 'lodash';
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

const SearchFilter = ({ strategy, category, onChange }) => {
  const [active, setActive] = useState(false);

  const choices = useMemo(() => {
    if (strategy === 'UPSELL') {
      return [{ value: 'upsell', label: 'Upsell' }];
    } else if (strategy === 'CROSS_SELL') {
      return [{ value: 'cross-sell', label: 'Cross-sell' }];
    } else if (strategy === 'POPUP') {
      return [
        { value: '', label: 'All' },
        { value: 'email', label: 'Email' },
        { value: 'newsletter', label: 'Newsletter signup' },
        { value: 'survey', label: 'Survey' }
      ];
    } else {
      return [];
    }
  }, [strategy]);

  // TODO: Select the first available choice when `strategy` changes.

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
  strategy: PropTypes.string.isRequired,
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

const EmptyComponent = () => (
  <EmptyState heading="No themes">
    <TextContainer>No themes are available.</TextContainer>
  </EmptyState>
);

const tabs = [
  {
    id: 'history',
    content: 'History',
    accessibilityLabel: 'History',
    panelID: 'history'
  },
  {
    id: 'explore',
    content: 'Explore',
    accessibilityLabel: 'Exlore',
    panelID: 'explore'
  }
];

const ThemeSelector = ({
  open,
  strategy,
  theme,
  themes,
  offerThemes,
  onThemeSelect,
  onOfferThemeSelect,
  onClose
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState([
    offerThemes.find(
      (current) => current.__id_offerForm === theme?.__id_offerForm
    )?.__id_offerForm
  ]);
  const [offerThemeSelected, setOfferThemeSelected] = useState(true);
  const [category, setCategory] = useState('');

  const strategyThemes = useMemo(() => {
    if (strategy === 'UPSELL') {
      return themes.filter((current) => {
        return current.strategy === 'UPSELL';
      });
    } else if (strategy === 'CROSS_SELL') {
      return themes.filter((current) => {
        return current.strategy === 'CROSS_SELL';
      });
    } else if (strategy === 'POPUP') {
      return themes.filter((current) => {
        return current.strategy === 'POPUP';
      });
    }
  }, [strategy, themes]);

  const themeOptions = useMemo(() => {
    const categoryThemes = groupBy(strategyThemes, 'category');
    const categoryNames = Object.keys(categoryThemes).sort();

    return categoryNames.map((categoryName) => ({
      title: categoryName,
      options: categoryThemes[categoryName].map((categoryTheme) => ({
        value: categoryTheme._id,
        label: <ThemeOption theme={categoryTheme} />
      }))
    }));
  }, [strategyThemes]);

  const offerThemeOptions = useMemo(() => {
    const sortedOfferThemes = sortBy(offerThemes, (offerTheme) => {
      // Display the current theme first.
      if (offerTheme.__id_offerForm === theme?.__id_offerForm) {
        return -1;
      }

      return offerTheme.displayOrder;
    });

    return sortedOfferThemes.map((offerTheme) => ({
      value: offerTheme.__id_offerForm,
      label: <ThemeOption theme={offerTheme} />
    }));
  }, [offerThemes, theme]);

  const handleTabChange = (index) => {
    setSelectedTabIndex(index);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);

    // TODO: Filter available templates within this component (`strategyThemes`?).

    // TODO: Set theme to first theme in available categories on strategy change?
    // Maybe this doesn't make sense since categories are already filtered based on `strategy`.
  };

  const handleThemeSelect = (value) => {
    setOfferThemeSelected(tabs[selectedTabIndex].id === 'history');
    setSelectedTheme(value);
  };

  const handleSave = () => {
    if (offerThemeSelected) {
      onOfferThemeSelect(
        offerThemes.find(
          (current) => current.__id_offerForm === selectedTheme[0]
        )
      );
    } else {
      onThemeSelect(themes.find((current) => current._id === selectedTheme[0]));
    }

    onClose();
  };

  const handleEntered = () => {
    const currentThemeId = offerThemes.find(
      (current) => current.__id_offerForm === theme?.__id_offerForm
    )?.__id_offerForm;

    if (typeof currentThemeId === 'undefined') {
      return;
    }

    setSelectedTheme([currentThemeId]);
  };

  const handleExit = () => {
    setTimeout(() => setSelectedTabIndex(0), 500);
  };

  return (
    <Sheet
      open={open}
      onEntered={handleEntered}
      onExit={handleExit}
      onClose={onClose}
      accessibilityLabel="Select theme"
    >
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
              {tabs[selectedTabIndex].id === 'history' && (
                <>
                  <Card>
                    <OptionList
                      options={offerThemeOptions}
                      selected={selectedTheme}
                      onChange={handleThemeSelect}
                    />
                  </Card>
                  {!offerThemeOptions?.length && <EmptyComponent />}
                </>
              )}
              {tabs[selectedTabIndex].id === 'explore' &&
                themeOptions?.length > 0 && (
                  <>
                    <Stack vertical spacing="tight">
                      <TextField
                        type="search"
                        placeholder="Search"
                        prefix={<Icon source={SearchMinor} />}
                        connectedRight={
                          <SearchFilter
                            strategy={strategy}
                            category={category}
                            onChange={handleCategoryChange}
                          />
                        }
                        onChange={() => {}}
                      />
                      <Card>
                        <OptionList
                          sections={themeOptions}
                          selected={selectedTheme}
                          onChange={handleThemeSelect}
                        />
                      </Card>
                    </Stack>
                    {!themeOptions?.length && <EmptyComponent />}
                  </>
                )}
            </SearchWrapper>
          </Tabs>
        </Scrollable>
        <PageActionsWrapper>
          <PageActions
            primaryAction={{
              content: 'Select',
              onAction: handleSave,
              disabled: !selectedTheme?.length
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
  strategy: PropTypes.string.isRequired,
  theme: PropTypes.object,
  themes: PropTypes.arrayOf(PropTypes.object),
  offerThemes: PropTypes.arrayOf(PropTypes.object),
  onThemeSelect: PropTypes.func,
  onOfferThemeSelect: PropTypes.func,
  onClose: PropTypes.func
};

ThemeSelector.defaultProps = {
  open: false,
  onThemeSelect: () => {},
  onOfferThemeSelect: () => {},
  onClose: () => {}
};

export default ThemeSelector;
