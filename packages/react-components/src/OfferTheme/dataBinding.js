import { useCallback, useState, useMemo, useEffect } from 'react';
import knockout from 'knockout';
import { useCookies, useCurrency } from '@greatupsells/react-hooks';

const useDataBinding = ({
  context,
  shop,
  offer,
  locale,
  countryCode,
  currency,
  offeredProducts,
  addedQuantities,
  shopifyCartTotal,
  shopifyCartItemCount,
  html,
  css,
  javascript,
  container,
  onAddProducts,
  onReplaceProduct,
  onCheckoutUrlUpdate,
  onQuantityAdd
}) => {
  const { getCookie } = useCookies();
  const { currency: shopCurrency } = shop;
  const { formatCurrency, convertCurrency } = useCurrency({
    locale,
    countryCode,
    currency
  });

  const [bindingsApplied, setBindingsApplied] = useState(false);

  const addedQuantity = useMemo(
    () =>
      Object.values(addedQuantities).reduce((sum, quantity) => {
        return sum + quantity;
      }, 0),
    [addedQuantities]
  );

  const documentContext =
    context?.contentWindow?.document ||
    context?.contentDocument ||
    context?.document;
  const body = documentContext?.body;

  // Define Knockout bindings for use within the popup.
  const ViewModel = useCallback(
    function () {
      this.offeredProducts = () => offeredProducts;
      this.addedQuantities = () => addedQuantities;

      this.shopifyCartTotal = knockout.observable(shopifyCartTotal);
      this.shopifyCartTotalFormatted = () =>
        formatCurrency(
          convertCurrency(this.shopifyCartTotal() || 0, shopCurrency, currency)
        );

      this.shopifyCartItemCount = knockout.observable(
        shopifyCartItemCount || 0
      );

      this.subtotalFormatted = () => {
        const subtotal = this.selectedVariants().reduce(
          (sum, { salePrice }, index) => {
            const quantity = parseInt(this.selectedQuantities()[index]());

            return sum + salePrice * quantity;
          },
          0
        );

        return formatCurrency(
          convertCurrency(subtotal, shopCurrency, currency)
        );
      };

      this.savingsFormatted = () => {
        const savings = this.selectedVariants().reduce(
          (sum, { price, salePrice }, index) => {
            const quantity = parseInt(this.selectedQuantities()[index]());

            return sum + (price - salePrice) * quantity;
          },
          0
        );

        return formatCurrency(convertCurrency(savings, shopCurrency, currency));
      };

      this.selectedVariantIds = knockout.observableArray(
        offeredProducts.map(({ variants }) => {
          const firstVariantHavingInventory = variants.find(
            (current) => current.hasInventory
          );
          const firstVariant = variants[0];

          return knockout.observable(
            firstVariantHavingInventory?.id || firstVariant?.id
          );
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
            selectedVariantHasInventory
          );
        }, this);

      this.replacingProductEnabled = (index) => {
        const itemReplaced = !!Object.values(addedQuantities || {}).find(
          (quantity) => quantity > 0
        );
        const selectedVariantHasInventory = this.selectedVariants()[index]
          ?.hasInventory;

        return !itemReplaced && selectedVariantHasInventory;
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
        const { viewModel } = context;
        const productButton = event.target;
        const offerId = offer._id;
        const shopifyProductId = viewModel.offeredProducts()[productIndex].id;
        const shopifyVariantId = viewModel.selectedVariants()[productIndex].id;
        const quantity = parseInt(
          context.viewModel.selectedQuantities()[productIndex]()
        );

        productButton.setAttribute('disabled', 'disabled');
        productButton.classList.add('loading');

        try {
          await onAddProducts(offerId, [
            { offerId, shopifyProductId, shopifyVariantId, quantity }
          ]);
          onQuantityAdd(productIndex, quantity);
          onCheckoutUrlUpdate(getCookie('greatupsellsDraftOrderInvoiceUrl'));

          productButton.removeAttribute('disabled');
          productButton.classList.remove('loading');
        } catch (error) {
          productButton.removeAttribute('disabled');
          productButton.classList.remove('loading');

          throw error;
        }
      };

      this.handleAddProductBundle = async (event) => {
        const { viewModel } = context;
        const bundleButton = event.target;
        const offerId = offer._id;
        const productCount = offeredProducts.length;
        const items = [...Array(productCount).keys()].map((productIndex) => ({
          offerId,
          shopifyProductId: viewModel.offeredProducts()[productIndex].id,
          shopifyVariantId: viewModel.selectedVariants()[productIndex].id,
          quantity: parseInt(
            context.viewModel.selectedQuantities()[productIndex]()
          )
        }));

        bundleButton.setAttribute('disabled', 'disabled');
        bundleButton.classList.add('loading');

        try {
          await onAddProducts(offerId, items);

          [...Array(productCount).keys()].forEach((productIndex) =>
            onQuantityAdd(productIndex, items[productIndex].quantity)
          );

          onCheckoutUrlUpdate(getCookie('greatupsellsDraftOrderInvoiceUrl'));

          bundleButton.classList.remove('loading');
        } catch (error) {
          bundleButton.removeAttribute('disabled');
          bundleButton.classList.remove('loading');

          throw error;
        }
      };

      this.handleReplaceProduct = async (
        event,
        triggerShopifyProductId,
        productIndex
      ) => {
        const { viewModel } = context;
        const productButton = event.target;
        const offerId = offer._id;
        const shopifyProductId = viewModel.offeredProducts()[productIndex].id;
        const shopifyVariantId = viewModel.selectedVariants()[productIndex].id;

        productButton.setAttribute('disabled', 'disabled');
        productButton.classList.add('loading');

        try {
          await onReplaceProduct(
            offerId,
            triggerShopifyProductId,
            shopifyProductId,
            shopifyVariantId
          );
          onQuantityAdd(productIndex, 1);
          onCheckoutUrlUpdate(getCookie('greatupsellsDraftOrderInvoiceUrl'));

          productButton.removeAttribute('disabled');
        } catch (error) {
          productButton.removeAttribute('disabled');
        }

        productButton.classList.remove('loading');
      };

      // this.handlePostPurchaseAddProduct = async (event, productIndex) => {
      //   // TODO
      // };

      this.handleThankYouPageAddProduct = async (event, productIndex) => {
        const productButton = event.target;

        await this.handleAddProduct(event, productIndex);

        productButton.setAttribute('disabled', 'disabled');
        productButton.classList.add('loading');

        // This timeout serves as a workaround. For some strange reason, with
        // Thank You Page offers (and maybe other offer types), sometimes,
        // despite the redirection URL used here, the actual checkout URL is
        // different than the checkout URL associated with the invoice URL.
        // If this occurs, no conversion is tracked for the order. Somehow this
        // seems to remedy the problem.
        setTimeout(() => {
          // Redirect to the draft order checkout URL.
          window.location.href = getCookie('greatupsellsDraftOrderInvoiceUrl');
        }, 100);
      };

      this.handleThankYouPageAddProductBundle = async (event) => {
        await this.handleAddProductBundle(event);

        // This timeout serves as a workaround. For some strange reason, with
        // Thank You Page offers (and maybe other offer types), sometimes,
        // despite the redirection URL used here, the actual checkout URL is
        // different than the checkout URL associated with the invoice URL.
        // If this occurs, no conversion is tracked for the order. Somehow this
        // seems to remedy the problem.
        setTimeout(() => {
          // Redirect to the draft order checkout URL.
          window.location.href = getCookie('greatupsellsDraftOrderInvoiceUrl');
        }, 100);
      };
    },
    [
      context,
      offer,
      offeredProducts,
      addedQuantities,
      addedQuantity,
      shopifyCartTotal,
      shopifyCartItemCount,
      getCookie,
      onAddProducts,
      onReplaceProduct,
      onCheckoutUrlUpdate,
      onQuantityAdd,
      formatCurrency,
      convertCurrency,
      currency,
      shopCurrency
    ]
  );

  // Set up data binding.
  useEffect(() => {
    if (!context || !body) {
      return;
    }

    if (bindingsApplied) {
      if (context.viewModel) {
        context.viewModel.shopifyCartTotal(shopifyCartTotal);
        context.viewModel.shopifyCartItemCount(shopifyCartItemCount);
      }

      return;
    }

    setBindingsApplied(true);

    // Not sure why a timeout is necessary...
    setTimeout(() => {
      // Add a reference to the data binding library.
      context.ko = knockout;

      // (Re)initialize data bindings.
      context.viewModel = new ViewModel();
      context.ko.applyBindings(context.viewModel, body);
    });
  }, [
    context,
    body,
    ViewModel,
    container,
    html,
    css,
    javascript,
    bindingsApplied,
    shopifyCartTotal,
    shopifyCartItemCount
  ]);

  useEffect(() => {
    // Remove Knockout bindings on unmount.
    return () => {
      if (context?.ko) {
        context.ko.cleanNode(body);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useDataBinding;
