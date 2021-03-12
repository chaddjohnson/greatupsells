import React from 'react';
import PropTypes from 'prop-types';
import {
  Sheet,
  Heading,
  Button,
  Scrollable,
  PageActions
} from '@shopify/polaris';
import { MobileCancelMajor } from '@shopify/polaris-icons';
import styled from 'styled-components';

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const HeaderWrapper = styled.div`
  align-items: center;
  border-bottom: 1px solid #dfe3e8;
  display: flex;
  justify-content: space-between;
  padding: 1.6rem;
  width: 100%;
`;

const PageActionsWrapper = styled.div`
  width: 100%;
  padding: 1.6rem;
  padding-bottom: 0;
`;

const VariablesEditor = ({ open, theme, onChange, onClose }) => {
  const handleSave = () => {
    // TODO
    // onChange();
    onClose();
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
        <Scrollable>List of variables</Scrollable>
        <PageActionsWrapper>
          <PageActions
            primaryAction={{
              content: 'Select',
              onAction: handleSave
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: onClose
              }
            ]}
          />
        </PageActionsWrapper>
      </InnerWrapper>
    </Sheet>
  );
};

VariablesEditor.propTypes = {
  open: PropTypes.bool,
  theme: PropTypes.object,
  onChange: PropTypes.func,
  onClose: PropTypes.func
};

VariablesEditor.defaultProps = {
  open: false,
  theme: {},
  onChange: () => {},
  onClose: () => {}
};

export default VariablesEditor;
