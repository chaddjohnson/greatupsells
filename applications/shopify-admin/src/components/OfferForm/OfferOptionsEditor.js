import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  TextField,
  Checkbox,
  Select,
  Button,
  KeyboardKey
} from '@shopify/polaris';
import { asChoiceField } from '@shopify/react-form';
import styled from 'styled-components';

const SecondsInputWrapper = styled.div`
  .Polaris-TextField {
    max-width: 145px;
  }
`;

const AnimationSelectWrapper = styled.div`
  max-width: 225px;
  flex: 1;
`;

const Flex = styled.div`
  display: flex;
  margin: -0.25rem;
  > * {
    margin: 0.25rem;
  }
`;

const OfferOptionsEditor = ({
  offer,
  enableVariantSelection,
  enableQuantitySelection,
  disableOutOfStockVariants,
  delaySeconds,
  onPageRequiredSeconds,
  enableEscClose,
  enableMaskClose,
  animation,
  submitted,
  onPreview
}) => {
  const [delaySecondsActive, setDelaySecondsActive] = useState(
    offer?.delaySeconds > 0
  );
  const [
    onPageRequiredSecondsActive,
    setOnPageRequiredSecondsActive
  ] = useState(offer?.onPageRequiredSeconds > 0);
  const [animationActive, setAnimationActive] = useState(!!animation.value);

  const handleDelaySecondsActiveChange = (checked) => {
    setDelaySecondsActive(checked);

    if (!checked) {
      delaySeconds.onChange(undefined);
    }
  };

  const handleOnPageRequiredSecondsActiveChange = (checked) => {
    setOnPageRequiredSecondsActive(checked);

    if (!checked) {
      onPageRequiredSeconds.onChange(undefined);
    }
  };

  const handleAnimationActiveChange = (checked) => {
    setAnimationActive(checked);

    if (!checked) {
      animation.onChange(undefined);
    }
  };

  useEffect(() => {
    if (!['ADD', 'LOAD', 'FOCUS', 'SCROLL'].includes(offer.triggerEvent)) {
      setDelaySecondsActive(false);
      delaySeconds.onChange(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer.triggerEvent]);

  return (
    <Card title="Options" sectioned>
      <FormLayout>
        <Checkbox
          label="Allow customers to select variants"
          helpText="Customers may select variants if available."
          {...asChoiceField(enableVariantSelection)}
        />
        <Checkbox
          label="Allow customers to change quantities"
          helpText="Customers may change quantities for products."
          {...asChoiceField(enableQuantitySelection)}
        />
        <Checkbox
          label="Disable out of stock variants"
          helpText="Variants with no inventory will be disabled, and products with no inventory variants will not be offered."
          {...asChoiceField(disableOutOfStockVariants)}
        />
        {offer.strategy !== 'THANK_YOU_PAGE' &&
          ['ADD', 'LOAD', 'FOCUS', 'SCROLL'].includes(offer.triggerEvent) && (
            <Checkbox
              label="Delay showing offer after trigger event"
              helpText={
                delaySecondsActive && (
                  <SecondsInputWrapper>
                    <TextField
                      inputMode="numeric"
                      min={0}
                      suffix="seconds"
                      {...delaySeconds}
                      error={submitted && delaySeconds.error}
                    />
                  </SecondsInputWrapper>
                )
              }
              checked={delaySecondsActive}
              onChange={handleDelaySecondsActiveChange}
            />
          )}
        {offer.strategy !== 'THANK_YOU_PAGE' && (
          <Checkbox
            label="Require customer be on page for a specified amount of time before allowing offer to show"
            helpText={
              onPageRequiredSecondsActive && (
                <SecondsInputWrapper>
                  <TextField
                    inputMode="numeric"
                    suffix="seconds"
                    {...onPageRequiredSeconds}
                    error={submitted && onPageRequiredSeconds.error}
                  />
                </SecondsInputWrapper>
              )
            }
            checked={onPageRequiredSecondsActive}
            onChange={handleOnPageRequiredSecondsActiveChange}
          />
        )}
        {offer.strategy !== 'THANK_YOU_PAGE' && (
          <Checkbox
            label={
              <>
                Allow <KeyboardKey>esc</KeyboardKey> key to close the offer
              </>
            }
            {...asChoiceField(enableEscClose)}
          />
        )}
        {offer.strategy !== 'THANK_YOU_PAGE' && (
          <Checkbox
            label="Allow clicking outside to close the offer"
            {...asChoiceField(enableMaskClose)}
          />
        )}
        {offer.strategy !== 'THANK_YOU_PAGE' && (
          <Checkbox
            label="Use an animation when showing and hiding the offer"
            helpText={
              animationActive && (
                <Flex>
                  <AnimationSelectWrapper>
                    <Select
                      label="Animation"
                      labelHidden
                      options={[
                        {
                          value: 'effect-slide-in-scale',
                          label: 'Fade in & scale'
                        },
                        {
                          value: 'effect-slide-in-right',
                          label: 'Slide in (right)'
                        },
                        {
                          value: 'effect-slide-in-bottom',
                          label: 'Slide in (bottom)'
                        },
                        {
                          value: 'effect-fall',
                          label: 'Fall'
                        },
                        {
                          value: 'effect-sticky-up',
                          label: 'Sticky up'
                        },
                        {
                          value: 'effect-3d-flip-horizontal',
                          label: '3D flip (horizontal)'
                        },
                        {
                          value: 'effect-3d-flip-vertical',
                          label: '3D flip (vertical)'
                        },
                        {
                          value: 'effect-3d-sign',
                          label: '3D sign'
                        },
                        {
                          value: 'effect-super-scaled',
                          label: 'Super scaled'
                        },
                        {
                          value: 'effect-3d-slit',
                          label: '3D slit'
                        },
                        {
                          value: 'effect-3d-rotate-bottom',
                          label: '3D rotate bottom'
                        },
                        {
                          value: 'effect-3d-rotate-in-left',
                          label: '3D rotate in left'
                        }
                      ]}
                      {...animation}
                      error={submitted && animation.error}
                    />
                  </AnimationSelectWrapper>
                  <Button onClick={onPreview}>Preview</Button>
                </Flex>
              )
            }
            checked={animationActive}
            onChange={handleAnimationActiveChange}
          />
        )}
      </FormLayout>
    </Card>
  );
};

OfferOptionsEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  enableVariantSelection: PropTypes.object.isRequired,
  enableQuantitySelection: PropTypes.object.isRequired,
  disableOutOfStockVariants: PropTypes.object.isRequired,
  delaySeconds: PropTypes.object.isRequired,
  onPageRequiredSeconds: PropTypes.object.isRequired,
  enableEscClose: PropTypes.object.isRequired,
  enableMaskClose: PropTypes.object.isRequired,
  animation: PropTypes.object.isRequired,
  submitted: PropTypes.bool,
  onPreview: PropTypes.func
};

OfferOptionsEditor.defaultProps = {
  submitted: false,
  onPreview: () => {}
};

export default OfferOptionsEditor;
