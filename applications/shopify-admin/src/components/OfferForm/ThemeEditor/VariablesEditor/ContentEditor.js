import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  TextField,
  Subheading,
  TextStyle,
  Stack
} from '@shopify/polaris';
import { groupBy } from 'lodash';

const ContentEditor = ({ variables, onChange }) => {
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
        </Stack>
      ))}
    </Stack>
  );
};

ContentEditor.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func
};

ContentEditor.defaultProps = {
  variables: [],
  onChange: () => {}
};

export default ContentEditor;
