import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, Text, BlockStack } from '@shopify/polaris';
import { groupBy } from 'lodash';
import ColorPicker from './ColorPicker';

const ColorEditor = ({ variables = [], onChange = () => {} }) => {
  const groupedVariables = useMemo(() => groupBy(variables, 'group'), [variables]);
  const groupNames = Object.keys(groupedVariables);

  return (
    <BlockStack gap="400">
      {groupNames.map((groupName, groupIndex) => (
        <BlockStack key={groupIndex} gap="200">
          <Text variant="headingXs" as="h3" tone="subdued">
            {groupName}
          </Text>
          <Card>
            <FormLayout>
              {groupedVariables[groupName].map((variable, variableIndex) => (
                <ColorPicker
                  key={variableIndex}
                  label={variable.label}
                  value={variable.value}
                  allowAlpha={variable.options?.allowAlpha}
                  onChange={(value) => onChange(variable._id, value)}
                />
              ))}
            </FormLayout>
          </Card>
        </BlockStack>
      ))}
    </BlockStack>
  );
};

ColorEditor.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func
};

export default ColorEditor;
