import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormLayout } from '@shopify/polaris';
import { useDateTime } from '@neatowebsolutions/upselling-react-hooks';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

const Wrapper = styled.div`
  .Polaris-FormLayout__Item:first-child {
    margin-left: 0;
  }
  .Polaris-FormLayout__Item {
    margin-top: 0;
  }
`;

const DateTimePicker = ({
  value,
  disableDatesBefore,
  datePickerProps,
  timePickerProps,
  onChange
}) => {
  const { formatDate, formatDateISO } = useDateTime();

  const [date, setDate] = useState(value);
  const [time, setTime] = useState(formatDate(value, 't'));

  const handleDateChange = useCallback(
    (newDate) => {
      const newValue = new Date(`${formatDateISO(newDate)} ${time}`);
      const isValid = !Number.isNaN(newValue);

      setDate(newDate);

      if (isValid) {
        onChange(newValue);
      }
    },
    [onChange, time, formatDateISO]
  );

  const handleTimeChange = useCallback(
    (newTime) => {
      const newValue = new Date(`${formatDateISO(date)} ${newTime}`);
      const isValid = !Number.isNaN(newValue);

      setTime(newTime);

      if (isValid) {
        onChange(newValue);
      }
    },
    [date, onChange, formatDateISO]
  );

  return (
    <Wrapper>
      <FormLayout.Group condensed>
        <DatePicker
          label={datePickerProps.label}
          selected={value}
          disableDatesBefore={disableDatesBefore}
          onChange={handleDateChange}
        />
        <TimePicker
          label={timePickerProps.label}
          value={value}
          placeholder={timePickerProps.placeholder}
          onChange={handleTimeChange}
        />
      </FormLayout.Group>
    </Wrapper>
  );
};

DateTimePicker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  disableDatesBefore: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]),
  datePickerProps: PropTypes.shape({
    label: PropTypes.string
  }),
  timePickerProps: PropTypes.shape({
    label: PropTypes.string,
    placeholder: PropTypes.string
  }),
  onChange: PropTypes.func
};

DateTimePicker.defaultProps = {
  value: new Date(), // default to current date and time
  onChange: () => {}
};

export default DateTimePicker;
