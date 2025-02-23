import React from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, TextField, Text, BlockStack } from '@shopify/polaris';

const FontEditor = ({ variables = [], onChange = () => {} }) => (
  <BlockStack gap="400">
    <BlockStack gap="200">
      <Text variant="headingXs" as="h3" tone="subdued">
        Settings
      </Text>
      <Card>
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
    </BlockStack>
  </BlockStack>
);

FontEditor.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func
};

export default FontEditor;
