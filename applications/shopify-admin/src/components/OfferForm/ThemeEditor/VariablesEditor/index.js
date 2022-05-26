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
  ProductsMajor,
  TextBlockMajor,
  ColorsMajor,
  // TypeMajor,
  SettingsMajor,
  // CodeMajor,
  ArrowLeftMinor
} from '@shopify/polaris-icons';
import styled from 'styled-components';
import ContentEditor from './ContentEditor';
import ColorEditor from './ColorEditor';
// import FontEditor from './FontEditor';
import OptionsEditor from './OptionsEditor';
import MetadataEditor from './MetadataEditor';

const sections = [
  {
    id: 'content',
    name: 'Content',
    variableTypes: ['TEXT'],
    icon: TextBlockMajor
  },
  {
    id: 'colors',
    name: 'Colors',
    variableTypes: ['COLOR'],
    icon: ColorsMajor
  },
  // {
  //   id: 'typography',
  //   name: 'Typography',
  //   variableTypes: ['FONT', 'FONTSIZE'],
  //   icon: TypeMajor
  // },
  {
    id: 'options',
    name: 'Options',
    variableTypes: ['OPTION'],
    icon: SettingsMajor
  },
  {
    id: 'metadata',
    name: 'Metadata',
    variableTypes: [],
    icon: ProductsMajor
  }
  // { id: 'code', name: 'Code', icon: CodeMajor }
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

const ResourceListWrapper = styled.span`
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

const VariablesEditor = ({ open, theme, strategy, onChange, onClose }) => {
  const { variables } = theme;

  const [selectedSection, setSelectedSection] = useState(null);

  const sectionVariables = useMemo(() => {
    if (!selectedSection) {
      return [];
    }

    let filteredVariables = variables;

    // Filter by variable types handled by the section.
    filteredVariables = filteredVariables.filter(
      ({ type }) => selectedSection.variableTypes.indexOf(type) > -1
    );

    // Optionally filter by strategy.
    filteredVariables = filteredVariables.filter(
      ({ options = {} }) => !options.strategy || options.strategy === strategy
    );

    return filteredVariables;
  }, [selectedSection, variables, strategy]);

  const handleVariableChange = (variableName, value) => {
    const index = variables.findIndex(
      (variable) => variable.name === variableName
    );

    onChange({
      ...theme,
      variables: [
        ...variables.slice(0, index),
        { ...variables[index], value },
        ...variables.slice(index + 1)
      ]
    });
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
          <ResourceListWrapper>
            <ResourceList
              items={sections}
              renderItem={(section) => (
                <ResourceItem
                  id={section.id}
                  name={section.name}
                  media={<Icon source={section.icon} />}
                  accessibilityLabel={`Edit ${section.name.toLowerCase()}`}
                  verticalAlignment="center"
                  onClick={() => setSelectedSection(section)}
                >
                  <Stack alignment="center">
                    <Stack.Item fill>{section.name}</Stack.Item>
                    <Button
                      icon={ChevronRightMinor}
                      plain
                      onClick={() => setSelectedSection(section)}
                    />
                  </Stack>
                </ResourceItem>
              )}
            />
          </ResourceListWrapper>
        )}
        {selectedSection && (
          <Scrollable>
            <ContentWrapper>
              {sectionVariables?.length > 0 &&
                selectedSection.id === 'content' && (
                  <ContentEditor
                    variables={sectionVariables}
                    onChange={handleVariableChange}
                  />
                )}
              {sectionVariables?.length > 0 &&
                selectedSection.id === 'colors' && (
                  <ColorEditor
                    variables={sectionVariables}
                    onChange={handleVariableChange}
                  />
                )}
              {/* {sectionVariables?.length > 0 &&
                selectedSection.id === 'typography' && (
                  <FontEditor
                    variables={sectionVariables}
                    onChange={handleVariableChange}
                  />
                )} */}
              {sectionVariables?.length > 0 &&
                selectedSection.id === 'options' && (
                  <OptionsEditor
                    variables={sectionVariables}
                    onChange={handleVariableChange}
                  />
                )}
              {selectedSection.id === 'metadata' && (
                <MetadataEditor theme={theme} onChange={onChange} />
              )}
              {!sectionVariables?.length &&
                !!selectedSection.variableTypes?.length && <EmptyComponent />}
            </ContentWrapper>
          </Scrollable>
        )}
      </InnerWrapper>
    </Sheet>
  );
};

VariablesEditor.propTypes = {
  open: PropTypes.bool,
  theme: PropTypes.object,
  strategy: PropTypes.string,
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
