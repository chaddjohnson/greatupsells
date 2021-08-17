import React from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, TextField } from '@shopify/polaris';

const OfferNameEditor = ({ name, submitted }) => (
  <>
    <Card title="Offer name" sectioned>
      <FormLayout>
        <TextField
          placeholder="Buy one get one 10% off"
          helpText="Internal name for your reference."
          {...name}
          error={submitted && name.error}
        />
      </FormLayout>
    </Card>
  </>
);

OfferNameEditor.propTypes = {
  name: PropTypes.object.isRequired,
  strategy: PropTypes.object.isRequired,
  submitted: PropTypes.bool,
  onStrategyChange: PropTypes.func
};

OfferNameEditor.defaultProps = {
  submitted: false,
  onStrategyChange: () => {}
};

export default OfferNameEditor;
