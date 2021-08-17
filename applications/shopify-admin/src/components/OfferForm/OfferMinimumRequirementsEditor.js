import React from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, TextField, ChoiceList } from '@shopify/polaris';
import styled from 'styled-components';
import { useNumberFormatter } from '@neatowebsolutions/upselling-react-hooks';

const MinimumRequiredAmountWrapper = styled.div`
  .Polaris-TextField {
    max-width: 150px;
  }
`;

const OfferSettingsEditor = ({
  shop,
  minimumRequirements,
  minimumRequiredAmount,
  submitted
}) => {
  const { locale, countryCode, currency } = shop || {};
  const { getCurrencySymbol } = useNumberFormatter({
    locale,
    countryCode,
    currency
  });
  const currencySymbol = getCurrencySymbol();

  const handleMinimumRequirementsChange = (value) => {
    minimumRequirements.onChange(value);
    minimumRequiredAmount.onChange(undefined);
  };

  return (
    <>
      <Card title="Minimum requirements" sectioned>
        <FormLayout>
          <ChoiceList
            choices={[
              {
                label: 'None',
                value: 'NONE'
              },
              {
                label: `Minimum purchase amount (${currencySymbol})`,
                value: 'AMOUNT',
                renderChildren: (isSelected) =>
                  isSelected && (
                    <MinimumRequiredAmountWrapper>
                      <TextField
                        inputMode="numeric"
                        prefix={currencySymbol}
                        placeholder="0.00"
                        helpText="Applies to all products."
                        {...minimumRequiredAmount}
                        error={submitted && minimumRequiredAmount.error}
                      />
                    </MinimumRequiredAmountWrapper>
                  )
              },
              {
                label: 'Minimum quantity of items',
                value: 'QUANTITY',
                renderChildren: (isSelected) =>
                  isSelected && (
                    <MinimumRequiredAmountWrapper>
                      <TextField
                        inputMode="numeric"
                        helpText="Applies to all products."
                        {...minimumRequiredAmount}
                        error={submitted && minimumRequiredAmount.error}
                      />
                    </MinimumRequiredAmountWrapper>
                  )
              }
            ]}
            selected={minimumRequirements.value}
            onChange={([value]) => handleMinimumRequirementsChange(value)}
          />
        </FormLayout>
      </Card>
    </>
  );
};

OfferSettingsEditor.propTypes = {
  shop: PropTypes.object.isRequired,
  minimumRequirements: PropTypes.object.isRequired,
  minimumRequiredAmount: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

OfferSettingsEditor.defaultProps = {
  submitted: false
};

export default OfferSettingsEditor;
