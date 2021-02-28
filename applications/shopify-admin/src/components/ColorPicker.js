import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Popover,
  Button,
  Tooltip,
  ColorPicker as ShopifyColorPicker,
  TextField
} from '@shopify/polaris';
import Colr from 'colr';
import styled from 'styled-components';

const hexToHsb = (hex) => {
  if (!hex) {
    return hex;
  }

  const hsv = Colr().fromHex(hex).toHsvObject();

  return {
    hue: hsv.h > 0 ? Math.round(hsv.h) : hsv.h,
    saturation: hsv.s > 0 ? hsv.s / 100 : hsv.s,
    brightness: hsv.v > 0 ? hsv.v / 100 : hsv.v
  };
};

const hsbToHex = (hsb) => {
  if (!hsb) {
    return hsb;
  }

  return Colr()
    .fromHsvObject({
      h: hsb.hue,
      s: hsb.saturation * 100,
      v: hsb.brightness * 100
    })
    .toHex();
};

const validateHexValue = (test) =>
  test && !!test.match(/^#(?=[a-fA-F0-9]+$)(?:.{3}|.{6})$/);

const sanitizeHexValue = (unsanitizedHexValue) => {
  const sanitizedHexValue = (unsanitizedHexValue || '')
    .toString()
    .trim()
    .replace(/[^a-fA-F0-9]/g, '');

  return sanitizedHexValue ? `#${sanitizedHexValue}` : sanitizedHexValue;
};

const ColorPreview = styled.div`
  border: 1px solid #dfe3e8;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 9px;
  cursor: pointer;
`;

const PopoverWrapper = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const ColorPickerWrapper = styled.div`
  .Polaris-TextField {
    width: 100px;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    display: block;

    input {
      text-align: center;
    }
  }
`;

const ActivatorWrapper = styled.span`
  button.Polaris-Button {
    color: black;
    text-decoration: none;
  }

  svg.Polaris-Icon__Svg {
    fill: black;
  }
`;

const ColorPicker = ({ label, value, onChange, ...props }) => {
  const sanitizedValue = useMemo(() => sanitizeHexValue(value), [value]);

  const [active, setActive] = useState(false);
  const [hsbValue, setHsbValue] = useState(hexToHsb(sanitizedValue));
  const [hexValue, setHexValue] = useState(sanitizedValue);
  const [lastValidHexValue, setLastValidHexValue] = useState(sanitizedValue);

  const togglePopover = useCallback(() => {
    setActive(!active);
  }, [active]);

  const handleHsbChange = useCallback(
    (newValue) => {
      const newHexValue = hsbToHex(newValue);

      setHsbValue(newValue);
      setHexValue(newHexValue);

      onChange(newHexValue);
    },
    [onChange]
  );

  const handleHexChange = useCallback(
    (newHexValue) => {
      const sanitizedNewHexValue = sanitizeHexValue(newHexValue);
      const isValid = validateHexValue(sanitizedNewHexValue);

      setHexValue(sanitizedNewHexValue);

      if (isValid) {
        onChange(sanitizedNewHexValue);
      }
    },
    [onChange]
  );

  const handleHexBlur = useCallback(() => {
    const isValid = validateHexValue(hexValue);

    if (!isValid) {
      setHexValue(lastValidHexValue);
    }
  }, [hexValue, lastValidHexValue]);

  const handleHexKeyPress = useCallback(
    (event) => {
      if (event.keyCode === 13) {
        handleHexChange(event.target.value);
        togglePopover();
      }
    },
    [handleHexChange, togglePopover]
  );

  // Update state value when props value changes.
  useEffect(() => {
    setHsbValue(hexToHsb(value));
    setHexValue(value);
    setLastValidHexValue(value);
  }, [value]);

  return (
    <div {...props}>
      <Tooltip content={hexValue}>
        <ColorPreview
          onClick={togglePopover}
          style={{ backgroundColor: hexValue }}
        />
      </Tooltip>
      <PopoverWrapper>
        <Popover
          active={active}
          activator={
            <ActivatorWrapper>
              <Button onClick={togglePopover} disclosure plain>
                {label}
              </Button>
            </ActivatorWrapper>
          }
          preferredAlignment="left"
          sectioned
          onClose={togglePopover}
        >
          <ColorPickerWrapper>
            <ShopifyColorPicker color={hsbValue} onChange={handleHsbChange} />
            <div onKeyDown={handleHexKeyPress}>
              <TextField
                value={hexValue}
                maxLength={7}
                onChange={handleHexChange}
                onFocus={(event) => event.target.select()}
                onBlur={handleHexBlur}
              />
            </div>
          </ColorPickerWrapper>
        </Popover>
      </PopoverWrapper>
    </div>
  );
};

ColorPicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func
};

ColorPicker.defaultProps = {
  onChange: () => {}
};

export default ColorPicker;
