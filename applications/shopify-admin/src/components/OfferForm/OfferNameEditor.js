import React from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, TextField, BlockStack, Text } from '@shopify/polaris';

const OfferNameEditor = ({ name, submitted = false }) => (
  <Card>
    <BlockStack gap="400" padding="400">
      <Text variant="headingMd">Offer name</Text>
      <FormLayout>
        <TextField
          placeholder="Buy one get one 10% off"
          helpText="Internal name for your reference."
          {...name}
          error={submitted && name.error}
        />
      </FormLayout>
    </BlockStack>
  </Card>
);

OfferNameEditor.propTypes = {
  name: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

export default OfferNameEditor;
