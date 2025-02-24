import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  OptionList,
  Text,
  Button,
  Card,
  Tabs,
  Sheet,
  Banner,
  Scrollable,
  PageActions,
  EmptyState,
  BlockStack,
  InlineStack
} from '@shopify/polaris';
import { XIcon } from '@shopify/polaris-icons';
import { sortBy } from 'lodash';
import styled from 'styled-components';

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f6f8;

  .Polaris-OptionList-Option {
    margin-bottom: 2rem;
  }
`;

const HeaderWrapper = styled.div`
  border-bottom: 1px solid #dfe3e8;
  padding: 1.25rem 1rem 1rem 1rem;
`;

const SearchWrapper = styled.div`
  padding: 1rem;
`;

const PageActionsWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  padding-bottom: 0;
`;

const ThemeThumbnailImage = styled.img`
  width: 350px;
  max-width: 100%;
  height: auto;
`;

const ThemeOption = ({ theme }) => <ThemeThumbnailImage src={theme.thumbnailImageUrl} alt={theme.name} />;

ThemeOption.propTypes = {
  theme: PropTypes.shape({
    name: PropTypes.string.isRequired,
    thumbnailImageUrl: PropTypes.string.isRequired
  })
};

const EmptyComponent = () => (
  <EmptyState heading="No themes">
    <Text as="p">No themes are available.</Text>
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
    accessibilityLabel: 'Explore',
    panelID: 'explore'
  }
];

const ThemeSelector = ({
  open = false,
  strategy,
  theme,
  themes,
  offerThemes,
  onThemeSelect = () => {},
  onOfferThemeSelect = () => {},
  onClose = () => {}
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(theme?._id ? 0 : 1);
  const [selectedTheme, setSelectedTheme] = useState([
    offerThemes.find((current) => current.__id_offerForm === theme?.__id_offerForm)?.__id_offerForm
  ]);
  const [offerThemeSelected, setOfferThemeSelected] = useState(true);

  const themeOptions = useMemo(() => {
    let strategyThemes = [];

    // Filter for enabled themes.
    strategyThemes = themes.filter(({ enabled }) => enabled);

    // Filter by strategy.
    strategyThemes = strategyThemes.filter((current) => {
      return current.strategies.indexOf(strategy) > -1;
    });

    return strategyThemes.map((strategyTheme) => ({
      value: strategyTheme._id,
      label: <ThemeOption theme={strategyTheme} />
    }));
  }, [strategy, themes]);

  const offerThemeOptions = useMemo(() => {
    let sortedOfferThemes = sortBy(offerThemes, (offerTheme) => {
      // Display the current theme first.
      if (offerTheme.__id_offerForm === theme?.__id_offerForm) {
        return -1;
      }

      return offerTheme.displayOrder;
    });

    // Filter by strategy.
    sortedOfferThemes = sortedOfferThemes.filter((current) => current.strategies.indexOf(strategy) > -1);

    return sortedOfferThemes.map((offerTheme) => ({
      value: offerTheme.__id_offerForm,
      label: <ThemeOption theme={offerTheme} />
    }));
  }, [offerThemes, theme, strategy]);

  const handleTabChange = (index) => {
    setSelectedTabIndex(index);
  };

  const handleThemeSelect = (value) => {
    setOfferThemeSelected(tabs[selectedTabIndex].id === 'history');
    setSelectedTheme(value);
  };

  const handleSave = () => {
    if (offerThemeSelected) {
      onOfferThemeSelect(offerThemes.find((current) => current.__id_offerForm === selectedTheme[0]));
    } else {
      onThemeSelect(themes.find((current) => current._id === selectedTheme[0]));
    }

    onClose();
  };

  const handleEntered = () => {
    const currentThemeId = offerThemes.find((current) => current.__id_offerForm === theme?.__id_offerForm)?.__id_offerForm;

    if (typeof currentThemeId === 'undefined') {
      return;
    }

    setSelectedTheme([currentThemeId]);
  };

  const handleExit = () => {
    setTimeout(() => setSelectedTabIndex(0), 500);
  };

  return (
    <Sheet open={open} onEntered={handleEntered} onExit={handleExit} onClose={onClose} accessibilityLabel="Select theme">
      <InnerWrapper>
        <HeaderWrapper>
          <InlineStack align="space-between" gap="200">
            <Text variant="headingLg">Select theme</Text>
            <Button variant="plain" accessibilityLabel="Cancel" icon={XIcon} onClick={onClose} />
          </InlineStack>
        </HeaderWrapper>
        <Scrollable>
          <Tabs tabs={tabs} selected={selectedTabIndex} onSelect={handleTabChange}>
            <SearchWrapper>
              {tabs[selectedTabIndex].id === 'history' && (
                <BlockStack gap="200">
                  <Banner>Your customizations for previously selected themes will remain available here.</Banner>
                  {offerThemeOptions?.length > 0 && (
                    <Card>
                      <OptionList options={offerThemeOptions} selected={selectedTheme} onChange={handleThemeSelect} />
                    </Card>
                  )}
                  {!offerThemeOptions?.length && <EmptyComponent />}
                </BlockStack>
              )}
              {tabs[selectedTabIndex].id === 'explore' && (
                <>
                  {themeOptions?.length > 0 && (
                    <BlockStack gap="200">
                      {(strategy === 'UPSELL' || strategy === 'CROSS_SELL') && (
                        <Banner>Themes will adapt to work for both cross-selling and upselling strategies.</Banner>
                      )}
                      <Card>
                        <OptionList options={themeOptions} selected={selectedTheme} onChange={handleThemeSelect} />
                      </Card>
                    </BlockStack>
                  )}
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

export default ThemeSelector;
