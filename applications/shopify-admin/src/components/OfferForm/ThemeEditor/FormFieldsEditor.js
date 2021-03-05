import React from 'react';
import PropTypes from 'prop-types';
import {
  EmptyState,
  FormLayout,
  Link,
  Card,
  TextField,
  Button,
  TextStyle,
  Select
} from '@shopify/polaris';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: -2rem;
  margin-bottom: -2rem;
`;

const FormFieldContainer = styled.div`
  border-bottom: 0.1rem solid rgb(225, 227, 229);
  padding-bottom: 2rem;
`;

const FormFieldEditor = ({ formField, onRemoveItem, ...props }) => {
  const filterKeyPresses = (event) => {
    if (!event.key.match(/[a-zA-Z0-9\-_]/)) {
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
      url: 'https://help.domain.com/tutorials/data-integration'
    }}
  >
    Track data from popups, and integrate with third-party services.
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
    <Container>
      <Card.Section>
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
      <Card.Section>
        Set up third-party service integrations on the{' '}
        <Link url="/settings">Settings page</Link>.
      </Card.Section>
    </Container>
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
