export function isLocalStorageBlocked() {
  if (!('localStorage' in window)) {
    return true;
  }
  try {
    localStorage.setItem('localStorageTest', 'foo');
    localStorage.removeItem('localStorageTest');
    return false;
  } catch {
    return true;
  }
}
