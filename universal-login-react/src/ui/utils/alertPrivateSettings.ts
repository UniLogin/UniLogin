export function alertPrivateSettings(isPrivateMode = false, isLocalStorageBlocked = false) {
  const isPrivateModeWarning = isPrivateMode && 'Please do not use incognito mode. You can lose all your funds. ';
  const isLocalStorageBlockedWarning = isLocalStorageBlocked && 'Your browser is blocking access to the local storage. Please disable the protection and reload the page for UniLogin to work properly. ';

  if (isPrivateModeWarning || isLocalStorageBlockedWarning) {
    alert(`Warning! ${isPrivateModeWarning}${isLocalStorageBlockedWarning}`);
  }
}
