import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import {
  Popover,
  TextField,
  DatePicker as ShopifyDatePicker,
  Icon
} from '@shopify/polaris';
import { CalendarMajorMonotone } from '@shopify/polaris-icons';

const toIsoDate = (date) => date && moment(date).format('YYYY-MM-DD');
const toIsoStartOfDay = (date) => date && moment(date).startOf('day').toDate();

const DatePicker = ({
  name,
  label,
  selected,
  disableDatesBefore,
  error,
  onChange
}) => {
  const [text, setText] = useState(toIsoDate(selected));
  const [month, setMonth] = useState(new Date(selected).getMonth());
  const [year, setYear] = useState(new Date(selected).getFullYear());
  const [popoverShown, setPopoverShown] = useState(false);

  const disableDatesBeforeFormatted = useMemo(
    () => disableDatesBefore && toIsoStartOfDay(disableDatesBefore),
    [disableDatesBefore]
  );

  const handleTextChange = useCallback(
    (newText) => {
      const isValid =
        newText.match(/^\d{4}-\d{2}-\d{2}$/) && !!new Date(newText).getTime();

      setText(newText);

      if (isValid) {
        onChange(newText);
      }
    },
    [onChange]
  );

  const handleChange = useCallback(
    ({ start: date }) => {
      setText(toIsoDate(date));
      setPopoverShown(false);
      onChange(toIsoStartOfDay(date));
    },
    [onChange]
  );

  // Update state values when selected prop changes.
  useEffect(() => {
    const selectedDate = new Date(selected);

    setText(toIsoDate(selectedDate));
    setMonth(selectedDate.getMonth());
    setYear(selectedDate.getFullYear());
  }, [selected]);

  return (
    <Popover
      active={popoverShown}
      activator={
        <TextField
          name={name}
          type="text"
          label={label}
          placeholder="YYYY-MM-DD"
          value={text}
          maxLength={10}
          readOnly
          error={error}
          prefix={<Icon source={CalendarMajorMonotone} />}
          onChange={handleTextChange}
          onFocus={() => setPopoverShown(true)}
        />
      }
      preferredAlignment="left"
      sectioned
      onClose={() => setPopoverShown(!popoverShown)}
    >
      <ShopifyDatePicker
        selected={selected}
        month={month}
        year={year}
        disableDatesBefore={disableDatesBeforeFormatted}
        onChange={handleChange}
        onMonthChange={(newMonth, newYear) => {
          setMonth(newMonth);
          setYear(newYear);
        }}
      />
    </Popover>
  );
};

DatePicker.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  disableDatesBefore: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]),
  error: PropTypes.bool,
  onChange: PropTypes.func
};

DatePicker.defaultProps = {
  selected: toIsoStartOfDay(new Date()), // default to the current day local time
  error: false,
  onChange: () => {}
};

export default DatePicker;
