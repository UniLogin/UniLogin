export class BrowserChecker {
  constructor(
    private readonly window: any,
  ) { }

  isLocalStorageBlocked() {
    try {
      if (!('localStorage' in this.window)) {
        return true;
      }
      if (this.window.localStorage === undefined) {
        return true;
      }
      this.window.localStorage.setItem('localStorageTest', 'foo');
      this.window.localStorage.removeItem('localStorageTest');
      return false;
    } catch {
      return true;
    }
  }

  isPrivateMode(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (this.detectChromeOpera(resolve)) return;
      if (this.detectFirefox(resolve)) return;
      if (this.detectSafari(resolve)) return;
      if (this.detectEdgeIE10(resolve)) return;

      return resolve(false);
    });
  }

  detectFirefox(resolve: (response: boolean) => void): boolean {
    const isMozillaFirefox = 'MozAppearance' in this.window.document.documentElement.style;
    if (isMozillaFirefox) {
      if (this.window.indexedDB == null) resolve(true);
      else {
        const db = this.window.indexedDB.open('inPrivate');
        db.onsuccess = () => resolve(false);
        db.onerror = () => resolve(true);
      }
    }
    return isMozillaFirefox;
  }

  detectChromeOpera(resolve: (response: boolean) => void): boolean {
    const isChromeOpera = /(?=.*(opera|chrome)).*/i.test(this.window.navigator.userAgent);
    if (isChromeOpera) {
      if (!this.window.navigator.storage?.estimate) {
        resolve(true);
      } else {
        this.window.navigator.storage.estimate().then(({quota}: { quota: any }) => {
          (quota ?? 0) < 120000000 ? resolve(true) : resolve(false);
        });
      }
    }
    return isChromeOpera;
  }

  detectSafari(resolve: (response: boolean) => void): boolean {
    const isSafari = this.window.navigator.userAgent.match(/Version\/([0-9._]+).*Safari/);
    if (isSafari) {
      const testLocalStorage = () => {
        try {
          if (this.window.localStorage.length) resolve(false);
          else {
            this.window.localStorage.setItem('inPrivate', '0');
            this.window.localStorage.removeItem('inPrivate');
            resolve(false);
          }
        } catch (_) {
          this.window.navigator.cookieEnabled ? resolve(true) : resolve(false);
        }
        return true;
      };

      const version = parseInt(isSafari[1], 10);
      if (version < 11) return testLocalStorage();
      try {
        (this.window.window as any).openDatabase(null, null, null, null);
        resolve(false);
      } catch (_) {
        resolve(true);
      }
    }
    return !!isSafari;
  }

  detectEdgeIE10(resolve: (response: boolean) => void): boolean {
    const isEdgeIE10 = !this.window.indexedDB && (this.window.PointerEvent || this.window.MSPointerEvent);
    if (isEdgeIE10) resolve(true);
    return !!isEdgeIE10;
  }
}
