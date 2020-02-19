export function isPrivateMode(): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    const yes = () => resolve(true);
    const not = () => resolve(false);

    function detectChromeOpera(): boolean {
      const isChromeOpera = /(?=.*(opera|chrome)).*/i.test(navigator.userAgent) && navigator.storage?.estimate;
      if (isChromeOpera) {
        navigator.storage.estimate().then(({quota = 0}) => {
          quota < 120000000 ? yes() : not();
        });
      }
      return !!isChromeOpera;
    }

    function detectFirefox(): boolean {
      const isMozillaFirefox = 'MozAppearance' in document.documentElement.style;
      if (isMozillaFirefox) {
        if (indexedDB == null) yes();
        else {
          const db = indexedDB.open('inPrivate');
          db.onsuccess = not;
          db.onerror = yes;
        }
      }
      return isMozillaFirefox;
    }

    function detectSafari(): boolean {
      const isSafari = navigator.userAgent.match(/Version\/([0-9._]+).*Safari/);
      if (isSafari) {
        const testLocalStorage = () => {
          try {
            if (localStorage.length) not();
            else {
              localStorage.setItem('inPrivate', '0');
              localStorage.removeItem('inPrivate');
              not();
            }
          } catch (_) {
            navigator.cookieEnabled ? yes() : not();
          }
          return true;
        };

        const version = parseInt(isSafari[1], 10);
        if (version < 11) return testLocalStorage();
        try {
          (window as any).openDatabase(null, null, null, null);
          not();
        } catch (_) {
          yes();
        }
      }
      return !!isSafari;
    }

    function detectEdgeIE10(): boolean {
      const isEdgeIE10 = !window.indexedDB && (window.PointerEvent || window.MSPointerEvent);
      if (isEdgeIE10) yes();
      return !!isEdgeIE10;
    }

    if (detectChromeOpera()) return;
    if (detectFirefox()) return;
    if (detectSafari()) return;
    if (detectEdgeIE10()) return;

    return not();
  });
}
