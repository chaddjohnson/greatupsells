import React from 'react';
import PropTypes from 'prop-types';
import {
  EmptyState,
  FormLayout,
  Link,
  Card,
  ResourceList,
  ResourceItem,
  TextField,
  Icon,
  Subheading,
  Button,
  Select,
  Stack
} from '@shopify/polaris';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: -2rem;
  margin-bottom: -2rem;
`;

const FormFieldResourceItemWrapper = styled.div`
  cursor: default;
  margin-left: -1rem;
  margin-right: -1rem;
  border-bottom: 0.1rem solid rgb(225, 227, 229);

  &:last-of-type {
    border-bottom: none;
  }

  && .Polaris-ResourceItem__ItemWrapper {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .Polaris-ResourceItem {
    cursor: default;
  }

  .Polaris-ResourceItem__Container {
    padding-left: 0;
    margin-left: 1rem;
    align-items: flex-end;
  }

  .Polaris-ResourceItem__Actions {
    top: -0.4rem;
  }

  svg {
    fill: #637381;
    &:hover {
      fill: #212b36;
    }
  }
`;

const FormFieldResourceItem = ({ formField, onRemove, ...props }) => {
  const filterKeyPresses = (event) => {
    if (!event.key.match(/[a-zA-Z0-9\-_]/)) {
      event.preventDefault();
    }
  };

  return (
    <FormFieldResourceItemWrapper>
      <ResourceItem
        shortcutActions={[
          {
            content: <Icon source={CancelSmallMinor} />,
            onAction: onRemove
          }
        ]}
        persistActions
        {...props}
      >
        <Stack distribution="fill">
          <div onKeyPress={filterKeyPresses}>
            <TextField
              label="Name"
              type="text"
              value={formField.name}
              onChange={() => {}}
            />
          </div>
          <Select
            label="Type"
            options={[
              { value: 'text', label: 'Text' },
              { value: 'email', label: 'Email' },
              { value: 'number', label: 'Number' },
              { value: 'tel', label: 'Phone' },
              { value: 'checkbox', label: 'Checkbox' },
              { value: 'select', label: 'Select' }
            ]}
            value={formField.type}
            onChange={() => {}}
          />
        </Stack>
      </ResourceItem>
    </FormFieldResourceItemWrapper>
  );
};

FormFieldResourceItem.propTypes = {
  formField: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
};

const FormFieldResourceList = ({ items, onChange, onItemRemoved }) => {
  const removeItem = (index) => [
    ...items.slice(0, index),
    ...items.slice(index + 1)
  ];

  return (
    <ResourceList
      items={items}
      onSelectionChange={onChange}
      renderItem={(formField, index) => (
        <FormFieldResourceItem
          formField={formField}
          onRemove={() => onItemRemoved(removeItem(index, items))}
        />
      )}
    />
  );
};

FormFieldResourceList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  onItemRemoved: PropTypes.func
};

const FormFieldsEditor = ({ formFields, onItemRemoved }) => {
  if (formFields?.length === 0) {
    return (
      <EmptyState
        heading="Manage form fields"
        action={{ content: 'Add form field' }}
        secondaryAction={{
          content: 'Learn more',
          url: 'https://help.domain.com/tutorials/data-integration'
        }}
      >
        Track data from popups, and integrate with third-party services.
      </EmptyState>
    );
  }

  return (
    <Container>
      <Card.Section>
        <Stack vertical spacing="extraTight">
          <Stack alignment="baseline">
            <Stack.Item fill>
              <Subheading>Form fields</Subheading>
            </Stack.Item>
            <Button plain onClick={() => {}}>
              Add field
            </Button>
          </Stack>
          <FormLayout>
            <FormFieldResourceList
              items={formFields}
              onItemRemoved={onItemRemoved}
            />
          </FormLayout>
        </Stack>
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
  onItemRemoved: PropTypes.func
};

FormFieldsEditor.defaultProps = {
  onItemRemoved: () => {}
};

export default FormFieldsEditor;
