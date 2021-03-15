import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Sheet,
  Heading,
  Button,
  Scrollable,
  Card,
  FormLayout,
  TextField,
  EmptyState,
  TextContainer,
  Subheading,
  TextStyle,
  Stack
} from '@shopify/polaris';
import { MobileCancelMajor } from '@shopify/polaris-icons';
import styled from 'styled-components';
import { groupBy } from 'lodash';

const types = [
  { name: 'Content', value: 'text' },
  { name: 'Color', value: 'color' }
];

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f6f8;
`;

const HeaderWrapper = styled.div`
  align-items: center;
  border-bottom: 1px solid #dfe3e8;
  display: flex;
  justify-content: space-between;
  padding: 1.6rem;
  width: 100%;
  background-color: #ffffff;
`;

const ContentWrapper = styled.div`
  margin: 1.6rem;

  .Polaris-Card {
    border: 1px solid #dfe3e8;
  }
`;

const EmptyComponent = () => (
  <EmptyState heading="No customization options">
    <TextContainer>
      No customization options are available for this template.
    </TextContainer>
  </EmptyState>
);

const VariablesEditor = ({ open, variables, onChange, onClose }) => {
  const variablesByType = useMemo(() => groupBy(variables, 'type'), [
    variables
  ]);

  const handleSave = () => {
    // TODO
    // onChange();
    onClose();
  };

  const handleChange = (name, value) => {
    const index = variables.findIndex((variable) => variable.name === name);

    onChange([
      ...variables.slice(0, index),
      { ...variables[index], value },
      ...variables.slice(index + 1)
    ]);
  };

  return (
    <Sheet open={open} onClose={onClose} accessibilityLabel="Edit theme">
      <InnerWrapper>
        <HeaderWrapper>
          <Heading>Edit theme</Heading>
          <Button
            accessibilityLabel="Cancel"
            icon={MobileCancelMajor}
            onClick={onClose}
            plain
          />
        </HeaderWrapper>
        {variables?.length > 0 ? (
          <Scrollable>
            <ContentWrapper>
              <Stack vertical>
                {types.map((type, typeIndex) => {
                  const typeVariables = variablesByType[type.value];

                  return (
                    <Stack key={typeIndex} vertical spacing="tight">
                      <Subheading>
                        <TextStyle variation="subdued">{type.name}</TextStyle>
                      </Subheading>
                      <Card sectioned>
                        <FormLayout>
                          {typeVariables.map((variable, variableIndex) => (
                            <TextField
                              key={variableIndex}
                              type="text"
                              label={variable.label}
                              value={variable.value}
                              onChange={(newValue) =>
                                handleChange(variable.name, newValue)
                              }
                            />
                          ))}
                        </FormLayout>
                      </Card>
                    </Stack>
                  );
                })}
              </Stack>
            </ContentWrapper>
          </Scrollable>
        ) : (
          <EmptyComponent />
        )}
      </InnerWrapper>
    </Sheet>
  );
};

VariablesEditor.propTypes = {
  open: PropTypes.bool,
  variables: PropTypes.array,
  onChange: PropTypes.func,
  onClose: PropTypes.func
};

VariablesEditor.defaultProps = {
  open: false,
  theme: {
    variables: []
  },
  onChange: () => {},
  onClose: () => {}
};

export default VariablesEditor;
