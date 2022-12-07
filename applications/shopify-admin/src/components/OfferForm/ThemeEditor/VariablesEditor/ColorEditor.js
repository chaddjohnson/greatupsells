import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, Text, Stack } from '@shopify/polaris';
import { groupBy } from 'lodash';
import ColorPicker from './ColorPicker';

const ColorEditor = ({ variables, onChange }) => {
  const groupedVariables = useMemo(() => groupBy(variables, 'group'), [
    variables
  ]);
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
        </Stack>
      ))}
    </Stack>
  );
};

ColorEditor.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func
};

ColorEditor.defaultProps = {
  variables: [],
  onChange: () => {}
};

export default ColorEditor;
