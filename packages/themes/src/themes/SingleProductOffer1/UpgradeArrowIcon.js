import React from 'react';
import clsx from 'clsx';
import styled from '@greatupsells/styled-with-facepaint';

const UpgradeArrowIcon = styled(({ className }) => (
  <i className={clsx([className, 'material-icons', 'upgrade-arrow'])}>forward</i>
))({
  flex: 0,
  color: ({ theme }) => theme.upgradeArrowColor,
  fontSize: ['2rem', '3rem', '3rem', '3rem'],
  marginLeft: ['0.5rem', '1rem', '1rem', '1rem'],
  marginRight: ['0.5rem', '1rem', '1rem', '1rem'],
  marginTop: 0,
  marginBottom: 0,
  transform: ['rotate(90deg)', 'none', 'none', 'none']
});

export default UpgradeArrowIcon;
