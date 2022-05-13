import {
  useField,
  notEmpty,
  numericString,
  positiveNumericString
} from '@shopify/react-form';

const useFields = (initialOffer, showEndDate) => {
  const name = useField({
    value: initialOffer.name,
    validates: [notEmpty("Name can't be blank")]
  });
  const strategy = useField(initialOffer.strategy);
  const actionButtonBehavior = useField(initialOffer.actionButtonBehavior);
  const actionButtonLink = useField(
    {
      value: initialOffer.actionButtonLink,
      validates: (value) => {
        if (actionButtonBehavior.value === 'LINK' && !value) {
          return "Action button link can't be blank";
        }
      }
    },
    [actionButtonBehavior.value]
  );
  const actionButtonLinkOpenInNewTab = useField(
    initialOffer.actionButtonLinkOpenInNewTab || false
  );
  const triggerEvent = useField(initialOffer.triggerEvent);
  const triggerExternalLinksOnly = useField(
    initialOffer.triggerExternalLinksOnly
  );
  const triggerScrollThreshold = useField(
    {
      value: initialOffer.triggerScrollThreshold?.toString(),
      validates: [
        (value) => {
          if (triggerEvent.value === 'SCROLL' && !value) {
            return "Trigger scroll threshold can't be blank";
          }
        },
        (value) =>
          triggerEvent.value === 'SCROLL' &&
          value &&
          numericString('Trigger scroll threshold must be a number')(
            value?.toString()
          ),
        (value) =>
          triggerEvent.value === 'SCROLL' &&
          value &&
          positiveNumericString(
            'Trigger scroll threshold must be a positive value'
          )(value?.toString())
      ]
    },
    [triggerEvent.value]
  );
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
  const viewAllowance = useField(initialOffer.viewAllowance);
  const viewAllowanceDays = useField(
    initialOffer.viewAllowanceDays?.toString()
  );
  const triggerProducts = useField(
    {
      value: initialOffer.triggerProducts,
      validates: [
        (value) => {
          if (strategy.value === 'UPSELL' && !value?.length) {
            return 'One or more trigger products are required';
          }
        }
      ]
    },
    [strategy.value]
  );
  const triggerCollections = useField(initialOffer.triggerCollections);
  const minimumRequirement = useField(initialOffer.minimumRequirement);
  const minimumRequiredAmount = useField(
    {
      value: initialOffer.minimumRequiredAmount?.toString(),
      validates: [
        (value) => {
          if (minimumRequirement.value !== 'NONE' && !value) {
            return "Minimum amount can't be blank";
          }
        },
        (value) =>
          value &&
          numericString('Minimum amount must be a number')(value?.toString()),
        (value) => {
          if (
            value &&
            Number(value) <= 0 &&
            minimumRequirement.value === 'AMOUNT'
          ) {
            return 'Minimum amount must be greater than zero';
          }
        },
        (value) => {
          if (
            value &&
            Number(value) < 1 &&
            minimumRequirement.value === 'QUANTITY'
          ) {
            return 'Minimum amount must be greater than 1';
          }
        }
      ]
    },
    [minimumRequirement.value]
  );
  const offeredCollections = useField(initialOffer.offeredCollections);
  const offeredProducts = useField({
    value: initialOffer.offeredProducts,
    validates: [
      (value) => {
        if (!value?.length && !offeredCollections.value.length) {
          return 'One or more offered products or collections are required';
        }
      }
    ]
  });
  const maximumAcceptedProductQuantity = useField(
    initialOffer.maximumAcceptedProductQuantity?.toString()
  );
  const discountType = useField(initialOffer.discountType);
  const discountValue = useField(
    {
      value: initialOffer.discountValue?.toString(),
      validates: [
        (value) =>
          discountType.value !== 'NO_DISCOUNT' &&
          notEmpty("Discount value can't be blank")(value?.toString()),
        (value) =>
          value &&
          numericString('Discount value must be a number')(value?.toString()),
        (value) => {
          if (value && Number(value) <= 0) {
            return 'Discount value must be greater than zero';
          }
        },
        (value) => {
          if (
            discountType.value === 'PERCENTAGE' &&
            value &&
            Number(value) > 1
          ) {
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
  const geotargetingCountries = useField(initialOffer.geotargetingCountries);
  const startAt = useField({
    value: initialOffer.startAt,
    validates: [
      notEmpty("Start date can't be blank"),
      (value) => {
        if (value && !Date.parse(value)) {
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
          if (value && !Date.parse(value)) {
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
  const delaySeconds = useField({
    value: initialOffer.delaySeconds?.toString(),
    validates: [
      (value) =>
        value &&
        numericString('Delay seconds must be a number')(value?.toString()),
      (value) =>
        value &&
        positiveNumericString('Delay seconds must be a positive value')(
          value?.toString()
        )
    ]
  });
  const onPageRequiredSeconds = useField({
    value: initialOffer.onPageRequiredSeconds?.toString(),
    validates: [
      (value) =>
        value &&
        numericString('Required seconds must be a number')(value?.toString()),
      (value) =>
        value &&
        positiveNumericString('Required seconds must be a positive value')(
          value?.toString()
        )
    ]
  });
  const enableEscClose = useField(initialOffer.enableEscClose);
  const enableMaskClose = useField(initialOffer.enableMaskClose);
  const enableBundling = useField(initialOffer.enableBundling);
  const enableVariantSelection = useField(initialOffer.enableVariantSelection);
  const enableQuantitySelection = useField(
    initialOffer.enableQuantitySelection
  );
  const animation = useField(initialOffer.animation);

  return {
    name,
    strategy,
    actionButtonBehavior,
    actionButtonLink,
    actionButtonLinkOpenInNewTab,
    triggerEvent,
    triggerExternalLinksOnly,
    triggerScrollThreshold,
    triggerPage,
    triggerPagePath,
    viewAllowance,
    viewAllowanceDays,
    triggerProducts,
    triggerCollections,
    minimumRequirement,
    minimumRequiredAmount,
    offeredProducts,
    offeredCollections,
    maximumAcceptedProductQuantity,
    discountType,
    discountValue,
    discountTitle,
    geotargetingCountries,
    startAt,
    endAt,
    delaySeconds,
    onPageRequiredSeconds,
    enableEscClose,
    enableMaskClose,
    enableBundling,
    enableVariantSelection,
    enableQuantitySelection,
    animation
  };
};

export default useFields;
