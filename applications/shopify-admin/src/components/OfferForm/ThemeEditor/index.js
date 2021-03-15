import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, ButtonGroup, Button, Heading, Stack } from '@shopify/polaris';
import ThemeSelector from './ThemeSelector';
import VariablesEditor from './VariablesEditor';

const ThemeEditor = ({ type, theme, themes, previewElement, onChange }) => {
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const [variablesEditorOpen, setVariablesEditorOpen] = useState(false);

  const handleVariablesChange = (values) => {
    onChange({ ...theme, variables: values });
  };

  return (
    <>
      <Card>
        <Card.Section>
          <Stack vertical spacing="loose">
            <Stack alignment="baseline">
              <Stack.Item fill>
                <Heading>Theme</Heading>
              </Stack.Item>
              <ButtonGroup>
                <Button onClick={() => setThemeSelectorOpen(true)}>
                  Select
                </Button>
                <Button primary onClick={() => setVariablesEditorOpen(true)}>
                  Customize
                </Button>
              </ButtonGroup>
            </Stack>
            {previewElement}
          </Stack>
        </Card.Section>
      </Card>
      <ThemeSelector
        open={themeSelectorOpen}
        type={type}
        theme={theme}
        themes={themes}
        onChange={onChange}
        onClose={() => setThemeSelectorOpen(false)}
      />
      <VariablesEditor
        open={variablesEditorOpen}
        variables={theme.variables}
        onChange={handleVariablesChange}
        onClose={() => setVariablesEditorOpen(false)}
      />
    </>
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
