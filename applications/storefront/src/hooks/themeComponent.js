import React, { useState, useCallback, useEffect } from 'react';

// eslint-disable-next-line
__webpack_public_path__ = `${process.env.ASSETS_URL}/themes/`;

// Store theme components in a non-state, module-level variable because components
// cannot be stored in React state.
const themes = {};

const useThemeComponent = (key) => {
  const [themesLoaded, setThemesLoaded] = useState({});

  const importTheme = useCallback(async () => {
    if (!key || themesLoaded[key]) {
      return;
    }

    let themeModule;

    // Explicit, non-dynamic imports must be used so that webpack actually builds the files.
    // Hence this switch statement.
    switch (key) {
      case 'MultiProductOffer1':
        themeModule = await import(
          /* webpackChunkName: "MultiProductOffer1" */ '@greatupsells/themes/MultiProductOffer1'
        );
        break;

      case 'MultiProductOffer2':
        themeModule = await import(
          /* webpackChunkName: "MultiProductOffer2" */ '@greatupsells/themes/MultiProductOffer2'
        );
        break;

      case 'MultiProductThankYouOffer1':
        themeModule = await import(
          /* webpackChunkName: "MultiProductThankYouOffer1" */ '@greatupsells/themes/MultiProductThankYouOffer1'
        );
        break;

      case 'SingleProductOffer1':
        themeModule = await import(
          /* webpackChunkName: "SingleProductOffer1" */ '@greatupsells/themes/SingleProductOffer1'
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
