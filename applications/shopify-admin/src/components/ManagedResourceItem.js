import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ResourceItem, Icon } from '@shopify/polaris';
import { CancelSmallMinor } from '@shopify/polaris-icons';

const ManagedResourceItemWrapper = styled.div`
  cursor: default;

  .Polaris-ResourceItem {
    cursor: default;

    &:hover {
      background-image: none;
    }
  }

  .Polaris-ResourceItem__Container {
    padding-left: 0;
  }

  .Polaris-ResourceItem__Container {
    align-items: center;
  }

  svg {
    fill: #637381;

    &:hover {
      fill: #212b36;
    }
  }
`;

const ManagedResourceItem = ({ children, onRemove, ...props }) => (
  <ManagedResourceItemWrapper>
    <ResourceItem
      shortcutActions={[
        { content: <Icon source={CancelSmallMinor} />, onAction: onRemove }
      ]}
      persistActions
      {...props}
    >
      {children}
    </ResourceItem>
  </ManagedResourceItemWrapper>
);

ManagedResourceItem.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  onRemove: PropTypes.func.isRequired
};

export default ManagedResourceItem;
