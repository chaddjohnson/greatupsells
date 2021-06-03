import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Popover,
  TextField,
  DatePicker as ShopifyDatePicker,
  Icon
} from '@shopify/polaris';
import { CalendarMajor } from '@shopify/polaris-icons';
import { useDateTime } from '@neatowebsolutions/upselling-react-hooks';

const DatePicker = ({
  name,
  label,
  selected,
  disableDatesBefore,
  error,
  onChange
}) => {
  const { formatDateISO, startOfDay } = useDateTime();

  const [text, setText] = useState(formatDateISO(selected));
  const [month, setMonth] = useState(new Date(selected).getMonth());
  const [year, setYear] = useState(new Date(selected).getFullYear());
  const [popoverShown, setPopoverShown] = useState(false);

  const disableDatesBeforeFormatted = useMemo(
    () => disableDatesBefore && startOfDay(disableDatesBefore),
    [disableDatesBefore, startOfDay]
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
      setText(formatDateISO(date));
      setPopoverShown(false);
      onChange(startOfDay(date));
    },
    [onChange, formatDateISO, startOfDay]
  );

  // Update state values when selected prop changes.
  useEffect(() => {
    const selectedDate = new Date(selected);

    setText(formatDateISO(selectedDate));
    setMonth(selectedDate.getMonth());
    setYear(selectedDate.getFullYear());
  }, [selected, formatDateISO]);

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
          prefix={<Icon source={CalendarMajor} />}
          onChange={handleTextChange}
          onFocus={() => setPopoverShown(true)}
        />
      }
      preferredAlignment="left"
      sectioned
      onClose={() => setPopoverShown(false)}
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
  selected: new Date(), // default to the current day local time
  error: false,
  onChange: () => {}
};

export default DatePicker;
