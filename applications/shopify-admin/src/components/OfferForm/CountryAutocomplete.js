import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Autocomplete, Tag, Stack } from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { sortBy } from 'lodash';
import countries from './countries.json';

const countriesList = sortBy(
  countries.map(({ code, name }) => ({
    value: code,
    label: name
  })),
  'label'
);

const getCountryName = (countryCode) => {
  const country = countries.find(({ code }) => code === countryCode);

  if (country) {
    return country.name;
  }
};

const CountryAutocomplete = ({ label, placeholder, selected = [], error, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  const selectedOptions = selected.concat(countriesList);

  const handleChange = (value) => {
    setInputValue(value);

    if (value === '') {
      setOptions(countriesList);
      return;
    }

    const filterRegex = new RegExp(value, 'i');
    const resultOptions = countriesList.filter((option) => option.label.match(filterRegex));

    setOptions(resultOptions);
  };

  const handleSelect = (values) => {
    // This is an array of only values of selected options.
    const selectedValues = values
      .filter((value) => {
        return typeof value !== 'object';
      })
      .sort();

    onChange(selectedValues);
  };

  const handleRemove = (value) => {
    const selectedValues = selectedOptions
      .filter((option) => {
        return typeof option !== 'object';
      })
      .sort();

    selectedValues.splice(selectedValues.indexOf(value), 1);

    onChange(selectedValues);
  };

  const textField = (
    <Autocomplete.TextField
      label={label}
      placeholder={placeholder}
      prefix={<Icon source={SearchMinor} color="base" />}
      value={inputValue}
      error={error}
      onChange={handleChange}
    />
  );

  return (
    <Stack vertical>
      {selected?.length && (
        <Stack>
          {selected.map((value, index) => (
            <Tag key={index} onRemove={() => handleRemove(value)}>
              {getCountryName(value)}
            </Tag>
          ))}
        </Stack>
      )}
      <Autocomplete
        allowMultiple
        options={options}
        selected={selectedOptions}
        onSelect={handleSelect}
        textField={textField}
      />
    </Stack>
  );
};

CountryAutocomplete.propTypes = {
  label: PropTypes.node,
  placeholder: PropTypes.string,
  selected: PropTypes.array,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element]),
  onChange: PropTypes.func
};

CountryAutocomplete.defaultProps = {
  selected: [],
  onChange: () => {}
};

export default CountryAutocomplete;
