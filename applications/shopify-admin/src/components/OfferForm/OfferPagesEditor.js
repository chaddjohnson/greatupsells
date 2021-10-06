import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  TextField,
  ChoiceList,
  Popover,
  Button,
  Heading,
  TextContainer
} from '@shopify/polaris';
import Link from '../Link';

const OfferPagesEditor = ({ triggerPage, triggerPagePath, submitted }) => {
  const [
    triggerPagePathPopoverActive,
    setTriggerPagePathPopoverActive
  ] = useState(false);

  const handleTriggerPageChange = (value) => {
    if (triggerPage.value !== 'PAGE') {
      triggerPagePath.onChange(undefined);
    }

    triggerPage.onChange(value);
  };

  const handleTriggerPagePathBlur = (event) => {
    const hasLeadingSlash = !!triggerPagePath.value?.match(/^\//);

    if (triggerPagePath.value && !hasLeadingSlash) {
      triggerPagePath.onChange(`/${triggerPagePath.value}`);
    }

    triggerPagePath.onBlur(event);
  };

  return (
    <Card title="Pages" sectioned>
      <FormLayout>
        <ChoiceList
          choices={[
            {
              label: 'Any page',
              helpText: 'Offer may show on any page.',
              value: 'ANY'
            },
            {
              label: 'Specific pages',
              helpText: 'Offer may show only on one or more specific pages.',
              renderChildren: (isSelected) =>
                isSelected && (
                  <TextField
                    value={triggerPagePath.value}
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
                                plain
                                monochrome
                                onClick={() =>
                                  setTriggerPagePathPopoverActive(
                                    !triggerPagePathPopoverActive
                                  )
                                }
                              >
                                glob syntax
                              </Button>
                              .
                            </>
                          }
                          onClose={() => setTriggerPagePathPopoverActive(false)}
                        >
                          <TextContainer spacing="loose">
                            <Heading>Glob syntax</Heading>
                            <p>The path</p>
                            <p>
                              <code>*/products/*</code>
                            </p>
                            <p>will match all product page URLs such as</p>
                            <p>
                              <code>/products/fancy-shoes</code>
                              <br />
                              <code>/products/silly-socks</code>
                              <br />
                              <code>
                                /collections/shoes/products/fancy-shoes
                              </code>
                              <br />
                              <code>
                                /collections/shoes/products/silly-socks
                              </code>
                            </p>
                            <p>
                              <Link
                                url="https://en.wikipedia.org/wiki/Glob_(programming)"
                                external
                              >
                                More information
                              </Link>
                            </p>
                            <p>
                              Please note that extended glob support is enabled,
                              and globstar support is disabled.
                            </p>
                          </TextContainer>
                        </Popover>
                      </>
                    }
                    {...triggerPagePath}
                    error={submitted && triggerPagePath.error}
                    onBlur={handleTriggerPagePathBlur}
                  />
                ),
              value: 'PAGE'
            }
          ]}
          selected={triggerPage.value}
          onChange={([value]) => handleTriggerPageChange(value)}
        />
      </FormLayout>
    </Card>
  );
};

OfferPagesEditor.propTypes = {
  triggerPage: PropTypes.object.isRequired,
  triggerPagePath: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

OfferPagesEditor.defaultProps = {
  submitted: false
};

export default OfferPagesEditor;
