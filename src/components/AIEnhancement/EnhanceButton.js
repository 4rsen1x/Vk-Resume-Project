import React from 'react';
import { Button } from '@vkontakte/vkui';
import { Icon24Sparkle } from '@vkontakte/icons';
import PropTypes from 'prop-types';

export const EnhanceButton = ({ onClick, text = "ИИ" }) => {
  return (
    <Button
      mode="tertiary"
      before={<Icon24Sparkle />}
      onClick={onClick}
      size="s"
    >
      {text}
    </Button>
  );
};

EnhanceButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string
};