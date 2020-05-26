import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import styled from 'styled-components';
import { FormLayout } from '@shopify/polaris';
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

const toIsoDate = (date) => date && moment(date).format('YYYY-MM-DD');

const DateTimePicker = (props) => {
  const {
    value,
    disableDatesBefore,
    datePickerProps,
    timePickerProps,
    onChange
  } = props;

  const [date, setDate] = useState(value);
  const [time, setTime] = useState(moment(value).format('hh:mm A'));

  const handleDateChange = useCallback(
    (newDate) => {
      const newValue = new Date(`${toIsoDate(newDate)} ${time}`);
      const isValid = !Number.isNaN(newValue);

      setDate(newDate);

      if (isValid) {
        onChange(newValue);
      }
    },
    [onChange, time]
  );

  const handleTimeChange = useCallback(
    (newTime) => {
      const newValue = new Date(`${toIsoDate(date)} ${newTime}`);
      const isValid = !Number.isNaN(newValue);

      setTime(newTime);

      if (isValid) {
        onChange(newValue);
      }
    },
    [date, onChange]
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
