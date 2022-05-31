import React, { useState, useContext, useEffect } from 'react';
import clsx from 'clsx';
import { useTheme } from 'styled-components';
import tinycolor from 'tinycolor2';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';

const AddButton = styled(
  ({
    className,
    type = 'button',
    loading = false,
    disabled = false,
    children,
    ...props
  }) => (
    <button
      className={clsx(className, loading && 'loading')}
      type={type}
      disabled={loading || disabled}
      {...props}
    >
      <span>{children}</span>
    </button>
  )
)({
  width: '100%',
  height: '39px',
  fontSize: '0.875rem',
  fontWeight: 600,
  letterSpacing: '1px',
  display: 'block',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  backgroundColor: ({ theme }) => theme.actionButtonBackgroundColor,
  color: ({ theme }) => theme.actionButtonTextColor,
  margin: '0.5rem auto',
  maxWidth: '400px',

  '&:disabled': {
    backgroundColor: ({ theme }) =>
      tinycolor(theme.popupBackgroundColor).isLight()
        ? tinycolor(theme.popupBackgroundColor).darken(10)
        : tinycolor(theme.popupBackgroundColor).lighten(10),
    cursor: 'default'
  },
  '&.loading': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textIndent: '-9999px'
  },
  '&.loading::after': {
    content: '""',
    height: '16px',
    width: '16px',
    color: 'rgba(140, 145, 150, 0.65)',
    position: 'relative',
    display: 'inline-block',
    border: '3px solid',
    borderRadius: '50%',
    borderTopColor: 'transparent',
    animation: 'rotate 1s linear infinite'
  },
  '@keyframes rotate': {
    '0%': {
      transform: 'rotate(0)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  }
});

const CancelButton = styled.button({
  fontSize: '0.8125rem',
  width: 'auto',
  display: 'block',
  background: 'none',
  border: 'none',
  padding: 0,
  margin: '1rem auto 0 auto',
  color: ({ theme }) => theme.cancelButtonTextColor,
  cursor: 'pointer'
});

const Actions = styled(({ className }) => {
  const [actionDone, setActionDone] = useState(false);

  const { actionButtonText, cancelButtonText } = useTheme();
  const {
    strategy,
    triggerProduct,
    addingProductEnabled,
    replacingProductEnabled,
    addingProduct,
    actionButtonUrl,
    handleAddProduct,
    handleReplaceProduct,
    handleClose
  } = useContext(StateContext);

  const handleAddButton = async () => {
    await handleAddProduct(0);
    setActionDone(true);
  };

  const handleReplaceButton = async () => {
    await handleReplaceProduct(triggerProduct.id, 0);
    setActionDone(true);
  };

  useEffect(() => {
    if (!actionDone) {
      return;
    }

    if (typeof actionButtonUrl === 'string') {
      window.location.href = actionButtonUrl;
    } else if (typeof actionButtonUrl === 'function') {
      actionButtonUrl();
    }
  }, [actionButtonUrl, actionDone]);

  return (
    <div className={className}>
      {strategy === 'CROSS_SELL' && (
        <AddButton
          type="submit"
          disabled={!addingProductEnabled[0]}
          loading={addingProduct[0]}
          onClick={handleAddButton}
        >
          {actionButtonText}
        </AddButton>
      )}
      {strategy === 'UPSELL' && (
        <AddButton
          type="button"
          disabled={!replacingProductEnabled[0]}
          loading={addingProduct[0]}
          onClick={handleReplaceButton}
        >
          {actionButtonText}
        </AddButton>
      )}
      <CancelButton onClick={handleClose}>{cancelButtonText}</CancelButton>
    </div>
  );
})({
  marginTop: '24px',
  maxWidth: '450px',
  margin: 'auto'
});

export default Actions;
