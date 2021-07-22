import { useField, useList, notEmpty } from '@shopify/react-form';

const useFields = (initialOffer, showEndDate) => {
  const name = useField({
    value: initialOffer.name,
    validates: [notEmpty("Name can't be blank")]
  });
  const strategy = useField(initialOffer.strategy);
  const triggerEvent = useField(initialOffer.triggerEvent);
  const triggerExternalLinksOnly = useField(
    initialOffer.triggerExternalLinksOnly
  );
  const triggerScrollThreshold = useField({
    value: initialOffer.triggerScrollThreshold?.toString(),
    validates: [
      (value) => {
        if (!value) {
          return "Trigger scroll threshold can't be blank";
        }
      },
      (value) => {
        if (value && Number.isNaN(value)) {
          return 'Trigger scroll threshold must be a number';
        }
      },
      (value) => {
        if (value && Number(value) < 1) {
          return 'Trigger scroll threshold must be a positive value';
        }
      }
    ]
  });
  const triggerPage = useField(initialOffer.triggerPage);
  const triggerPagePath = useField({
    value: initialOffer.triggerPagePath,
    validates: [
      (value) => {
        if (value && value.match(/^https?:\/\//)) {
          return "Trigger page path can't contain a protocol or a domain";
        }
      },
      (value) => {
        if (value && value.match(/\?/)) {
          return "Trigger page path can't contain a query string";
        }
      }
    ]
  });
  const discountType = useField(initialOffer.discountType);
  const discountTitle = useField(
    {
      value: initialOffer.discountTitle,
      validates: (value) => {
        if (discountType.value !== 'NO_DISCOUNT' && !value) {
          return "Discount title can't be blank";
        }
      }
    },
    [discountType.value]
  );
  const offeredProducts = useList(initialOffer.offeredProducts);
  const offeredCollections = useList(initialOffer.offeredCollections);
  const triggerProducts = useList(initialOffer.triggerProducts);
  const triggerCollections = useList(initialOffer.triggerCollections);
  const enableGeotargeting = useField(initialOffer.enableGeotargeting);
  const geotargetingCountries = useField(initialOffer.geotargetingCountries);
  const actionButtonBehavior = useField(initialOffer.actionButtonBehavior);
  const actionButtonLink = useField(
    {
      value: initialOffer.actionButtonLink,
      validates: (value) => {
        if (actionButtonBehavior.value === 'Link' && !value) {
          return "Action button link can't be blank";
        }
      }
    },
    [actionButtonBehavior.value]
  );
  const actionButtonLinkOpenInNewTab = useField(
    initialOffer.actionButtonLinkOpenInNewTab || false
  );
  const startAt = useField({
    value: initialOffer.startAt,
    validates: [
      notEmpty("Start date can't be blank"),
      (value) => {
        if (value && Number.isNaN(new Date(value))) {
          return 'Start date must be valid';
        }
      }
    ]
  });
  const endAt = useField(
    {
      value: initialOffer.endAt,
      validates: [
        (value) => {
          if (showEndDate && !value) {
            return "End date can't be blank";
          }
        },
        (value) => {
          if (value && Number.isNaN(new Date(value))) {
            return 'End date must be valid';
          }
        },
        (value) => {
          if (
            showEndDate &&
            value &&
            startAt.value &&
            new Date(value) < new Date(startAt.value)
          ) {
            return 'End date must be on or after start date';
          }
        }
      ]
    },
    [showEndDate, startAt.value]
  );
  const hideOutOfStockProducts = useField(initialOffer.hideOutOfStockProducts);
  const delaySeconds = useField({
    value: initialOffer.delaySeconds?.toString(),
    validates: [
      (value) => {
        if (!value) {
          return "Delay seconds can't be blank";
        }
      },
      (value) => {
        if (value && Number.isNaN(value)) {
          return 'Delay seconds must be a number';
        }
      },
      (value) => {
        if (value && Number(value) < 1) {
          return 'Delay seconds must be a positive value';
        }
      }
    ]
  });
  const onPageRequiredSeconds = useField({
    value: initialOffer.onPageRequiredSeconds?.toString(),
    validates: [
      (value) => {
        if (!value) {
          return "Required seconds can't be blank";
        }
      },
      (value) => {
        if (value && Number.isNaN(value)) {
          return 'Required seconds must be a number';
        }
      },
      (value) => {
        if (value && Number(value) < 1) {
          return 'Required seconds must be a positive value';
        }
      }
    ]
  });
  const enableEscClose = useField(initialOffer.enableEscClose);
  const enableMaskClose = useField(initialOffer.enableMaskClose);
  const enableVariantSelection = useField(initialOffer.enableVariantSelection);
  const enableQuantitySelection = useField(
    initialOffer.enableQuantitySelection
  );
  const limitQuantitySelection = useField(initialOffer.limitQuantitySelection);
  const productQuantityLimit = useField(
    {
      value: initialOffer.productQuantityLimit?.toString(),
      validates: [
        (value) => {
          if (limitQuantitySelection.value && !value) {
            return "Product quantity limit can't be blank";
          }
        },
        (value) => {
          if (value && Number.isNaN(value)) {
            return 'Product quantity limit must be a number';
          }
        },
        (value) => {
          if (value && Number(value) < 1) {
            return 'Product quantity limit must be a positive value';
          }
        },
        (value) => {
          if (value && Number(value) % 1 !== 0) {
            return 'Invalid value.';
          }
        }
      ]
    },
    [limitQuantitySelection.value]
  );
  const viewAllowance = useField(initialOffer.viewAllowance);
  const viewAllowanceDays = useField(
    initialOffer.viewAllowanceDays?.toString()
  );
  const hideIfItemAdded = useField(initialOffer.hideIfItemAdded);
  const allowWithDiscountCodes = useField(initialOffer.allowWithDiscountCodes);

  return {
    name,
    strategy,
    triggerEvent,
    triggerExternalLinksOnly,
    triggerScrollThreshold,
    triggerPage,
    triggerPagePath,
    discountType,
    discountTitle,
    offeredProducts,
    offeredCollections,
    triggerProducts,
    triggerCollections,
    enableGeotargeting,
    geotargetingCountries,
    actionButtonBehavior,
    actionButtonLink,
    actionButtonLinkOpenInNewTab,
    viewAllowance,
    viewAllowanceDays,
    startAt,
    endAt,
    hideOutOfStockProducts,
    delaySeconds,
    onPageRequiredSeconds,
    enableEscClose,
    enableMaskClose,
    enableVariantSelection,
    enableQuantitySelection,
    limitQuantitySelection,
    productQuantityLimit,
    hideIfItemAdded,
    allowWithDiscountCodes
  };
};

export default useFields;
