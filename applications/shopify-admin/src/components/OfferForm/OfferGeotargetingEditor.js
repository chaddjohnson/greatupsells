import React from 'react';
import PropTypes from 'prop-types';
import { Card, Stack, Checkbox } from '@shopify/polaris';
import { asChoiceField } from '@shopify/react-form';
import CountryAutocomplete from './CountryAutocomplete';

const OfferGeotargetingEditor = ({
  enableGeotargeting,
  geotargetingCountries,
  submitted,
  onBlur
}) => {
  const handleEnableGeotargeting = (value) => {
    enableGeotargeting.onChange(value);

    if (!value) {
      geotargetingCountries.onChange([]);
    }
  };

  return (
    <Card title="Geotargeting" sectioned>
      <Stack vertical>
        <Checkbox
          label="Restrict offer to specific countries"
          {...asChoiceField(enableGeotargeting)}
          onChange={handleEnableGeotargeting}
        />
        {enableGeotargeting.value && (
          <CountryAutocomplete
            label="Countries"
            placeholder="Search"
            selected={geotargetingCountries.value}
            onChange={geotargetingCountries.onChange}
            error={submitted && geotargetingCountries.error}
            onBlur={() => onBlur('geotargetingCountries')}
          />
        )}
      </Stack>
    </Card>
  );
};

OfferGeotargetingEditor.propTypes = {
  enableGeotargeting: PropTypes.object.isRequired,
  geotargetingCountries: PropTypes.object.isRequired,
  submitted: PropTypes.bool,
  onBlur: PropTypes.func
};

OfferGeotargetingEditor.defaultProps = {
  submitted: false,
  onBlur: () => {}
};

export default OfferGeotargetingEditor;
