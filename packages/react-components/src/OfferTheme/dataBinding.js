import { useCallback, useMemo, useEffect } from 'react';
import knockout from 'knockout';
import { useCookies, useCurrency } from '@greatupsells/react-hooks';

const useDataBinding = ({
  context,
  shop,
  offer,
  currency,
  offeredProducts,
  addedQuantities,
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
  const { locale, countryCode, currency: shopCurrency } = shop;
  const { formatCurrency, convertCurrency } = useCurrency({
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
            { shopifyProductId, shopifyVariantId, quantity }
          ]);
          onQuantityAdd(productIndex, quantity);
          onCheckoutUrlUpdate(getCookie('greatupsellsDraftOrderCheckoutUrl'));

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

          onCheckoutUrlUpdate(getCookie('greatupsellsDraftOrderCheckoutUrl'));

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
          onCheckoutUrlUpdate(getCookie('greatupsellsDraftOrderCheckoutUrl'));

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
        await this.handleAddProduct(event, productIndex);

        // Redirect to the draft order checkout URL.
        window.location.href = getCookie('greatupsellsDraftOrderCheckoutUrl');
      };

      this.handleThankYouPageAddProductBundle = async (event) => {
        await this.handleAddProductBundle(event);

        // Redirect to the draft order checkout URL.
        window.location.href = getCookie('greatupsellsDraftOrderCheckoutUrl');
      };
    },
    [
      context,
      offer,
      offeredProducts,
      addedQuantities,
      addedQuantity,
      getCookie,
      onAddProducts,
      onReplaceProduct,
      onCheckoutUrlUpdate,
      onQuantityAdd,
      formatCurrency
    ]
  );

  // Set up data binding.
  useEffect(() => {
    if (!context || !body) {
      return;
    }

    // Add a reference to the data binding library.
    context.ko = knockout;

    // Workaround for issue https://github.com/knockout/knockout/issues/912.
    if (container) {
      container.innerHTML = html;
    }

    // (Re)initialize data bindings.
    context.viewModel = new ViewModel();
    context.ko.cleanNode(body);
    context.ko.applyBindings(context.viewModel, body);

    // Remove bindings on cleanup.
    return () => {
      if (context?.ko) {
        context.ko.cleanNode(body);
      }
    };
  }, [context, body, ViewModel, container, html, css, javascript]);
};

export default useDataBinding;
