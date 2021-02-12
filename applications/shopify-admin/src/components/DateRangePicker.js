import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Button } from '@shopify/polaris';
import { CalendarMajor } from '@shopify/polaris-icons';

const DateRangePicker = ({ active, onActivate, onClose }) => (
  <Popover
    active={active}
    activator={
      <Button size="slim" disclosure icon={CalendarMajor} onClick={onActivate}>
        Last 90 days
      </Button>
    }
    onClose={onClose}
  >
    Date picker here
  </Popover>
);

DateRangePicker.propTypes = {
  active: PropTypes.bool,
  onActivate: PropTypes.func,
  onClose: PropTypes.func
};

DateRangePicker.defaultProps = {
  active: false,
  onActivate: () => {},
  onClose: () => {}
};

export default DateRangePicker;
