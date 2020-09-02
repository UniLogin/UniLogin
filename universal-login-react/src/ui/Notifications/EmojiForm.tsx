import React, {useEffect, useState} from 'react';
import {
  filterNotificationByCodePrefix,
  isValidCode,
  Notification,
  ensureNotFalsy,
} from '@unilogin/commons';
import {EmojiPlaceholders} from './EmojiPlaceholders';
import {EmojiInput} from './EmojiInput';

export interface EmojiFormProps {
  hideHeader?: () => void;
  notifications: Notification[];
  onDenyClick: () => void;
  setPublicKey: (arg: string) => void;
}

export const EmojiForm = ({hideHeader, notifications, onDenyClick, setPublicKey}: EmojiFormProps) => {
  const [enteredCode, setEnteredCode] = useState<number[]>([]);
  const [soleAddress, setSoleAddress] = useState<string | undefined>(undefined);

  useEffect(
    () => updateSoleAddress(filterNotificationByCodePrefix(notifications, enteredCode)),
    [notifications, enteredCode],
  );

  const isInputValid = isValidCode(enteredCode, soleAddress);

  useEffect(() => {
    if (isInputValid) {
      hideHeader && hideHeader();
      ensureNotFalsy(soleAddress, Error, 'No matching keys');
      setPublicKey(soleAddress);
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
        <>
          <div className="correct-input">
            <p className="correct-input-title">Correct!</p>
            <EmojiPlaceholders
              enteredCode={enteredCode}
              publicKey={soleAddress}
            />
          </div>
          <p className="correct-input-confirmation-text">Confirm connecting new device</p>
        </>
      ) : (
        <div className="approve-device-form">
          <EmojiInput
            value={enteredCode}
            onChange={setEnteredCode}
            publicKey={soleAddress}
          />
          <div className="emoji-form-reject-wrapper">
            <button
              className="emoji-form-reject"
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
