import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, ButtonGroup, Button, Stack } from '@shopify/polaris';
import ThemeSelector from './ThemeSelector';
import VariablesEditor from './VariablesEditor';

const ThemeEditor = ({
  strategy,
  theme,
  themes,
  offerThemes,
  previewElement,
  onPreview,
  onChange,
  onThemeSelect,
  onOfferThemeSelect
}) => {
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const [variablesEditorOpen, setVariablesEditorOpen] = useState(false);

  const handleChange = (value) => {
    onChange({
      ...value,
      __id_offerForm: theme.__id_offerForm
    });
  };

  return (
    <>
      <Card>
        <Card.Header title="Theme">
          <ButtonGroup>
            <Button onClick={() => setThemeSelectorOpen(true)}>Select</Button>
            <Button primary onClick={() => setVariablesEditorOpen(true)}>
              Customize
            </Button>
          </ButtonGroup>
        </Card.Header>
        <Card.Section>
          <Stack vertical spacing="tight">
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
  previewElement: PropTypes.node,
  onPreview: PropTypes.func,
  onChange: PropTypes.func,
  onThemeSelect: PropTypes.func,
  onOfferThemeSelect: PropTypes.func
};

ThemeEditor.defaultProps = {
  theme: {},
  themes: [],
  offerThemes: [],
  onPreview: () => {},
  onChange: () => {},
  onThemeSelect: () => {},
  onOfferThemeSelect: () => {}
};

export default ThemeEditor;
