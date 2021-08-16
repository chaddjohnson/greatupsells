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
  const discountValue = useField(
    {
      value: initialOffer.discountValue.toString(),
      validates: [
        (value) => {
          if (discountType.value !== 'NO_DISCOUNT' && !value) {
            return "Discount value can't be blank";
          }
        },
        (value) => {
          if (value && Number.isNaN(value)) {
            return 'Discount value must be a number';
          }
        },
        (value) => {
          if (value && Number(value) <= 0) {
            return 'Discount value must be greater than zero';
          }
        },
        (value) => {
          if (discountType === 'PERCENTAGE' && value && Number(value) > 100) {
            return 'Discount value must be 100 or less';
          }
        }
      ]
    },
    [discountType.value]
  );
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
  const minimumRequirements = useField(initialOffer.minimumRequirements);
  const minimumRequiredAmount = useField(
    {
      value: initialOffer.minimumRequiredAmount,
      validates: [
        (value) => {
          if (discountType.value !== 'NONE' && !value) {
            return "Minimum amount can't be blank";
          }
        },
        (value) => {
          if (value && Number.isNaN(value)) {
            return 'Minimum amount must be a number';
          }
        },
        (value) => {
          if (
            value &&
            Number(value) <= 0 &&
            minimumRequirements.value === 'AMOUNT'
          ) {
            return 'Minimum amount must be greater than zero';
          }
        },
        (value) => {
          if (
            value &&
            Number(value) < 1 &&
            minimumRequirements.value === 'QUANTITY'
          ) {
            return 'Minimum amount must be greater than 1';
          }
        }
      ]
    },
    [minimumRequirements.value]
  );
  const offeredProducts = useList({
    list: initialOffer.offeredProducts.map((offeredProduct) => ({
      ...offeredProduct,
      minQuantity: offeredProduct.minQuantity?.toString(),
      maxQuantity: offeredProduct.maxQuantity?.toString()
    })),
    validates: {
      minQuantity: (value) => {
        if (value && Number.isNaN(value)) {
          return 'Minumum quantity must be valid';
        }
        if (value && Number(value) < 0) {
          return 'Minumum quantity must be zero or greater';
        }
        if (value && Number(value) % 1 !== 0) {
          return 'Minumum quantity must be a whole number';
        }
      },
      maxQuantity: (value) => {
        if (value && Number.isNaN(value)) {
          return 'Maximum quantity must be valid';
        }
        if (value && Number(value) < 1) {
          return 'Maximum quantity must be 1 or greater';
        }
        if (value && Number(value) % 1 !== 0) {
          return 'Maximum quantity must be a whole number';
        }
      }
    }
  });
  const offeredCollections = useList(initialOffer.offeredCollections);
  const triggerProducts = useList(initialOffer.triggerProducts);
  const triggerCollections = useList(initialOffer.triggerCollections);
  const geotargetingCountries = useField(initialOffer.geotargetingCountries);
  const animation = useField(initialOffer.animation);
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
  const disableOutOfStockVariants = useField(
    initialOffer.disableOutOfStockVariants
  );
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
  const enableBundling = useField(initialOffer.enableBundling);
  const enableVariantSelection = useField(initialOffer.enableVariantSelection);
  const enableQuantitySelection = useField(
    initialOffer.enableQuantitySelection
  );
  const viewAllowance = useField(initialOffer.viewAllowance);
  const viewAllowanceDays = useField(
    initialOffer.viewAllowanceDays?.toString()
  );
  const hideIfItemAdded = useField(initialOffer.hideIfItemAdded);

  return {
    name,
    strategy,
    triggerEvent,
    triggerExternalLinksOnly,
    triggerScrollThreshold,
    triggerPage,
    triggerPagePath,
    discountType,
    discountValue,
    discountTitle,
    minimumRequirements,
    minimumRequiredAmount,
    offeredProducts,
    offeredCollections,
    triggerProducts,
    triggerCollections,
    geotargetingCountries,
    animation,
    actionButtonBehavior,
    actionButtonLink,
    actionButtonLinkOpenInNewTab,
    viewAllowance,
    viewAllowanceDays,
    startAt,
    endAt,
    disableOutOfStockVariants,
    delaySeconds,
    onPageRequiredSeconds,
    enableEscClose,
    enableMaskClose,
    enableBundling,
    enableVariantSelection,
    enableQuantitySelection,
    hideIfItemAdded
  };
};

export default useFields;
