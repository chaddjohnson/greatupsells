import { useField, useList, notEmpty } from '@shopify/react-form';

const useFields = (initialOffer, showEndDate) => {
  const name = useField({
    value: initialOffer.name,
    validates: [notEmpty("Name can't be blank")]
  });
  const strategy = useField(initialOffer.strategy);
  const triggerEvent = useField(initialOffer.triggerEvent);
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
  const triggerPagePath = useField({
    value: initialOffer.triggerPagePath,
    validates: [
      (value) => {
        if (value.match(/^https?:\/\//)) {
          return "Trigger page path can't contain a protocol or a domain";
        }
      },
      (value) => {
        if (value.match(/\?/)) {
          return "Trigger page path can't contain a query string";
        }
      }
    ]
  });
  const discountType = useField(initialOffer.discountType);
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
  const showNotificationBanner = useField(initialOffer.showNotificationBanner);
  const successMessageText = useField(
    {
      value: initialOffer.successMessageText,
      validates: (value) => {
        if (showNotificationBanner.value && !value) {
          return "Success message text can't be blank";
        }
      }
    },
    [showNotificationBanner.value]
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
  const enableTimer = useField(initialOffer.enableTimer);
  const enableProductLinks = useField(initialOffer.enableProductLinks);
  const hideOutOfStockProducts = useField(initialOffer.hideOutOfStockProducts);
  const enableEscClose = useField(initialOffer.enableEscClose);
  const enableMaskClose = useField(initialOffer.enableMaskClose);
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
    triggerScrollThreshold,
    triggerPagePath,
    discountType,
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
    showNotificationBanner,
    successMessageText,
    startAt,
    endAt,
    enableTimer,
    enableProductLinks,
    hideOutOfStockProducts,
    enableEscClose,
    enableMaskClose,
    enableQuantitySelection,
    limitQuantitySelection,
    productQuantityLimit,
    hideIfItemAdded,
    allowWithDiscountCodes
  };
};

export default useFields;
