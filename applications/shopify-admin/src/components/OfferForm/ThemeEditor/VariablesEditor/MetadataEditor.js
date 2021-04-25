import React from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, TextField } from '@shopify/polaris';

const MetadataEditor = ({ theme, onChange }) => {
  const handleChange = (name, value) => {
    onChange({ ...theme, [name]: value });
  };

  return (
    <Card sectioned>
      <FormLayout>
        <TextField
          type="text"
          label="Name"
          value={theme.name}
          onChange={(value) => handleChange('name', value)}
        />
        <TextField
          type="text"
          label="Description"
          multiline={4}
          value={theme.description}
          onChange={(value) => handleChange('description', value)}
        />
      </FormLayout>
    </Card>
  );
};

MetadataEditor.propTypes = {
  theme: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

MetadataEditor.defaultProps = {
  onChange: () => {}
};

export default MetadataEditor;
