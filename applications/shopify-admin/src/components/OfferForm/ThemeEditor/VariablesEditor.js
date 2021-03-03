import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Button,
  FormLayout,
  Icon,
  TextField,
  ResourceList,
  ResourceItem,
  Subheading,
  Stack,
  EmptyState
} from '@shopify/polaris';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import { groupBy } from 'lodash';
import styled from 'styled-components';
import ColorPicker from '../../ColorPicker';

const Container = styled.div`
  margin-top: -2rem;
  margin-bottom: -2rem;
`;

const VariableResourceItemWrapper = styled.div`
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
    align-items: center;
  }

  .Polaris-ResourceItem__Actions {
    top: ${(props) => (props.type === 'text' ? '1.3rem' : 0)};
  }

  svg {
    fill: #637381;
    &:hover {
      fill: #212b36;
    }
  }
`;

const VariableResourceItem = ({ type, variable, onRemove, ...props }) => (
  <VariableResourceItemWrapper type={type.value}>
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
      {type.value === 'text' && (
        <Stack distribution="fill">
          <TextField
            label="Name"
            type="text"
            value={variable.name}
            onChange={() => {}}
          />
          <TextField
            label="Value"
            type="text"
            value={variable.value}
            onChange={() => {}}
          />
        </Stack>
      )}
      {type.value === 'color' && (
        <ColorPicker
          label={variable.name}
          value={variable.value}
          onChange={() => {}}
        />
      )}
    </ResourceItem>
  </VariableResourceItemWrapper>
);

VariableResourceItem.propTypes = {
  type: PropTypes.object.isRequired,
  variable: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
};

const VariableResourceList = ({ type, items, onChange, onItemRemoved }) => {
  const removeItem = (index) => [
    ...items.slice(0, index),
    ...items.slice(index + 1)
  ];

  return (
    <ResourceList
      items={items}
      onSelectionChange={onChange}
      renderItem={(variable, index) => (
        <VariableResourceItem
          type={type}
          variable={variable}
          onRemove={() => onItemRemoved(removeItem(index, items))}
        />
      )}
    />
  );
};

VariableResourceList.propTypes = {
  type: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  onItemRemoved: PropTypes.func
};

const VariablesEditor = ({ variables, onItemRemoved }) => {
  const variablesByType = useMemo(() => groupBy(variables, 'type'), [
    variables
  ]);
  const types = [
    {
      value: 'text',
      name: 'Texts',
      nameSingular: 'Text'
    },
    {
      value: 'color',
      name: 'Colors',
      nameSingular: 'Color'
    }
  ];

  if (Object.keys(variablesByType).length === 0) {
    return (
      <EmptyState
        heading="Manage variables"
        action={{ content: 'Add variable' }}
      >
        Enable template customization using variables.
      </EmptyState>
    );
  }

  return (
    <Container>
      {types.map((type) => {
        const typeVariables = variablesByType[type.value];

        if (!typeVariables?.length) {
          return null;
        }

        return (
          <Card.Section key={type.value}>
            <Stack vertical spacing="extraTight">
              <Stack alignment="baseline">
                <Stack.Item fill>
                  <Subheading>{type.name}</Subheading>
                </Stack.Item>
                <Button plain onClick={() => {}}>
                  Add {type.nameSingular.toLowerCase()}
                </Button>
              </Stack>
              <FormLayout>
                <VariableResourceList
                  type={type}
                  items={typeVariables}
                  onItemRemoved={onItemRemoved}
                />
              </FormLayout>
            </Stack>
          </Card.Section>
        );
      })}
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
  onItemRemoved: PropTypes.func
};

VariablesEditor.defaultProps = {
  onItemRemoved: () => {}
};

export default VariablesEditor;
