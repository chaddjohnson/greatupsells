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
      case 'PostPurchaseOffer1':
        themeModule = await import(
          '../../../../../../packages/themes-storefront/dist/PostPurchaseOffer1'
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
