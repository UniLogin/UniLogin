import {EmojiPlaceholders} from './EmojiPlaceholders';
import React from 'react';
import {EmojiKeyboard} from './EmojiKeyboard';
import {EmojiPanelWithFakes} from './EmojiPanelWithFakes';
import {SECURITY_CODE_LENGTH} from '@unilogin/commons';

export interface EmojiInputProps {
  value: number[];
  onChange: (value: number[]) => void;
  publicKey?: string;
  className?: string;
}

export const EmojiInput = ({value, onChange, publicKey}: EmojiInputProps) => {
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
        publicKey={publicKey}
        onEmojiClick={onEmojiRemove}
      />
      {publicKey
        ? (
          <EmojiPanelWithFakes
            publicKey={publicKey}
            onEmojiClick={onEmojiAdd}
          />
        )
        : <EmojiKeyboard onEmojiClick={onEmojiAdd}/>
      }
    </>
  );
};

function removeAtIndex<T>(array: T[], index: number) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}
