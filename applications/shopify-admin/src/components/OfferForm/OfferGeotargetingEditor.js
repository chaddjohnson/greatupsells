import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Stack, Checkbox } from '@shopify/polaris';
import CountryAutocomplete from './CountryAutocomplete';

const OfferGeotargetingEditor = ({ geotargetingCountries, submitted }) => {
  const [enableGeotargeting, setEnableGeotargeting] = useState(geotargetingCountries.value.length > 0);

  const handleEnableGeotargeting = (checked) => {
    setEnableGeotargeting(checked);

    if (!checked) {
      geotargetingCountries.onChange([]);
    }
  };

  return (
    <Card title="Geotargeting" sectioned>
      <Stack vertical>
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
      </Stack>
    </Card>
  );
};

OfferGeotargetingEditor.propTypes = {
  geotargetingCountries: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

OfferGeotargetingEditor.defaultProps = {
  submitted: false
};

export default OfferGeotargetingEditor;
