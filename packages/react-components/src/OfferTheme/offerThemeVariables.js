import React, { useMemo } from 'react';

const useOfferThemeVariables = (offer, theme) => {
  const mappedVariables = useMemo(
    () =>
      theme?.variables.reduce((map, { name, type, value, options = {} }) => {
        // Optionally filter by strategy.
        if (options.strategy && options.strategy !== offer.strategy) {
          return map;
        }

        // Cast "option" variables to boolean.
        if (type === 'OPTION') {
          value = value === 'true';
        }

        return {
          ...map,
          [name]: value
        };
      }, {}),
    [offer, theme]
  );

  // Hack :(
  mappedVariables.enableBundling = offer.enableBundling;

  return mappedVariables;
};

export default useOfferThemeVariables;
