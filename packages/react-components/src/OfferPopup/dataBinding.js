import { useCallback, useEffect } from 'react';
import knockout from 'knockout';
import { useCookies } from '@neatowebsolutions/upselling-react-hooks';

const useDataBinding = ({
  iframe,
  offer,
  offeredProducts,
  addedQuantity,
  html,
  css,
  javascript,
  modalContentContainer,
  onAddProduct,
  onCheckoutUrlUpdate,
  onQuantityAdd
}) => {
  const { getCookie } = useCookies();

  const iframeDocument =
    iframe?.contentWindow?.document ||
    iframe?.contentDocument ||
    iframe?.document;
  const iframeBodyNode = iframeDocument?.body;

  // Define Knockout bindings for use within the popup.
  const ViewModel = useCallback(
    function () {
      this.offeredProducts = () => offeredProducts;

      this.productQuantityLimit = offer.productQuantityLimit;

      this.remainingQuantity = knockout.computed(() => {
        const hasQuantityLimit = !!offer.productQuantityLimit;
        const remainingQuantity =
          hasQuantityLimit && offer.productQuantityLimit - addedQuantity;

        if (!hasQuantityLimit) {
          return;
        }

        return remainingQuantity;
      }, this);

      this.addingEnabled = (index) =>
        knockout.computed(() => {
          const hasQuantityLimit = !!offer.productQuantityLimit;
          const addedQuantityBelowLimit =
            addedQuantity < offer.productQuantityLimit;
          const remainingQuantity =
            hasQuantityLimit && offer.productQuantityLimit - addedQuantity;
          const selectedQuantity = parseInt(this.selectedQuantities()[index]());
          const selectedQuantityBelowLimit =
            !hasQuantityLimit || selectedQuantity <= remainingQuantity;

          return (
            !hasQuantityLimit ||
            (addedQuantityBelowLimit && selectedQuantityBelowLimit)
          );
        }, this);

      this.selectedVariantIds = knockout.observableArray(
        offeredProducts.map(({ variants }) =>
          knockout.observable(variants[0].id)
        )
      );

      this.selectedVariants = () =>
        offeredProducts.map(
          ({ variants }, index) =>
            variants.find(
              ({ id }) => id === this.selectedVariantIds()[index]()
            ) || variants[0]
        );

      this.selectedQuantities = knockout.observableArray(
        [...Array(3).keys()].map(() => knockout.observable(1))
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

          // setCheckoutUrl(getCookie('upsellingDraftOrderCheckoutUrl'));
          // setAddedQuantity(addedQuantity + quantity);
          onCheckoutUrlUpdate(getCookie('upsellingDraftOrderCheckoutUrl'));
          onQuantityAdd(addedQuantity + quantity);

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
      addedQuantity,
      getCookie,
      onAddProduct,
      onCheckoutUrlUpdate,
      onQuantityAdd
    ]
  );

  // Set up data binding.
  useEffect(() => {
    if (!iframe?.contentWindow) {
      return;
    }

    // Add a reference to the data binding library.
    iframe.contentWindow.ko = knockout;

    // TODO: Figure out why a timeout is necessary, and remove it if possible.
    setTimeout(() => {
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
    }, 100);

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
