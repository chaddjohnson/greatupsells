import { useCallback, useMemo, useEffect } from 'react';
import knockout from 'knockout';
import { useCookies, useNumberFormatter } from '@greatupsellsreact-hooks';

const useDataBinding = ({
  iframe,
  shop,
  offer,
  offeredProducts,
  addedQuantities,
  html,
  css,
  javascript,
  modalContentContainer,
  onAddProduct,
  onReplaceProduct,
  onCheckoutUrlUpdate,
  onQuantityAdd
}) => {
  const { getCookie } = useCookies();
  const { locale, countryCode, currency } = shop;
  const { formatCurrency } = useNumberFormatter({
    locale,
    countryCode,
    currency
  });

  const addedQuantity = useMemo(
    () =>
      Object.values(addedQuantities).reduce((sum, quantity) => {
        return sum + quantity;
      }, 0),
    [addedQuantities]
  );

  const iframeDocument =
    iframe?.contentWindow?.document ||
    iframe?.contentDocument ||
    iframe?.document;
  const iframeBodyNode = iframeDocument?.body;

  // Define Knockout bindings for use within the popup.
  const ViewModel = useCallback(
    function () {
      this.disableOutOfStockVariants = () => offer.disableOutOfStockVariants;
      this.offeredProducts = () => offeredProducts;
      this.addedQuantities = () => addedQuantities;

      this.subtotalFormatted = () => {
        const subtotal = this.selectedVariants().reduce(
          (sum, { salePrice }, index) => {
            const quantity = parseInt(this.selectedQuantities()[index]());

            return sum + salePrice * quantity;
          },
          0
        );

        return formatCurrency(subtotal);
      };

      this.savingsFormatted = () => {
        const savings = this.selectedVariants().reduce(
          (sum, { price, salePrice }, index) => {
            const quantity = parseInt(this.selectedQuantities()[index]());

            return sum + (price - salePrice) * quantity;
          },
          0
        );

        return formatCurrency(savings);
      };

      this.selectedVariantIds = knockout.observableArray(
        offeredProducts.map(({ variants }) => {
          const firstVariantHavingInventory = variants.find(
            (current) => current.hasInventory
          );
          const firstVariant = variants[0];

          if (offer.disableOutOfStockVariants) {
            return knockout.observable(
              firstVariantHavingInventory?.id || firstVariant?.id
            );
          } else {
            return knockout.observable(firstVariant?.id);
          }
        })
      );

      this.selectedVariants = () =>
        offeredProducts.map(
          ({ variants }, index) =>
            variants.find(
              ({ id }) => id === this.selectedVariantIds()[index]()
            ) || variants[0]
        );

      this.selectedQuantities = knockout.observableArray(
        [...Array(offeredProducts.length)].map(() => {
          return knockout.observable(1);
        })
      );

      this.maxQuantity = (index) =>
        knockout.computed(() => {
          const { maximumOfferedProductQuantity: maxQuantity } = offer;
          const maxInventory = this.selectedVariants()[index]?.maxInventory;
          const hasMaxQuantity = typeof maxQuantity === 'number';
          const hasMaxInventory = typeof maxInventory === 'number';
          const remainingQuantity =
            hasMaxQuantity && maxQuantity - addedQuantity;
          const addedVariantQuantity = addedQuantities[index] || 0;
          const remainingInventory =
            hasMaxInventory && maxInventory - addedVariantQuantity;

          if (hasMaxQuantity && hasMaxInventory) {
            return Math.min(remainingQuantity, remainingInventory);
          }
          if (hasMaxQuantity) {
            return remainingQuantity;
          }
          if (hasMaxInventory) {
            return remainingInventory;
          }
        }, this);

      this.addingProductEnabled = (index) =>
        knockout.computed(() => {
          const { maximumOfferedProductQuantity: maxQuantity } = offer;
          const hasMaxQuantity = typeof maxQuantity === 'number';
          const remainingQuantity =
            hasMaxQuantity && maxQuantity - addedQuantity;
          const selectedQuantity = parseInt(this.selectedQuantities()[index]());
          const selectedQuantityValid =
            typeof selectedQuantity === 'number' &&
            !Number.isNaN(selectedQuantity) &&
            selectedQuantity > 0 &&
            selectedQuantity % 1 === 0;
          const selectedQuantityAtOrBelowRemaining =
            !hasMaxQuantity ||
            (selectedQuantityValid && selectedQuantity <= remainingQuantity);
          const addedQuantityBelowMax =
            !hasMaxQuantity || addedQuantity < maxQuantity;
          const selectedVariantHasInventory = this.selectedVariants()[index]
            ?.hasInventory;

          return (
            addedQuantityBelowMax &&
            selectedQuantityAtOrBelowRemaining &&
            selectedQuantityValid &&
            (!offer.disableOutOfStockVariants || selectedVariantHasInventory)
          );
        }, this);

      this.replacingProductEnabled = (index) => {
        const itemReplaced = !!Object.values(addedQuantities || {}).find(
          (quantity) => quantity > 0
        );
        const selectedVariantHasInventory = this.selectedVariants()[index]
          ?.hasInventory;

        return (
          !itemReplaced &&
          (!offer.disableOutOfStockVariants || selectedVariantHasInventory)
        );
      };

      this.addingProductBundleEnabled = knockout.computed(
        () =>
          this.selectedQuantities().every((selectedQuantity, index) => {
            const { maximumOfferedProductQuantity: maxQuantity } = offer;
            const hasMaxQuantity = typeof maxQuantity === 'number';
            const selectedQuantityValue = parseInt(
              this.selectedQuantities()[index]()
            );
            const selectedQuantityValid =
              typeof selectedQuantityValue === 'number' &&
              !Number.isNaN(selectedQuantity) &&
              selectedQuantityValue > 0 &&
              selectedQuantityValue % 1 === 0;
            const selectedQuantityAtOrBelowMax =
              !hasMaxQuantity ||
              (selectedQuantityValid && selectedQuantityValue <= maxQuantity);

            return selectedQuantityValid && selectedQuantityAtOrBelowMax;
          }),
        this
      );

      this.handleAddProduct = async (event, productIndex) => {
        const { viewModel } = iframe.contentWindow;
        const productButton = event.target;
        const offerId = offer._id;
        const productId = viewModel.offeredProducts()[productIndex].id;
        const variantId = viewModel.selectedVariants()[productIndex].id;
        const quantity = parseInt(
          iframe.contentWindow.viewModel.selectedQuantities()[productIndex]()
        );

        productButton.setAttribute('disabled', 'disabled');
        productButton.classList.add('loading');

        try {
          await onAddProduct(offerId, productId, variantId, quantity);

          onQuantityAdd(productIndex, quantity);
          onCheckoutUrlUpdate(getCookie('greatupsellsDraftOrderCheckoutUrl'));

          productButton.removeAttribute('disabled');
        } catch (error) {
          productButton.removeAttribute('disabled');
        }

        productButton.classList.remove('loading');
      };

      this.handleAddProductBundle = async (event) => {
        // TODO
      };

      this.handleReplaceProduct = async (
        event,
        triggerShopifyProductId,
        productIndex
      ) => {
        const { viewModel } = iframe.contentWindow;
        const productButton = event.target;
        const offerId = offer._id;
        const productId = viewModel.offeredProducts()[productIndex].id;
        const variantId = viewModel.selectedVariants()[productIndex].id;

        productButton.setAttribute('disabled', 'disabled');
        productButton.classList.add('loading');

        try {
          await onReplaceProduct(
            offerId,
            triggerShopifyProductId,
            productId,
            variantId
          );

          onQuantityAdd(productIndex, 1);
          onCheckoutUrlUpdate(getCookie('greatupsellsDraftOrderCheckoutUrl'));

          productButton.removeAttribute('disabled');
        } catch (error) {
          productButton.removeAttribute('disabled');
        }

        productButton.classList.remove('loading');
      };
    },
    [
      iframe,
      offer,
      offeredProducts,
      addedQuantities,
      addedQuantity,
      getCookie,
      onAddProduct,
      onReplaceProduct,
      onCheckoutUrlUpdate,
      onQuantityAdd,
      formatCurrency
    ]
  );

  // Set up data binding.
  useEffect(() => {
    if (!iframe?.contentWindow || !iframeBodyNode) {
      return;
    }

    // Add a reference to the data binding library.
    iframe.contentWindow.ko = knockout;

    // Workaround for issue https://github.com/knockout/knockout/issues/912.
    if (modalContentContainer) {
      modalContentContainer.innerHTML = html;
    }

    // (Re)initialize data bindings.
    iframe.contentWindow.viewModel = new ViewModel();
    iframe.contentWindow.ko.cleanNode(iframeBodyNode);
    iframe.contentWindow.ko.applyBindings(
      iframe.contentWindow.viewModel,
      iframeBodyNode
    );

    // Remove bindings on cleanup.
    return () => {
      if (iframe?.contentWindow?.ko) {
        iframe.contentWindow.ko.cleanNode(iframeBodyNode);
      }
    };
  }, [
    ViewModel,
    iframe,
    iframeBodyNode,
    modalContentContainer,
    html,
    css,
    javascript
  ]);
};

export default useDataBinding;
