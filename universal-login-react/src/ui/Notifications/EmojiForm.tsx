import React, {useEffect, useState} from 'react';
import {
  filterNotificationByCodePrefix,
  isValidCode,
  Notification,
  SECURITY_CODE_LENGTH,
  ensureNotNull,
} from '@universal-login/commons';
import {EmojiPlaceholders} from './EmojiPlaceholders';
import {EmojiInput} from './EmojiInput';

export interface EmojiFormProps {
  hideTitle?: () => void;
  className?: string;
  notifications: Notification[];
  onDenyClick: () => void;
  setPublicKey: (arg: string) => void;
}

export const EmojiForm = ({hideTitle, className, notifications, onDenyClick, setPublicKey}: EmojiFormProps) => {
  const [enteredCode, setEnteredCode] = useState<number[]>([]);
  const [soleAddress, setSoleAddress] = useState<string | undefined>(undefined);

  useEffect(
    () => updateSoleAddress(filterNotificationByCodePrefix(notifications, enteredCode)),
    [notifications, enteredCode],
  );

  const isInputValid = enteredCode.length === SECURITY_CODE_LENGTH && soleAddress && isValidCode(enteredCode, soleAddress);

  useEffect(() => {
    if (isInputValid) {
      hideTitle && hideTitle();
      ensureNotNull(soleAddress, Error, 'No matching keys');
      setPublicKey(soleAddress!);
    }
  }, [isInputValid]);

  const updateSoleAddress = (addresses: string[]) => {
    if (addresses.length > 1) {
      setSoleAddress(undefined);
    } else if (addresses.length === 1) {
      setSoleAddress(addresses[0]);
    }
  };

  return (
    <div id="emojis">
      {isInputValid ? (
        <div className="correct-input">
          <p className="correct-input-title">Correct!</p>
          <EmojiPlaceholders
            enteredCode={enteredCode}
            className={className}
          />
        </div>
      ) : (
        <div className="approve-device-form">
          <EmojiInput
            value={enteredCode}
            onChange={setEnteredCode}
            publicKey={soleAddress}
            className={className}
          />
          <div className="emojis-form-reject-wrapper">
            <button
              className="emojis-form-reject"
              id="reject"
              onClick={onDenyClick}
            >
          Deny
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
