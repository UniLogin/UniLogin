export function isLocalStorageBlocked() {
  if (window.localStorage === undefined) {
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
