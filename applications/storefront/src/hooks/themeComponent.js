import React, { useState, useCallback, useEffect } from 'react';

// eslint-disable-next-line
__webpack_public_path__ = `${process.env.ASSETS_URL}/themes/`;

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
          /* webpackChunkName: "MultiProductOffer1" */ '@greatupsells/themes-storefront/MultiProductOffer1'
        );
        break;

      case 'MultiProductOffer2':
        themeModule = await import(
          /* webpackChunkName: "MultiProductOffer2" */ '@greatupsells/themes-storefront/MultiProductOffer2'
        );
        break;

      case 'MultiProductThankYouOffer1':
        themeModule = await import(
          /* webpackChunkName: "MultiProductThankYouOffer1" */ '@greatupsells/themes-storefront/MultiProductThankYouOffer1'
        );
        break;

      case 'SingleProductOffer1':
        themeModule = await import(
          /* webpackChunkName: "SingleProductOffer1" */ '@greatupsells/themes-storefront/SingleProductOffer1'
        );
        break;

      case 'SingleProductOffer2':
        themeModule = await import(
          /* webpackChunkName: "SingleProductOffer2" */ '@greatupsells/themes-storefront/SingleProductOffer2'
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
