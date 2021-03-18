import React from 'react';
import PropTypes from 'prop-types';
import {
  EmptyState,
  FormLayout,
  Card,
  TextField,
  Button,
  TextStyle,
  Select,
  TextContainer
} from '@shopify/polaris';
import styled from 'styled-components';

const FormFieldContainer = styled.div`
  border-bottom: 0.1rem solid rgb(225, 227, 229);
  padding-bottom: 2rem;
`;

const FormFieldEditor = ({ formField, onRemoveItem, ...props }) => {
  const filterKeyPresses = (event) => {
    const isNameCharacter = !event.key.match(/[a-zA-Z0-9\-_]/);
    const isDelete = event.key === 'Delete';
    const isBackspace = event.key === 'Backspace';

    if (!isNameCharacter && !isDelete && !isBackspace) {
      event.preventDefault();
    }
  };

  return (
    <FormFieldContainer onKeyPress={filterKeyPresses} {...props}>
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
                { value: 'text', label: 'Text' },
                { value: 'email', label: 'Email' },
                { value: 'number', label: 'Number' },
                { value: 'tel', label: 'Phone' },
                { value: 'checkbox', label: 'Checkbox' },
                { value: 'select', label: 'Select' },
                { value: 'radio', label: 'Radio' }
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

FormFieldEditor.defaltProps = {
  onRemoveItem: () => {}
};

const EmptyComponent = ({ onAddItem }) => (
  <EmptyState
    heading="Manage form fields"
    action={{ content: 'Add form field', onAction: onAddItem }}
    secondaryAction={{
      content: 'Learn more',
      url: 'https://help.domain.com/tutorials/data-integrations'
    }}
  >
    <TextContainer>
      Track data from popups, and integrate with third-party services.
    </TextContainer>
  </EmptyState>
);

EmptyComponent.propTypes = {
  onAddItem: PropTypes.func
};

EmptyComponent.defaultProps = {
  onAddItem: () => {}
};

const FormFieldsEditor = ({ formFields, onAddItem, onRemoveItem }) => {
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
    <>
      <Card.Section title="Form fields">
        <FormLayout>
          {formFields.map((formField, index) => (
            <FormFieldEditor
              key={index}
              formField={formField}
              onRemoveItem={() => onRemoveItem(index)}
            />
          ))}
          <Button onClick={handleAddItem}>
            <TextStyle variation="strong">Add another field</TextStyle>
          </Button>
        </FormLayout>
      </Card.Section>
    </>
  );
};

FormFieldsEditor.propTypes = {
  formFields: PropTypes.array.isRequired,
  onAddItem: PropTypes.func,
  onRemoveItem: PropTypes.func
};

FormFieldsEditor.defaultProps = {
  onAddItem: () => {},
  onRemoveItem: () => {}
};

export default FormFieldsEditor;
