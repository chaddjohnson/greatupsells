import React from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, Checkbox } from '@shopify/polaris';
import { useDateTime } from '@neatowebsolutions/greatupsells-react-hooks';
import DateTimePicker from '../DateTimePicker';

const OfferDatesEditor = ({
  offer,
  startAt,
  endAt,
  showEndDate,
  onShowEndDateChange
}) => {
  const { formatDate } = useDateTime();

  const timezoneAbbreviation = formatDate(new Date(), 'ZZZZ');

  const handleStartAtChange = (value) => {
    startAt.onChange(value);

    if (
      showEndDate &&
      offer.endAt &&
      value &&
      new Date(offer.endAt) < new Date(value)
    ) {
      endAt.onChange(value);
    }
  };

  return (
    <Card title="Active dates" sectioned>
      <FormLayout>
        <DateTimePicker
          value={offer.startAt}
          datePickerProps={{ label: 'Start date' }}
          timePickerProps={{
            label: `Start time (${timezoneAbbreviation})`,
            placeholder: 'Enter time'
          }}
          onChange={handleStartAtChange}
        />
        <FormLayout.Group>
          <Checkbox
            label="Set end date"
            checked={showEndDate}
            onChange={onShowEndDateChange}
          />
        </FormLayout.Group>
        {showEndDate && (
          <DateTimePicker
            disableDatesBefore={new Date(offer.startAt)}
            value={offer.endAt}
            datePickerProps={{ label: 'End date' }}
            timePickerProps={{
              label: `End time (${timezoneAbbreviation})`,
              placeholder: 'Enter time'
            }}
            onChange={endAt.onChange}
          />
        )}
      </FormLayout>
    </Card>
  );
};

OfferDatesEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  startAt: PropTypes.object.isRequired,
  endAt: PropTypes.object.isRequired,
  showEndDate: PropTypes.bool,
  onShowEndDateChange: PropTypes.func
};

OfferDatesEditor.defaultProps = {
  onShowEndDateChange: () => {}
};

export default OfferDatesEditor;
