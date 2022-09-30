import React from 'react';
import PropTypes from 'prop-types';
import { Card, TextField, ChoiceList } from '@shopify/polaris';
import styled from 'styled-components';

const ViewAllowanceDaysInputWrapper = styled.div`
  .Polaris-TextField {
    max-width: 125px;
  }
`;

const OfferViewAllowanceEditor = ({
  offer,
  viewAllowance,
  viewAllowanceDays,
  submitted
}) => {
  const handleViewAllowanceChange = (value) => {
    if (value === 'DAYS') {
      viewAllowanceDays.onChange('7');
    } else {
      viewAllowanceDays.onChange(undefined);
    }

    viewAllowance.onChange(value);
  };

  // Do not render this component for post-checkout offers.
  if (offer.strategy === 'POST_PURCHASE') {
    return null;
  }

  return (
    <Card title="View frequency allowance" sectioned>
      <ChoiceList
        choices={[
          {
            label: 'Once within a period of days',
            helpText:
              'Customers may only see this offer once within a period of days.',
            renderChildren: (isSelected) =>
              isSelected && (
                <ViewAllowanceDaysInputWrapper>
                  <TextField
                    inputMode="numeric"
                    suffix="days"
                    min={1}
                    {...viewAllowanceDays}
                    error={submitted && viewAllowanceDays.error}
                  />
                </ViewAllowanceDaysInputWrapper>
              ),
            value: 'DAYS'
          },
          {
            label: 'Once per browser tab session',
            helpText:
              'Customers may see this offer only once per browser tab session.',
            value: 'SESSION'
          },
          {
            label: 'One time',
            helpText: 'Customers may see this offer only one time.',
            value: 'ONCE'
          },
          {
            label: 'Once every page load',
            helpText:
              'Customers may see this offer with every new page visited.',
            value: 'PAGE'
          }
        ]}
        selected={viewAllowance.value}
        onChange={([value]) => handleViewAllowanceChange(value)}
      />
    </Card>
  );
};

OfferViewAllowanceEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  viewAllowance: PropTypes.object.isRequired,
  viewAllowanceDays: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

OfferViewAllowanceEditor.defaultProps = {
  submitted: false
};

export default OfferViewAllowanceEditor;
