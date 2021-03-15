import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Sheet,
  ResourceList,
  ResourceItem,
  DisplayText,
  Button,
  Icon,
  EmptyState,
  TextContainer,
  Scrollable,
  Stack
} from '@shopify/polaris';
import {
  MobileCancelMajor,
  ChevronRightMinor,
  TextBlockMajor,
  ColorsMajor,
  TypeMajor,
  CodeMajor,
  ArrowLeftMinor
} from '@shopify/polaris-icons';
import styled from 'styled-components';
import ContentEditor from './ContentEditor';
import ColorEditor from './ColorEditor';
import FontEditor from './FontEditor';

const sections = [
  {
    id: 'content',
    name: 'Content',
    variableTypes: ['text'],
    icon: TextBlockMajor
  },
  {
    id: 'colors',
    name: 'Colors',
    variableTypes: ['color'],
    icon: ColorsMajor
  },
  {
    id: 'typography',
    name: 'Typography',
    variableTypes: ['font', 'fontSize'],
    icon: TypeMajor
  },
  { id: 'code', name: 'Code', icon: CodeMajor }
];

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f6f8;
`;

const HeaderWrapper = styled.div`
  border-bottom: 1px solid #dfe3e8;
  padding: 1.6rem;
`;

const ContentWrapper = styled.div`
  margin: 1.6rem;

  .Polaris-Card {
    border: 1px solid #dfe3e8;
  }
`;

const ResourceItemIconWrapper = styled.span`
  svg {
    fill: #5c5f62;
  }

  .Polaris-ResourceItem__ListItem:hover {
    svg {
      fill: #1a1c1d;
    }
  }
`;

const EmptyComponent = () => (
  <EmptyState heading="No customization options">
    <TextContainer>No customization options are available.</TextContainer>
  </EmptyState>
);

const VariablesEditor = ({ open, variables, onChange, onClose }) => {
  const [selectedSection, setSelectedSection] = useState(null);

  const sectionVariables = useMemo(() => {
    if (!selectedSection) {
      return [];
    }

    return variables.filter(
      ({ type }) => selectedSection.variableTypes.indexOf(type) > -1
    );
  }, [selectedSection, variables]);

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
          <Stack alignment="center">
            {selectedSection && (
              <Button
                outline
                icon={ArrowLeftMinor}
                onClick={() => setSelectedSection(null)}
              />
            )}
            <Stack.Item fill>
              <DisplayText size="small">
                {selectedSection ? selectedSection.name : 'Theme settings'}
              </DisplayText>
            </Stack.Item>
            <Button
              accessibilityLabel="Cancel"
              icon={MobileCancelMajor}
              onClick={onClose}
              plain
            />
          </Stack>
        </HeaderWrapper>
        {!selectedSection && (
          <ResourceItemIconWrapper>
            <ResourceList
              items={sections}
              renderItem={(section) => (
                <ResourceItem
                  id={section.id}
                  name={section.name}
                  media={<Icon source={section.icon} />}
                  accessibilityLabel={`Edit ${section.name.toLowerCase()}`}
                  shortcutActions={[
                    { content: <Icon source={ChevronRightMinor} /> }
                  ]}
                  persistActions
                  onClick={() => setSelectedSection(section)}
                >
                  {section.name}
                </ResourceItem>
              )}
            />
          </ResourceItemIconWrapper>
        )}
        {selectedSection && (
          /* eslint-disable indent */
          <Scrollable>
            <ContentWrapper>
              {sectionVariables?.length > 0 &&
                selectedSection.id === 'content' && (
                  <ContentEditor
                    variables={sectionVariables}
                    onChange={handleChange}
                  />
                )}
              {sectionVariables?.length > 0 &&
                selectedSection.id === 'colors' && (
                  <ColorEditor
                    variables={sectionVariables}
                    onChange={handleChange}
                  />
                )}
              {sectionVariables?.length > 0 &&
                selectedSection.id === 'typography' && (
                  <FontEditor
                    variables={sectionVariables}
                    onChange={handleChange}
                  />
                )}
              {!sectionVariables?.length && <EmptyComponent />}
            </ContentWrapper>
          </Scrollable>
          /* eslint-enable indent */
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
