import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState, FormLayout, BlockStack, TextField, Button, Text, Select, Text } from '@shopify/polaris';
import styled from 'styled-components';

const FormFieldContainer = styled.div`
  border-bottom: 0.1rem solid rgb(225, 227, 229);
  padding-bottom: 2rem;
`;

const FormFieldEditor = ({ formField, onRemoveItem = () => {}, ...props }) => {
  const filterKeyPresses = (event) => {
    const isNameCharacter = !event.key.match(/[a-zA-Z0-9\-_]/);
    const isDelete = event.key === 'Delete';
    const isBackspace = event.key === 'Backspace';

    if (!isNameCharacter && !isDelete && !isBackspace) {
      event.preventDefault();
    }
  };

  return (
    <FormFieldContainer onKeyDown={filterKeyPresses} {...props}>
      <TextField
        type="text"
        label="Field name"
        value={formField.name}
        labelAction={{
          content: 'Remove',
          onAction: onRemoveItem
        }}
        connectedRight={
          <div style={{ width: '10rem' }}>
            <Select
              label="Type"
              labelHidden
              options={[
                { value: 'TEXT', label: 'Text' },
                { value: 'EMAIL', label: 'Email' },
                { value: 'NUMBER', label: 'Number' },
                { value: 'TEL', label: 'Phone' },
                { value: 'CHECKBOX', label: 'Checkbox' },
                { value: 'SELECT', label: 'Select' },
                { value: 'RADIO', label: 'Radio' }
              ]}
              value={formField.type}
              onChange={() => {}}
            />
          </div>
        }
        onChange={() => {}}
      />
    </FormFieldContainer>
  );
};

FormFieldEditor.propTypes = {
  formField: PropTypes.object.isRequired,
  onRemoveItem: PropTypes.func
};

const EmptyComponent = ({ onAddItem = () => {} }) => (
  <EmptyState
    heading="Manage form fields"
    action={{ content: 'Add form field', onAction: onAddItem }}
    secondaryAction={{
      content: 'Learn more',
      url: 'https://help.domain.com/tutorials/data-integrations'
    }}
  >
    <Text as="p">Track data from popups, and integrate with third-party services.</Text>
  </EmptyState>
);

EmptyComponent.propTypes = {
  onAddItem: PropTypes.func
};

const FormFieldsEditor = ({ formFields, onAddItem = () => {}, onRemoveItem = () => {} }) => {
  const handleAddItem = () => {
    onAddItem({
      name: '',
      type: 'text'
    });
  };

  if (formFields?.length === 0) {
    return <EmptyComponent onAddItem={handleAddItem} />;
  }

  return (
    <BlockStack gap="400" padding="400">
      <FormLayout>
        {formFields.map((formField, index) => (
          <FormFieldEditor key={index} formField={formField} onRemoveItem={() => onRemoveItem(index)} />
        ))}
        <Button onClick={handleAddItem}>
          <Text fontWeight="bold">Add another field</Text>
        </Button>
      </FormLayout>
    </BlockStack>
  );
};

FormFieldsEditor.propTypes = {
  formFields: PropTypes.array.isRequired,
  onAddItem: PropTypes.func,
  onRemoveItem: PropTypes.func
};

export default FormFieldsEditor;
