import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Button,
  FormLayout,
  TextField,
  Select,
  TextStyle,
  EmptyState,
  Popover,
  Stack
} from '@shopify/polaris';
import styled from 'styled-components';
import ColorPicker from '../../ColorPicker';

const Container = styled.div`
  margin-top: -2rem;
  margin-bottom: -2rem;
`;

const ColorPreview = styled.div`
  border: 1px solid rgb(225, 227, 229);
  width: 30px;
  height: 30px;
  display: inline-block;
  vertical-align: middle;
  margin-left: -30px;
  cursor: pointer;
`;

const VariableContainer = styled.div`
  border-bottom: 0.1rem solid rgb(225, 227, 229);
  padding-bottom: 2rem;
`;

const VariableEditor = ({ variable, onChange, onRemoveItem, ...props }) => {
  const [colorPickerActive, setColorPickerActive] = useState(false);

  const filterKeyPresses = (event) => {
    if (!event.key.match(/[a-zA-Z0-9\-_]/)) {
      event.preventDefault();
    }
  };

  const handleTypeChange = (value) => {
    // onChange();
  };

  const valueInput = (
    <TextField
      type="text"
      label="Value"
      placeholder="#000000"
      maxLength={7}
      readOnly
      value={variable.value}
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
              { value: 'color', label: 'Color' }
            ]}
            value={variable.type}
            onChange={() => {}}
          />
        </div>
      }
      suffix={
        variable.type === 'color' && (
          <ColorPreview style={{ backgroundColor: variable.value }} />
        )
      }
      onChange={() => {}}
      onFocus={() => setColorPickerActive(true)}
    />
  );

  return (
    <VariableContainer onKeyPress={filterKeyPresses} {...props}>
      <Stack distribution="fillEvenly" alignment="trailing" spacing="tight">
        <TextField
          type="text"
          label="Name"
          value={variable.name}
          onChange={() => {}}
        />
        {variable.type === 'color' ? (
          <Popover
            active={colorPickerActive}
            activator={valueInput}
            preferredAlignment="left"
            sectioned
            onClose={() => setColorPickerActive(false)}
          >
            <ColorPicker value={variable.value} onChange={() => {}} />
          </Popover>
        ) : (
          valueInput
        )}
      </Stack>
    </VariableContainer>
  );
};

VariableEditor.propTypes = {
  variable: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onRemoveItem: PropTypes.func
};

VariableEditor.defaltProps = {
  onChange: () => {},
  onRemoveItem: () => {}
};

const EmptyComponent = ({ onAddItem }) => (
  <EmptyState
    heading="Manage variables"
    action={{
      content: 'Add variable',
      onAction: onAddItem
    }}
    secondaryAction={{
      content: 'Learn more',
      url: 'https://help.domain.com/tutorials/template-variables'
    }}
  >
    Enable template customization using variables.
  </EmptyState>
);

EmptyComponent.propTypes = {
  onAddItem: PropTypes.func
};

EmptyComponent.defaultProps = {
  onAddItem: () => {}
};

const VariablesEditor = ({ variables, onAddItem, onRemoveItem }) => {
  const handleAddItem = () => {
    onAddItem({
      name: '',
      type: 'text',
      value: ''
    });
  };

  if (variables?.length === 0) {
    return <EmptyComponent onAddItem={handleAddItem} />;
  }

  return (
    <Container>
      <Card.Section>
        <FormLayout>
          {variables.map((variable, index) => (
            <VariableEditor
              key={index}
              variable={variable}
              // onChange={() => {}}
              onRemoveItem={() => onRemoveItem(index)}
            />
          ))}
          <Button onClick={handleAddItem}>
            <TextStyle variation="strong">Add another field</TextStyle>
          </Button>
        </FormLayout>
      </Card.Section>
    </Container>
  );
};

VariablesEditor.propTypes = {
  variables: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  onAddItem: PropTypes.func,
  onRemoveItem: PropTypes.func
};

VariablesEditor.defaultProps = {
  onAddItem: () => {},
  onRemoveItem: () => {}
};

export default VariablesEditor;
