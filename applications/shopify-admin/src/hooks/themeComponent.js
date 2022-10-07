import React, { useState, useCallback, useEffect } from 'react';

// Store theme components in a non-state, module-level variable because components
// cannot be stored in React state.
const themes = {};

const useThemeComponent = (key) => {
  const [themesLoaded, setThemesLoaded] = useState({});

  const importTheme = useCallback(async () => {
    if (!key) {
      return;
    }

    if (themes[key]) {
      return themes[key];
    }

    let themeModule;

    switch (key) {
      case 'MultiProductOffer1':
        themeModule = await import(
          '@greatupsells/themes-admin/MultiProductOffer1'
        );
        break;

      case 'MultiProductOffer2':
        themeModule = await import(
          '@greatupsells/themes-admin/MultiProductOffer2'
        );
        break;

      case 'MultiProductThankYouOffer1':
        themeModule = await import(
          '@greatupsells/themes-admin/MultiProductThankYouOffer1'
        );
        break;

      case 'SingleProductOffer1':
        themeModule = await import(
          '@greatupsells/themes-admin/SingleProductOffer1'
        );
        break;

      case 'PostPurchaseMultiProductOffer1':
        themeModule = await import(
          '@greatupsells/themes-admin/PostPurchaseMultiProductOffer1'
        );
        break;

      case 'PostPurchaseSingleProductOffer1':
        themeModule = await import(
          '@greatupsells/themes-admin/PostPurchaseSingleProductOffer1'
        );
        break;

      case 'SingleProductOffer2':
        themeModule = await import(
          '@greatupsells/themes-admin/SingleProductOffer2'
        );
        break;

      default:
        break;
    }

    if (themeModule) {
      themes[key] = themeModule?.default;

      // Flag the theme as loaded to trigger a re-render.
      setThemesLoaded({ ...themesLoaded, [key]: true });
    }
  }, [key, themesLoaded]);

  useEffect(() => {
    importTheme();
  }, [importTheme]);

  return themes[key];
};

export default useThemeComponent;
