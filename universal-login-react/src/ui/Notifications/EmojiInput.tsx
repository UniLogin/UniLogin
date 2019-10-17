import {EmojiPlaceholders} from './EmojiPlaceholders';
import React from 'react';
import {EmojiKeyboard} from './EmojiKeyboard';
import {EmojiPanelWithFakes} from './EmojiPanelWithFakes';
import {SECURITY_CODE_LENGTH} from '@universal-login/commons';

export interface EmojiInputProps {
  value: number[];
  onChange: (value: number[]) => void;
  hint?: string;
  className?: string;
}

export const EmojiInput = ({value, onChange, hint, className}: EmojiInputProps) => {
  const onEmojiAdd = (code: number) => {
    if (value.length < SECURITY_CODE_LENGTH) {
      onChange([...value, code]);
    }
  };

  const onEmojiRemove = (index: number) => {
    if (value.length >= 0) {
      onChange(removeAtIndex(value, index));
    }
  };

  return (
    <>
      <EmojiPlaceholders
        enteredCode={value}
        onEmojiClick={onEmojiRemove}
        className={className}
      />
      {hint
        ? (
          <EmojiPanelWithFakes
            publicKey={hint}
            onEmojiClick={onEmojiAdd}
            className={className}
          />
        )
        : <EmojiKeyboard onEmojiClick={onEmojiAdd} className={className}/>
      }
    </>
  );
};

function removeAtIndex<T>(array: T[], index: number) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}
