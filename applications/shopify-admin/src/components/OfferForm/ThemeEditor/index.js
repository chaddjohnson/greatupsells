import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, ButtonGroup, Button, Stack } from '@shopify/polaris';
import { DesktopMajor, MobileMajor } from '@shopify/polaris-icons';
import styled from 'styled-components';
import ThemeSelector from './ThemeSelector';
import VariablesEditor from './VariablesEditor';

const DeviceToggle = styled.div`
  display: none;

  @media screen and (min-width: 768px) {
    display: block;
  }
`;

const ThemeEditor = ({
  strategy,
  theme,
  themes,
  offerThemes,
  displayType,
  previewElement,
  onPreview,
  onChange,
  onThemeSelect,
  onOfferThemeSelect,
  onDisplayTypeChange
}) => {
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const [variablesEditorOpen, setVariablesEditorOpen] = useState(false);

  const handleChange = (value) => {
    onChange({
      ...value,
      __id_offerForm: theme.__id_offerForm
    });
  };

  const handleDisplayTypeChange = (value) => {
    onDisplayTypeChange(value);
  };

  return (
    <>
      <Card>
        <Card.Header title="Theme">
          <ButtonGroup>
            <Button onClick={() => setThemeSelectorOpen(true)}>
              Select theme
            </Button>
            <Button primary onClick={() => setVariablesEditorOpen(true)}>
              Customize
            </Button>
          </ButtonGroup>
        </Card.Header>
        <Card.Section>
          <Stack vertical spacing="tight">
            <DeviceToggle>
              <ButtonGroup segmented>
                <Button
                  icon={DesktopMajor}
                  outline
                  pressed={displayType === 'desktop'}
                  onClick={() => handleDisplayTypeChange('desktop')}
                >
                  Desktop
                </Button>
                <Button
                  icon={MobileMajor}
                  outline
                  pressed={displayType === 'mobile'}
                  onClick={() => handleDisplayTypeChange('mobile')}
                >
                  Mobile
                </Button>
              </ButtonGroup>
            </DeviceToggle>
            {previewElement}
            <Button fullWidth onClick={onPreview}>
              Preview full size
            </Button>
          </Stack>
        </Card.Section>
      </Card>
      <ThemeSelector
        open={themeSelectorOpen}
        strategy={strategy}
        theme={theme}
        themes={themes}
        offerThemes={offerThemes}
        onThemeSelect={onThemeSelect}
        onOfferThemeSelect={onOfferThemeSelect}
        onClose={() => setThemeSelectorOpen(false)}
      />
      <VariablesEditor
        open={variablesEditorOpen}
        theme={theme}
        strategy={strategy}
        onChange={handleChange}
        onClose={() => setVariablesEditorOpen(false)}
      />
    </>
  );
};

ThemeEditor.propTypes = {
  strategy: PropTypes.string.isRequired,
  theme: PropTypes.object,
  themes: PropTypes.array,
  offerThemes: PropTypes.array,
  displayType: PropTypes.oneOf(['desktop', 'mobile']),
  previewElement: PropTypes.node,
  onPreview: PropTypes.func,
  onChange: PropTypes.func,
  onThemeSelect: PropTypes.func,
  onOfferThemeSelect: PropTypes.func,
  onDisplayTypeChange: PropTypes.func
};

ThemeEditor.defaultProps = {
  theme: {},
  themes: [],
  offerThemes: [],
  displayType: 'desktop',
  onPreview: () => {},
  onChange: () => {},
  onThemeSelect: () => {},
  onOfferThemeSelect: () => {},
  onDisplayTypeChange: () => {}
};

export default ThemeEditor;
