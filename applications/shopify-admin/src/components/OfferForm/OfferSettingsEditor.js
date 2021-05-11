import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  TextField,
  Checkbox,
  ChoiceList,
  Stack
} from '@shopify/polaris';
import { asChoiceField } from '@shopify/react-form';
import styled from 'styled-components';

const TriggerScrollThresholdWrapper = styled.div`
  max-width: 110px;
`;

const ViewAllowanceDaysInputWrapper = styled.div`
  max-width: 125px;
`;

const OfferSettingsEditor = ({
  name,
  strategy,
  triggerEvent,
  triggerExternalLinksOnly,
  triggerScrollThreshold,
  triggerPage,
  triggerPagePath,
  discountType,
  actionButtonBehavior,
  actionButtonLink,
  actionButtonLinkOpenInNewTab,
  viewAllowance,
  viewAllowanceDays,
  currency,
  submitted,
  onStrategyChange
}) => {
  const handleTriggerPageChange = ([value]) => {
    if (triggerPage.value !== 'PAGE') {
      triggerPagePath.onChange(undefined);
    }

    triggerPage.onChange(value);
  };

  const handleTriggerPagePathBlur = (event) => {
    const hasLeadingSlash = !!triggerPagePath.value?.match(/^\//);

    if (!hasLeadingSlash) {
      triggerPagePath.onChange(`/${triggerPagePath.value}`);
    }

    triggerPagePath.onBlur(event);
  };

  return (
    <>
      <Card title="Offer name" sectioned>
        <FormLayout>
          <TextField
            placeholder="Buy one get one 10% off"
            helpText="Internal name for your reference."
            {...name}
            error={submitted && name.error}
          />
        </FormLayout>
      </Card>
      <Card title="Strategy" sectioned>
        <FormLayout>
          <ChoiceList
            choices={[
              {
                label: 'Cross-sell',
                helpText:
                  'Encourage customers to purchase a related or complementary product.',
                value: 'CROSS_SELL'
              },
              {
                label: 'Upsell',
                helpText:
                  'Encourage customers to purchase a comparable, more expensive product.',
                value: 'UPSELL'
              },
              {
                label: 'Popup',
                helpText:
                  'Display a popup for email collection, newsletter signups, surveys, sales, promotions, and general information.',
                value: 'POPUP'
              }
            ]}
            selected={strategy.value}
            onChange={([value]) => onStrategyChange(value)}
          />
        </FormLayout>
      </Card>
      <Card title="Trigger event" sectioned>
        <FormLayout>
          <ChoiceList
            choices={[
              {
                label: 'Page load',
                helpText: 'Offer is shown when the page loads.',
                value: 'LOAD'
              },
              {
                label: 'Add to cart',
                helpText: 'Offer is shown when a product is added to the cart.',
                value: 'ADD'
              },
              {
                label: 'Cart page visit',
                helpText: 'Offer is shown on the Cart page before checkout.',
                value: 'CART'
              },
              {
                label: 'Exit intent',
                helpText:
                  'Offer is shown on desktop when the mouse is moved above the browser window and on mobile with fast scroll up.',
                value: 'EXIT'
              },
              {
                label: 'Lost browser focus',
                helpText:
                  'Offer is shown when the browser fully loses visibility.',
                value: 'FOCUS'
              },
              {
                label: 'Page scroll',
                helpText: (
                  <Stack vertical spacing="tight">
                    <span>
                      Offer is shown when the page is scrolled downward beyond a
                      specified threshold.
                    </span>
                    {triggerEvent.value === 'SCROLL' && (
                      <TriggerScrollThresholdWrapper>
                        <TextField
                          type="number"
                          inputMode="numeric"
                          suffix="%"
                          min={1}
                          max={100}
                          step={1}
                          {...triggerScrollThreshold}
                          error={submitted && triggerScrollThreshold.error}
                        />
                      </TriggerScrollThresholdWrapper>
                    )}
                  </Stack>
                ),

                value: 'SCROLL'
              },
              {
                label: 'Link click',
                helpText: (
                  <Stack vertical spacing="tight">
                    <span>
                      Offer is shown when any link is clicked. Links are
                      followed when the popup is closed.
                    </span>
                    {triggerEvent.value === 'LINK' && (
                      <Checkbox
                        label="Limit to external links"
                        {...asChoiceField(triggerExternalLinksOnly)}
                      />
                    )}
                  </Stack>
                ),
                value: 'LINK'
              }
            ]}
            selected={triggerEvent.value}
            onChange={([value]) => triggerEvent.onChange(value)}
          />
        </FormLayout>
      </Card>
      <Card title="Trigger page" sectioned>
        <FormLayout>
          <ChoiceList
            choices={[
              {
                label: 'Any page',
                helpText: 'Offer may show on any page.',
                value: 'ANY'
              },
              {
                label: 'Specific page',
                helpText: (
                  <Stack vertical spacing="tight">
                    <span>Offer may show only on a specific page.</span>
                    {triggerPage.value === 'PAGE' && (
                      <TextField
                        value={triggerPagePath.value}
                        placeholder="/page-url/here"
                        {...triggerPagePath}
                        error={submitted && triggerPagePath.error}
                        onBlur={handleTriggerPagePathBlur}
                      />
                    )}
                  </Stack>
                ),
                value: 'PAGE'
              }
            ]}
            selected={triggerPage.value}
            onChange={handleTriggerPageChange}
          />
        </FormLayout>
      </Card>
      <Card title="View frequency allowance" sectioned>
        <ChoiceList
          choices={[
            {
              label: 'Once within a period of days',
              helpText: (
                <Stack vertical spacing="tight">
                  <span>
                    Customers may only see this offer once within a period of
                    days.
                  </span>
                  {viewAllowance.value === 'DAYS' && (
                    <ViewAllowanceDaysInputWrapper>
                      <TextField
                        type="number"
                        inputMode="numeric"
                        min={1}
                        step={1}
                        suffix="days"
                        {...viewAllowanceDays}
                        error={submitted && viewAllowanceDays.error}
                      />
                    </ViewAllowanceDaysInputWrapper>
                  )}
                </Stack>
              ),
              value: 'DAYS'
            },
            {
              label: 'Once per browser tab session',
              helpText:
                'Customers may see this offer only once per browser tab session.',
              value: 'SESSION'
            },
            {
              label: 'One time',
              helpText: 'Customers may see this offer only one time.',
              value: 'ONCE'
            },
            {
              label: 'Once every page load',
              helpText:
                'Customers may see this offer with every new page visited.',
              value: 'PAGE'
            }
          ]}
          selected={viewAllowance.value}
          onChange={([value]) => viewAllowance.onChange(value)}
        />
      </Card>
      <Card title="Action button behavior" sectioned>
        <ChoiceList
          choices={[
            {
              label: 'Redirect customers to the Cart page',
              value: 'CART'
            },
            {
              label:
                'Skip the cart and redirect customers to the Checkout page',
              helpText:
                'Immediately initiating checkout can increase conversions.',
              value: 'CHECKOUT'
            },
            {
              label: 'Remain on the same page',
              value: 'PAGE'
            },
            {
              label: 'Open a link',
              helpText: actionButtonBehavior.value === 'LINK' && (
                <Stack vertical spacing="tight">
                  <TextField
                    placeholder="https://"
                    {...actionButtonLink}
                    error={submitted && actionButtonLink.error}
                  />
                  <Checkbox
                    label="Open in new browser tab"
                    {...asChoiceField(actionButtonLinkOpenInNewTab)}
                  />
                </Stack>
              ),
              value: 'LINK'
            }
          ]}
          selected={actionButtonBehavior.value}
          onChange={([value]) => actionButtonBehavior.onChange(value)}
        />
      </Card>
      <Card title="Discount type" sectioned>
        <FormLayout>
          <ChoiceList
            choices={[
              {
                label: 'Percentage off',
                value: 'PERCENTAGE'
              },
              {
                label: `${currency} off`,
                value: currency
              },
              {
                label: 'Set price',
                value: 'SET_PRICE'
              },
              {
                label: 'No discount',
                value: 'NO_DISCOUNT'
              }
            ]}
            selected={discountType.value}
            onChange={([value]) => discountType.onChange(value)}
          />
        </FormLayout>
      </Card>
      <Card title="Minimum requirements" sectioned>
        <FormLayout>
          <ChoiceList
            choices={[
              {
                label: 'None',
                value: 'NONE'
              },
              {
                label: 'Minimum purchase amount ($)',
                value: 'AMOUNT'
              },
              {
                label: 'Minimum quantity of items',
                value: 'QUANTITY'
              }
            ]}
            selected="NONE"
          />
        </FormLayout>
      </Card>
    </>
  );
};

OfferSettingsEditor.propTypes = {
  name: PropTypes.object.isRequired,
  strategy: PropTypes.object.isRequired,
  triggerEvent: PropTypes.object.isRequired,
  triggerExternalLinksOnly: PropTypes.object.isRequired,
  triggerScrollThreshold: PropTypes.object.isRequired,
  triggerPage: PropTypes.object.isRequired,
  triggerPagePath: PropTypes.object.isRequired,
  discountType: PropTypes.object.isRequired,
  actionButtonBehavior: PropTypes.object.isRequired,
  actionButtonLink: PropTypes.object.isRequired,
  actionButtonLinkOpenInNewTab: PropTypes.object.isRequired,
  viewAllowance: PropTypes.object.isRequired,
  viewAllowanceDays: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  submitted: PropTypes.bool,
  onStrategyChange: PropTypes.func
};

OfferSettingsEditor.defaultProps = {
  submitted: false,
  onStrategyChange: () => {}
};

export default OfferSettingsEditor;
