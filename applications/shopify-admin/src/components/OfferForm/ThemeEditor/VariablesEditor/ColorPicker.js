import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Popover,
  Button,
  ColorPicker as ShopifyColorPicker,
  TextField,
  Stack
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
    .toHex()
    .toUpperCase();
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

const PreviewButton = styled.button`
  appearance: none;
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  width: 38px;
  height: 2rem;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 7%),
    inset 0 1px 3px 0 rgb(0 0 0 / 15%);
`;

const ColorPreview = styled.div`
  width: 100%;
  height: 100%;
  border-radius: inherit;
  box-shadow: inherit;
  background-color: ${(props) => props.value};
`;

const TextFieldColorPreview = styled.div`
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 7%),
    inset 0 1px 3px 0 rgb(0 0 0 / 15%);
  background-color: ${(props) => props.value};
  width: 2rem;
  height: 2rem;
  margin-left: -0.4rem;
`;

const ColorPickerWrapper = styled.div`
  .Polaris-TextField {
    width: 115px;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    /* display: block; */

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
      <Popover
        active={active}
        activator={
          <Stack spacing="tight">
            <PreviewButton type="button" onClick={togglePopover}>
              <ColorPreview value={hexValue} />
            </PreviewButton>
            <ActivatorWrapper>
              <Button onClick={togglePopover} plain>
                {label}
              </Button>
            </ActivatorWrapper>
          </Stack>
        }
        preferredAlignment="left"
        sectioned
        onClose={togglePopover}
      >
        <ShopifyColorPicker color={hsbValue} onChange={handleHsbChange} />
        <ColorPickerWrapper onKeyDown={handleHexKeyPress}>
          <TextField
            value={hexValue}
            maxLength={7}
            prefix={<TextFieldColorPreview value={hexValue} />}
            onChange={handleHexChange}
            onFocus={(event) => event.target.select()}
            onBlur={handleHexBlur}
          />
        </ColorPickerWrapper>
      </Popover>
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
