export function isLocalStorageBlocked() {
  try {
    localStorage.setItem('localStorageTest', 'foo');
    localStorage.removeItem('localStorageTest');
    return true;
  } catch {
    return false;
  }
}
