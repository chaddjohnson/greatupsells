import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Popover,
  Button,
  ColorPicker as ShopifyColorPicker,
  TextField,
  Stack,
  RangeSlider
} from '@shopify/polaris';
import styled from 'styled-components';
import {
  valueIsHex,
  hexToRgb,
  normalize,
  hexToHsb,
  hsbToHex,
  sanitizeHexValue
} from './utilities';

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
  box-shadow:
    inset 0 0 0 1px rgb(0 0 0 / 7%),
    inset 0 1px 3px 0 rgb(0 0 0 / 15%);
`;

// `styled.div.attrs()` + `style` is used for frequently-changing properties.
const ColorPreview = styled.div.attrs((props) => ({
  style: {
    backgroundColor: props.value
  }
}))`
  width: 100%;
  height: 100%;
  border-radius: inherit;
  box-shadow: inherit;
`;

const TextFieldColorPreview = styled.div.attrs((props) => ({
  style: {
    backgroundColor: props.value
  }
}))`
  border-radius: 50%;
  box-shadow:
    inset 0 0 0 1px rgb(0 0 0 / 7%),
    inset 0 1px 3px 0 rgb(0 0 0 / 15%);
  width: 2rem;
  height: 2rem;
  margin-left: -0.4rem;
`;

const HexColorTextWrapper = styled.div`
  .Polaris-TextField {
    width: 115px;
  }
`;

const ActivatorWrapper = styled.div`
  .Polaris-Button {
    color: black;
    text-decoration: none;
  }

  svg.Polaris-Icon__Svg {
    fill: black;
  }
`;

const ColorPicker = ({ label, value, allowAlpha, onChange }) => {
  const [normalizedValue, alphaValue] = useMemo(
    () => normalize(value),
    [value]
  );
  const alphaDisplayValue = useMemo(
    () =>
      typeof alphaValue === 'number' && parseInt(Math.round(alphaValue * 100)),
    [alphaValue]
  );
  const sanitizedValue = useMemo(
    () => sanitizeHexValue(normalizedValue),
    [normalizedValue]
  );

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

      if (allowAlpha) {
        onChange(hexToRgb(newHexValue, newValue.alpha));
      } else {
        onChange(newHexValue);
      }
    },
    [onChange, allowAlpha]
  );

  const handleHexChange = useCallback(
    (newHexValue) => {
      const sanitizedNewHexValue = sanitizeHexValue(newHexValue);
      const isValid = valueIsHex(sanitizedNewHexValue);

      setHexValue(sanitizedNewHexValue);

      if (isValid) {
        if (allowAlpha) {
          onChange(hexToRgb(sanitizedNewHexValue, alphaValue));
        } else {
          onChange(sanitizedNewHexValue);
        }
      }
    },
    [onChange, allowAlpha, alphaValue]
  );

  const handleAlphaChange = (newAlphaValue) => {
    onChange(hexToRgb(hexValue, newAlphaValue / 100));
  };

  const handleHexBlur = useCallback(() => {
    const isValid = valueIsHex(hexValue);

    if (!isValid) {
      setHexValue(lastValidHexValue);
    }
  }, [hexValue, lastValidHexValue]);

  const handleHexKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        handleHexChange(event.target.value);
        togglePopover();
      }
    },
    [handleHexChange, togglePopover]
  );

  // Update state value when props value changes.
  useEffect(() => {
    setHsbValue(hexToHsb(sanitizedValue, alphaValue));
    setHexValue(sanitizedValue);
    setLastValidHexValue(sanitizedValue);
  }, [sanitizedValue, alphaValue]);

  return (
    <Stack spacing="tight" vertical>
      <Popover
        active={active}
        activator={
          <ActivatorWrapper>
            <Stack>
              <PreviewButton type="button" onClick={togglePopover}>
                <ColorPreview value={hexValue} />
              </PreviewButton>
              <Button onClick={togglePopover} plain>
                {label}
              </Button>
            </Stack>
          </ActivatorWrapper>
        }
        preferredAlignment="left"
        sectioned
        onClose={togglePopover}
      >
        <Stack spacing="tight" alignment="center" vertical>
          <ShopifyColorPicker color={hsbValue} onChange={handleHsbChange} />
          <HexColorTextWrapper onKeyDown={handleHexKeyPress}>
            <TextField
              name="color"
              value={hexValue}
              maxLength={7}
              prefix={<TextFieldColorPreview value={hexValue} />}
              onChange={handleHexChange}
              onBlur={handleHexBlur}
            />
          </HexColorTextWrapper>
        </Stack>
      </Popover>
      {allowAlpha && (
        <RangeSlider
          output
          label="Opacity"
          min={0}
          max={100}
          value={alphaDisplayValue}
          onChange={handleAlphaChange}
          suffix={`${alphaDisplayValue}%`}
        />
      )}
    </Stack>
  );
};

ColorPicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  allowAlpha: PropTypes.bool,
  onChange: PropTypes.func
};

ColorPicker.defaultProps = {
  allowAlpha: false,
  onChange: () => {}
};

export default ColorPicker;
