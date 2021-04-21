import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  Checkbox,
  Subheading,
  TextStyle,
  Stack
} from '@shopify/polaris';
import { groupBy } from 'lodash';

const OptionsEditor = ({ variables, onChange }) => {
  const groupedVariables = useMemo(() => groupBy(variables, 'group'), [
    variables
  ]);
  const groupNames = Object.keys(groupedVariables);

  return (
    <Stack vertical>
      {groupNames.map((groupName, groupIndex) => (
        <Stack key={groupIndex} vertical spacing="tight">
          <Subheading>
            <TextStyle variation="subdued">{groupName}</TextStyle>
          </Subheading>
          <Card sectioned>
            <FormLayout>
              {groupedVariables[groupName].map((variable, variableIndex) => (
                <Checkbox
                  key={variableIndex}
                  label={variable.label}
                  checked={variable.value === 'true'}
                  onChange={(value) =>
                    onChange(variable.name, value.toString())
                  }
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
