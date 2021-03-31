const usePopupTheme = () => {
  const popupTheme = {
    displayOrder: 1,
    category: 'Cross-selling',
    thumbnailImageUrl: 'https://via.placeholder.com/800x600/f0f1f2/800020',
    description:
      'Nostrud qui sit culpa cupidummyDatat officia eu elit ex quis voluptate proident aute eu.',
    formFields: [
      {
        name: 'name',
        type: 'text'
      },
      {
        name: 'email',
        type: 'email'
      },
      {
        name: 'phone',
        type: 'tel'
      }
    ],
    variables: [
      {
        name: 'callToActionTextColor',
        label: 'Call to action text',
        type: 'color',
        group: 'Text',
        value: '#3D4246'
      },
      {
        name: 'callToActionText',
        label: 'Call to action',
        type: 'text',
        value: 'Buy 1 for 25% off'
      },
      {
        name: 'actionButtonText',
        label: 'Action button',
        type: 'text',
        value: 'Add to cart'
      },
      {
        name: 'cancelButtonText',
        label: 'Cancel button',
        type: 'text',
        value: 'No thanks'
      },
      {
        name: 'actionButtonBackgroundColor',
        label: 'Action button background',
        type: 'color',
        group: 'Buttons',
        value: '#800020'
      },
      {
        name: 'actionButtonTextColor',
        label: 'Action button text',
        type: 'color',
        group: 'Buttons',
        value: '#FFFFFF'
      },
      {
        name: 'cancelButtonTextColor',
        label: 'Cancel button text',
        type: 'color',
        group: 'Buttons',
        value: '#999999'
      },
      {
        name: 'priceTextColor',
        label: 'Price text',
        type: 'color',
        group: 'Text',
        value: '#800000'
      },
      {
        name: 'salePriceTextColor',
        label: 'Sale price text',
        type: 'color',
        group: 'Text',
        value: '#000000'
      },
      {
        name: 'popupBackgroundColor',
        label: 'Popup background',
        type: 'color',
        group: 'Popup',
        value: '#FFFFFF'
      },
      {
        name: 'maskBackgroundColor',
        label: 'Mask background',
        type: 'color',
        group: 'Popup',
        value: 'rgba(0, 0, 0, 0.5)',
        options: {
          allowAlpha: true
        }
      },
      {
        name: 'headingFont',
        label: 'Font',
        type: 'fontSize',
        group: 'Headings',
        value: "'Work Sans'"
      },
      {
        name: 'headingFontSize',
        label: 'Heading base size',
        type: 'fontSize',
        group: 'Body text',
        value: '20'
      },
      {
        name: 'bodyFont',
        label: 'Font',
        type: 'font',
        group: 'Body text',
        value: "'Work Sans'"
      },
      {
        name: 'bodyFontSize',
        label: 'Base size',
        type: 'fontSize',
        group: 'Body text',
        value: '16'
      }
    ],
    template: '',
    type: 'CROSS_SELL',
    name: 'Basic Cross-sell 1'
  };

  return { popupTheme };
};

export default usePopupTheme;
