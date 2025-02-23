import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, BlockStack, Text, Checkbox } from '@shopify/polaris';
import CountryAutocomplete from './CountryAutocomplete';

const OfferGeotargetingEditor = ({ geotargetingCountries, submitted = false }) => {
  const [enableGeotargeting, setEnableGeotargeting] = useState(geotargetingCountries.value.length > 0);

  const handleEnableGeotargeting = (checked) => {
    setEnableGeotargeting(checked);

    if (!checked) {
      geotargetingCountries.onChange([]);
    }
  };

  return (
    <Card>
      <BlockStack gap="400" padding="400">
        <Text variant="headingMd">Geotargeting</Text>
        <Checkbox
          label="Restrict offer to specific countries"
          checked={enableGeotargeting}
          onChange={handleEnableGeotargeting}
        />
        {enableGeotargeting && (
          <CountryAutocomplete
            label="Countries"
            placeholder="Search"
            selected={geotargetingCountries.value}
            onChange={geotargetingCountries.onChange}
            error={submitted && geotargetingCountries.error}
          />
        )}
      </BlockStack>
    </Card>
  );
};

OfferGeotargetingEditor.propTypes = {
  geotargetingCountries: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

export default OfferGeotargetingEditor;
