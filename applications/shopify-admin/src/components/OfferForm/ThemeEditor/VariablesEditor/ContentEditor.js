import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  TextField,
  Subheading,
  TextStyle,
  Stack
} from '@shopify/polaris';

const ContentEditor = ({ variables, onChange }) => (
  <Stack vertical>
    <Stack vertical spacing="tight">
      <Subheading>
        <TextStyle variation="subdued">Settings</TextStyle>
      </Subheading>
      <Card sectioned>
        <FormLayout>
          {variables.map((variable, variableIndex) => (
            <TextField
              key={variableIndex}
              type="text"
              label={variable.label}
              value={variable.value}
              onChange={(value) => onChange(variable.name, value)}
            />
          ))}
        </FormLayout>
      </Card>
    </Stack>
  </Stack>
);

ContentEditor.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func
};

ContentEditor.defaultProps = {
  variables: [],
  onChange: () => {}
};

export default ContentEditor;
