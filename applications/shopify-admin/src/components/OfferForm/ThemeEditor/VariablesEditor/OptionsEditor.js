import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, Checkbox, Text, Stack } from '@shopify/polaris';
import { groupBy } from 'lodash';

const OptionsEditor = ({ variables, onChange }) => {
  const groupedVariables = useMemo(
    () => groupBy(variables, 'group'),
    [variables]
  );
  const groupNames = Object.keys(groupedVariables);

  return (
    <Stack vertical>
      {groupNames.map((groupName, groupIndex) => (
        <Stack key={groupIndex} vertical spacing="tight">
          <Text variant="headingXs" as="h3">
            <Text color="subdued">{groupName}</Text>
          </Text>
          <Card sectioned>
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
        </Stack>
      ))}
    </Stack>
  );
};

OptionsEditor.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func
};

OptionsEditor.defaultProps = {
  variables: [],
  onChange: () => {}
};

export default OptionsEditor;
