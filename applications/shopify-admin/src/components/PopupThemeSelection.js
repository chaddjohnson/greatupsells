import PropTypes from 'prop-types';

const PopupThemeSelection = () => {
  return <p>List of templates</p>;
};

PopupThemeSelection.propTypes = {
  popupThemeTemplateId: PropTypes.string,
  onChange: PropTypes.func
};

PopupThemeSelection.defaultProps = {
  onChange: () => {}
};

export default PopupThemeSelection;
