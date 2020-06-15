import PropTypes from 'prop-types';
import { Stack } from '@shopify/polaris';
import ColorPicker from './ColorPicker';

const PopupThemeCustomization = ({ theme, onChange }) => (
  <Stack distribution="fillEvenly">
    <ColorPicker
      label="Message text color"
      value={theme.callToActionTextColor}
      onChange={(callToActionTextColor) =>
        onChange({ ...theme, callToActionTextColor })
      }
    />
    <ColorPicker
      label="Success message text color"
      value={theme.successMessageTextColor}
      onChange={(successMessageTextColor) =>
        onChange({ ...theme, successMessageTextColor })
      }
    />
    <ColorPicker
      label="Regular price text color"
      value={theme.priceTextColor}
      onChange={(priceTextColor) => onChange({ ...theme, priceTextColor })}
    />
    <ColorPicker
      label="Sale price text color"
      value={theme.salePriceTextColor}
      onChange={(salePriceTextColor) =>
        onChange({ ...theme, salePriceTextColor })
      }
    />
    <ColorPicker
      label="Add button background color"
      value={theme.actionButtonBackgroundColor}
      onChange={(actionButtonBackgroundColor) =>
        onChange({ ...theme, actionButtonBackgroundColor })
      }
    />
    <ColorPicker
      label="Add button text color"
      value={theme.actionButtonTextColor}
      onChange={(actionButtonTextColor) =>
        onChange({ ...theme, actionButtonTextColor })
      }
    />
    <ColorPicker
      label="Cancel button text color"
      value={theme.cancelButtonTextColor}
      onChange={(cancelButtonTextColor) =>
        onChange({ ...theme, cancelButtonTextColor })
      }
    />
    <ColorPicker
      label="Popup background color"
      value={theme.popupBackgroundColor}
      onChange={(popupBackgroundColor) =>
        onChange({ ...theme, popupBackgroundColor })
      }
    />
  </Stack>
);

PopupThemeCustomization.propTypes = {
  theme: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

PopupThemeCustomization.defaultProps = {
  onChange: () => {}
};

export default PopupThemeCustomization;
