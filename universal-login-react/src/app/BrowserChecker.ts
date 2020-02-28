export class BrowserChecker {
  isLocalStorageBlocked() {
    try {
      if (!('localStorage' in window)) {
        return true;
      }
      if (window.localStorage === undefined) {
        return true;
      }
      localStorage.setItem('localStorageTest', 'foo');
      localStorage.removeItem('localStorageTest');
      window.localStorage.setItem('localStorageTest', 'foo');
      window.localStorage.removeItem('localStorageTest');
      return false;
    } catch {
      return true;
    }
  }
}
