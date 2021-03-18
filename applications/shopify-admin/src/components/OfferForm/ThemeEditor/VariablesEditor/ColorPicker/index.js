import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Popover,
  Button,
  ColorPicker as ShopifyColorPicker,
  TextField,
  Stack
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
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 7%),
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
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background-position: 0 0, 0.6rem 0.6rem;
    background-size: 1.2rem 1.2rem;
    background-image: linear-gradient(
        45deg,
        #dfe3e8 25%,
        transparent 0,
        transparent 75%,
        #dfe3e8 0,
        #dfe3e8
      ),
      linear-gradient(45deg, #dfe3e8 25%, #fff 0, #fff 75%, #dfe3e8 0, #dfe3e8);
    z-index: -1;
  }
`;

const TextFieldColorPreview = styled.div.attrs((props) => ({
  style: {
    backgroundColor: props.value
  }
}))`
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 7%),
    inset 0 1px 3px 0 rgb(0 0 0 / 15%);
  width: 2rem;
  height: 2rem;
  margin-left: -0.4rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-position: 0 0, 0.6rem 0.6rem;
    background-size: 1.2rem 1.2rem;
    background-image: linear-gradient(
        45deg,
        #dfe3e8 25%,
        transparent 0,
        transparent 75%,
        #dfe3e8 0,
        #dfe3e8
      ),
      linear-gradient(45deg, #dfe3e8 25%, #fff 0, #fff 75%, #dfe3e8 0, #dfe3e8);
    z-index: -1;
  }
`;

const HexColorTextWrapper = styled.div`
  .Polaris-TextField {
    width: 115px;
    margin-top: 1rem;
  }
`;

const TransparencyTextWrapper = styled.div`
  .Polaris-TextField {
    width: 95px;
    margin-top: 1rem;
  }
`;

const ActivatorWrapper = styled.div`
  .Polaris-Stack__Item {
    z-index: 1;
  }

  .Polaris-Button {
    color: black;
    text-decoration: none;
  }

  svg.Polaris-Icon__Svg {
    fill: black;
  }
`;

const ColorPicker = ({
  label,
  value,
  allowTransparency,
  onChange,
  ...props
}) => {
  const [normalizedValue, alphaValue] = useMemo(() => normalize(value), [
    value
  ]);
  const alphaDisplayValue = useMemo(
    () =>
      typeof alphaValue === 'number' && parseInt(Math.round(alphaValue * 100)),
    [alphaValue]
  );
  const sanitizedValue = useMemo(() => sanitizeHexValue(normalizedValue), [
    normalizedValue
  ]);

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

      if (allowTransparency) {
        onChange(hexToRgb(newHexValue, newValue.alpha));
      } else {
        onChange(newHexValue);
      }
    },
    [onChange, allowTransparency]
  );

  const handleHexChange = useCallback(
    (newHexValue) => {
      const sanitizedNewHexValue = sanitizeHexValue(newHexValue);
      const isValid = valueIsHex(sanitizedNewHexValue);

      setHexValue(sanitizedNewHexValue);

      if (isValid) {
        if (allowTransparency) {
          onChange(hexToRgb(sanitizedNewHexValue, alphaValue));
        } else {
          onChange(sanitizedNewHexValue);
        }
      }
    },
    [onChange, allowTransparency, alphaValue]
  );

  const handleAlphaChange = (newAlphaValue) => {
    newAlphaValue = parseFloat(newAlphaValue);

    onChange(
      hexToRgb(
        hexValue,
        typeof newAlphaValue === 'number' &&
          parseInt(Math.round(newAlphaValue)) / 100
      )
    );
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

  const handleAlphaKeyDown = (event) => {
    const isNumeric = event.key.match(/\d/);
    const isDelete = event.key === 'Delete';
    const isBackspace = event.key === 'Backspace';

    if (!isNumeric && !isDelete && !isBackspace) {
      event.preventDefault();
    }
  };

  // Update state value when props value changes.
  useEffect(() => {
    setHsbValue(hexToHsb(sanitizedValue, alphaValue));
    setHexValue(sanitizedValue);
    setLastValidHexValue(sanitizedValue);
  }, [sanitizedValue, alphaValue]);

  return (
    <div {...props}>
      <Popover
        active={active}
        activator={
          <ActivatorWrapper>
            <Stack>
              <PreviewButton type="button" onClick={togglePopover}>
                <ColorPreview value={value} />
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
        <ShopifyColorPicker
          color={hsbValue}
          allowAlpha={allowTransparency}
          onChange={handleHsbChange}
        />
        <Stack
          spacing="extraTight"
          distribution={allowTransparency ? 'equalSpacing' : 'center'}
        >
          <HexColorTextWrapper onKeyDown={handleHexKeyPress}>
            <TextField
              name="color"
              value={hexValue}
              maxLength={7}
              prefix={<TextFieldColorPreview value={value} />}
              onChange={handleHexChange}
              onBlur={handleHexBlur}
            />
          </HexColorTextWrapper>
          <TransparencyTextWrapper onKeyDown={handleAlphaKeyDown}>
            {allowTransparency && (
              <TextField
                name="transparency"
                type="number"
                suffix="%"
                inputMode="numeric"
                min={0}
                max={100}
                minLength={1}
                maxLength={3}
                step={1}
                value={alphaDisplayValue.toString()}
                onChange={handleAlphaChange}
              />
            )}
          </TransparencyTextWrapper>
        </Stack>
      </Popover>
    </div>
  );
};

ColorPicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  allowTransparency: PropTypes.bool,
  onChange: PropTypes.func
};

ColorPicker.defaultProps = {
  allowTransparency: false,
  onChange: () => {}
};

export default ColorPicker;
