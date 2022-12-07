import React from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, TextField, Text, Stack } from '@shopify/polaris';

const FontEditor = ({ variables, onChange }) => (
  <Stack vertical>
    <Stack vertical spacing="tight">
      <Text variant="headingXs" as="h3">
        <Text color="subdued">Settings</Text>
      </Text>
      <Card sectioned>
        <FormLayout>
          {variables.map((variable, variableIndex) => (
            <TextField
              key={variableIndex}
              type="text"
              label={variable.label}
              value={variable.value}
              onChange={(newValue) => onChange(variable._id, newValue)}
            />
          ))}
        </FormLayout>
      </Card>
    </Stack>
  </Stack>
);

FontEditor.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func
};

FontEditor.defaultProps = {
  variables: [],
  onChange: () => {}
};

export default FontEditor;
