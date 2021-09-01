import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, Icon } from '@shopify/polaris';
import { ClockMajor } from '@shopify/polaris-icons';
import { flatten } from 'lodash';
import { useDateTime } from '@neatowebsolutions/upselling-react-hooks';

const validateValue = (test) => test && !!test.match(/^\d{1,2}:\d{2} ?[AP]M$/);

const sanitizeValue = (unsanitized) =>
  (unsanitized || '')
    .toString()
    .trim()
    .toUpperCase()
    .replace(/^(\d{1,2}:\d{2})\s*([AP]M)$/, '$1 $2')
    .padStart(8, '0');

const buildTimeOptions = () =>
  flatten(
    [...Array(24)].map((_, index) => [
      {
        value: `${index.toString().padStart(2, '0')}:00`,
        label: `${(index % 12 > 0 ? index % 12 : 12)
          .toString()
          .padStart(2, '0')}:00 ${index < 12 ? 'AM' : 'PM'}`
      },
      {
        value: `${index.toString().padStart(2, '0')}:30`,
        label: `${(index % 12 > 0 ? index % 12 : 12)
          .toString()
          .padStart(2, '0')}:30 ${index < 12 ? 'AM' : 'PM'}`
      }
    ])
  );

const TimePicker = ({ label, placeholder, onChange, ...props }) => {
  const { formatDate } = useDateTime();

  const timeOptions = buildTimeOptions();

  const toFormattedTime = useCallback(
    (date) => {
      if (!date) {
        return date;
      }

      const isDate = !!Date.parse(date);

      if (isDate) {
        return formatDate(date, 't');
      } else {
        return date;
      }
    },
    [formatDate]
  );

  const [value, setValue] = useState(toFormattedTime(props.value));
  const [lastValidValue, setLastValidValue] = useState(value);
  const [options, setOptions] = useState(timeOptions);
  const [selectedOptions, setSelectedOptions] = useState('');

  const handleTextChange = useCallback(
    (newValue) => {
      setValue(newValue);

      // Show all options when no text is entered.
      if (!newValue) {
        setOptions(timeOptions);
        return;
      }

      // Filter options to show only options matching text that has been typed.
      const filterRegex = new RegExp(newValue, 'i');
      const filteredOptions = timeOptions.filter((option) =>
        option.label.match(filterRegex)
      );

      setOptions(filteredOptions);
    },
    [timeOptions]
  );

  const handleTextBlur = useCallback(() => {
    const sanitizedValue = sanitizeValue(value);
    const isValid = validateValue(sanitizedValue);

    if (isValid) {
      // The value is valid, so emit the change.
      onChange(sanitizedValue);
    } else {
      // The value is invalid, so revert to the last valid value.
      setValue(lastValidValue);
    }
  }, [lastValidValue, onChange, value]);

  const handleAutocompleteSelect = useCallback(
    (selected) => {
      const selectedValue = selected.map((item) => {
        const matchedOption = options.find((option) => {
          return option.value.match(item);
        });
        return matchedOption && matchedOption.label;
      });

      setSelectedOptions(selected);

      if (selectedValue[0]) {
        onChange(selectedValue[0]);
      }
    },
    [options, onChange]
  );

  // Update state value when props value changes.
  useEffect(() => {
    const formattedTime = toFormattedTime(props.value);

    setValue(formattedTime);
    setLastValidValue(formattedTime);
  }, [props.value, toFormattedTime]);

  return (
    <Autocomplete
      options={options}
      selected={selectedOptions}
      allowMultiple={false}
      onSelect={handleAutocompleteSelect}
      textField={
        <Autocomplete.TextField
          label={label}
          placeholder={placeholder}
          prefix={<Icon source={ClockMajor} />}
          value={value}
          maxLength={8}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
        />
      }
    />
  );
};

TimePicker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func
};

TimePicker.defaultProps = {
  value: new Date(), // default to current local time
  onChange: () => {}
};

export default TimePicker;
