import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, TextField, ChoiceList, Popover, Button, Select, Text, BlockStack } from '@shopify/polaris';
import Link from '../Link';

const pageOptions = [
  {
    value: '/',
    label: 'Home page'
  },
  {
    value: '*/collections/all',
    label: 'Catalog page'
  },
  {
    value: '*/collections/*',
    label: 'Collection pages'
  },
  {
    value: '*/products/*',
    label: 'Product pages'
  },
  {
    value: '*/blog/*',
    label: 'Blog pages'
  },
  {
    value: '*/cart',
    label: 'Cart page'
  }
  // {
  //   value: '*/orders/*',
  //   label: 'Order Status page'
  // },
  // {
  //   value: '*/checkouts/*/thank_you',
  //   label: 'Checkout Thank You page'
  // }
];

const OfferPagesEditor = ({ offer, triggerPage, triggerPagePath, submitted = false }) => {
  let initialTriggerPageType = 'ANY';

  if (triggerPage.value !== 'ANY') {
    if (pageOptions.map(({ value }) => value).includes(triggerPagePath.value)) {
      initialTriggerPageType = 'PAGE';
    } else {
      initialTriggerPageType = 'PATTERN';
    }
  }

  const [triggerPageType, setTriggerPageType] = useState(initialTriggerPageType);
  const [triggerPageSpecificPath, setTriggerPageSpecificPath] = useState(
    initialTriggerPageType === 'PAGE' && triggerPagePath.value
  );
  const [triggerPagePathPattern, setTriggerPagePathPattern] = useState(
    initialTriggerPageType === 'PATTERN' && triggerPagePath.value
  );
  const [triggerPagePathPopoverActive, setTriggerPagePathPopoverActive] = useState(false);

  const isInline = ['POST_PURCHASE', 'THANK_YOU_PAGE', 'ORDER_STATUS_PAGE'].includes(offer.strategy);

  const handleTriggerPageTypeChange = (value) => {
    setTriggerPageType(value);

    if (value === 'ANY') {
      triggerPage.onChange('ANY');
      triggerPagePath.onChange(undefined);
    }

    if (value === 'PAGE') {
      triggerPage.onChange('PAGE');
      triggerPagePath.onChange('/');
      setTriggerPageSpecificPath('/');
    }

    if (value === 'PATTERN') {
      triggerPage.onChange('PATTERN');
      triggerPagePath.onChange(undefined);
      setTriggerPagePathPattern(undefined);
    }
  };

  const handleTriggerPageSpecificPathChange = (value) => {
    setTriggerPageSpecificPath(value);
    triggerPagePath.onChange(value);
  };

  const handleTriggerPagePathPatternChange = (value) => {
    setTriggerPagePathPattern(value);
    triggerPagePath.onChange(value);
  };

  const handleTriggerPagePathPatternBlur = () => {
    if (!triggerPagePathPattern || triggerPagePathPattern === '/') {
      return;
    }

    // Remove trailing slash and query string parameters.
    const sanitized = triggerPagePathPattern.replace(/(\/*$|\/*?\?.*)/g, '');

    setTriggerPagePathPattern(sanitized);
    triggerPagePath.onChange(sanitized);
  };

  if (isInline) {
    return null;
  }

  return (
    <Card>
      <BlockStack gap="400" padding="400">
        <Text variant="headingMd">Pages</Text>
        <FormLayout>
          <ChoiceList
            choices={[
              {
                label: 'Any page',
                helpText: 'Offer may show on any page.',
                value: 'ANY'
              },
              {
                label: 'Page',
                helpText: 'Offer may show only on a specific page.',
                value: 'PAGE',
                renderChildren: (isSelected) =>
                  isSelected && (
                    <Select
                      label="Page"
                      labelHidden
                      options={pageOptions}
                      value={triggerPageSpecificPath}
                      onChange={handleTriggerPageSpecificPathChange}
                    />
                  )
              },
              {
                label: 'URL pattern',
                helpText: 'Offer may show only on one or more pages matching a URL pattern.',
                value: 'PATTERN',
                renderChildren: (isSelected) =>
                  isSelected && (
                    <TextField
                      value={triggerPagePathPattern}
                      placeholder="/page-url/here"
                      helpText={
                        <>
                          <Popover
                            sectioned
                            active={triggerPagePathPopoverActive}
                            activator={
                              <>
                                Use{' '}
                                <Button
                                  variant="plain"
                                  onClick={() => setTriggerPagePathPopoverActive(!triggerPagePathPopoverActive)}
                                >
                                  glob syntax
                                </Button>
                                .
                              </>
                            }
                            onClose={() => setTriggerPagePathPopoverActive(false)}
                          >
                            <BlockStack gap="200">
                              <Text variant="headingMd" as="h2">
                                Glob syntax
                              </Text>
                              <p>
                                <code>*/products/*</code>
                              </p>
                              <p>will match all product page URLs such as</p>
                              <p>
                                <code>/products/fancy-shoes</code>
                                <br />
                                <code>/products/silly-socks</code>
                                <br />
                                <code>/collections/shoes/products/fancy-shoes</code>
                                <br />
                                <code>/collections/shoes/products/silly-socks</code>
                              </p>
                              <hr />
                              <p>
                                <code>*/products/fancy-shoes</code>
                              </p>
                              <p>will match the product page for Fancy Shoes.</p>
                              <hr />
                              <p>
                                <Link url="https://en.wikipedia.org/wiki/Glob_(programming)" external>
                                  More information
                                </Link>
                              </p>
                              <p>Please note that extended glob support is enabled, and globstar support is disabled.</p>
                            </BlockStack>
                          </Popover>
                        </>
                      }
                      onChange={handleTriggerPagePathPatternChange}
                      error={submitted && triggerPagePath.error}
                      onBlur={handleTriggerPagePathPatternBlur}
                    />
                  )
              }
            ]}
            selected={triggerPageType}
            onChange={([value]) => handleTriggerPageTypeChange(value)}
          />
        </FormLayout>
      </BlockStack>
    </Card>
  );
};

OfferPagesEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  triggerPage: PropTypes.object.isRequired,
  triggerPagePath: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

export default OfferPagesEditor;
