import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  OptionList,
  DisplayText,
  Button,
  Card,
  Tabs,
  Sheet,
  TextContainer,
  Heading,
  Banner,
  Scrollable,
  PageActions,
  EmptyState,
  Stack
} from '@shopify/polaris';
import { MobileCancelMajor } from '@shopify/polaris-icons';
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
  position: relative;

  &:hover {
    .preview {
      visibility: hidden;
    }
    .description {
      visibility: visible;
    }
  }
`;

const ThemeThumbnailImage = styled.img`
  width: 350px;
  max-width: 100%;
  height: auto;
`;

const ThemeDescription = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  visibility: hidden;
`;

const ThemeOption = ({ theme }) => (
  <ThemeOptionWrapper>
    <div className="preview">
      <ThemeThumbnailImage src={theme.thumbnailImageUrl} alt={theme.name} />
      <Stack distribution="center">
        <TextContainer>{theme.name}</TextContainer>
      </Stack>
    </div>
    <ThemeDescription className="description">
      <TextContainer>
        <Heading>{theme.name}</Heading>
        <p>{theme.description}</p>
      </TextContainer>
    </ThemeDescription>
  </ThemeOptionWrapper>
);

ThemeOption.propTypes = {
  theme: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
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
    accessibilityLabel: 'Explore',
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
  const [selectedTabIndex, setSelectedTabIndex] = useState(theme?._id ? 0 : 1);
  const [selectedTheme, setSelectedTheme] = useState([
    offerThemes.find(
      (current) => current.__id_offerForm === theme?.__id_offerForm
    )?.__id_offerForm
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
    sortedOfferThemes = sortedOfferThemes.filter(
      (current) => current.strategies.indexOf(strategy) > -1
    );

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
                <Stack vertical>
                  <TextContainer>
                    <Banner>
                      Your customizations for previously selected themes will
                      remain available here.
                    </Banner>
                  </TextContainer>
                  {offerThemeOptions?.length > 0 && (
                    <Card>
                      <OptionList
                        options={offerThemeOptions}
                        selected={selectedTheme}
                        onChange={handleThemeSelect}
                      />
                    </Card>
                  )}
                  {!offerThemeOptions?.length && <EmptyComponent />}
                </Stack>
              )}
              {tabs[selectedTabIndex].id === 'explore' && (
                <>
                  {themeOptions?.length > 0 && (
                    <Stack vertical spacing="tight">
                      {(strategy === 'UPSELL' || strategy === 'CROSS_SELL') && (
                        <TextContainer>
                          <Banner>
                            Themes will adapt to work for both cross-selling and
                            upselling strategies.
                          </Banner>
                        </TextContainer>
                      )}
                      <Card>
                        <OptionList
                          options={themeOptions}
                          selected={selectedTheme}
                          onChange={handleThemeSelect}
                        />
                      </Card>
                    </Stack>
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

ThemeSelector.defaultProps = {
  open: false,
  onThemeSelect: () => {},
  onOfferThemeSelect: () => {},
  onClose: () => {}
};

export default ThemeSelector;
