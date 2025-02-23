import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, Checkbox, Text, BlockStack } from '@shopify/polaris';
import { groupBy } from 'lodash';

const OptionsEditor = ({ variables = [], onChange = () => {} }) => {
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
                <Checkbox
                  key={variableIndex}
                  label={variable.label}
                  helpText={variable.helpText}
                  checked={variable.value === 'true'}
                  onChange={(value) => onChange(variable._id, value.toString())}
                />
              ))}
            </FormLayout>
          </Card>
        </BlockStack>
      ))}
    </BlockStack>
  );
};

OptionsEditor.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func
};

export default OptionsEditor;
