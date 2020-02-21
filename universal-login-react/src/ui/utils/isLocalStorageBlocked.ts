export function isLocalStorageBlocked() {
  try {
    localStorage.setItem('localStorageTest', 'foo');
    localStorage.removeItem('localStorageTest');
    return false;
  } catch {
    return true;
  }
}
