import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, TextField, Text, BlockStack } from '@shopify/polaris';
import { groupBy } from 'lodash';

const ContentEditor = ({ variables = [], onChange = () => {} }) => {
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
                <TextField
                  key={variableIndex}
                  type="text"
                  label={variable.label}
                  value={variable.value}
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

ContentEditor.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func
};

export default ContentEditor;
