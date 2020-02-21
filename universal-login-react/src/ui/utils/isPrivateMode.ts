export function isPrivateMode(): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    if (detectChromeOpera(resolve)) return;
    if (detectFirefox(resolve)) return;
    if (detectSafari(resolve)) return;
    if (detectEdgeIE10(resolve)) return;

    return resolve(false);
  });
}

function detectFirefox(resolve: (response: boolean) => void): boolean {
  const isMozillaFirefox = 'MozAppearance' in document.documentElement.style;
  if (isMozillaFirefox) {
    if (indexedDB == null) resolve(true);
    else {
      const db = indexedDB.open('inPrivate');
      db.onsuccess = () => resolve(false);
      db.onerror = () => resolve(true);
    }
  }
  return isMozillaFirefox;
}

function detectChromeOpera(resolve: (response: boolean) => void): boolean {
  const isChromeOpera = /(?=.*(opera|chrome)).*/i.test(navigator.userAgent) && navigator.storage?.estimate;
  if (isChromeOpera) {
    navigator.storage.estimate().then(({quota = 0}) => {
      quota < 120000000 ? resolve(true) : resolve(false);
    });
  }
  return !!isChromeOpera;
}

function detectSafari(resolve: (response: boolean) => void): boolean {
  const isSafari = navigator.userAgent.match(/Version\/([0-9._]+).*Safari/);
  if (isSafari) {
    const testLocalStorage = () => {
      try {
        if (localStorage.length) resolve(false);
        else {
          localStorage.setItem('inPrivate', '0');
          localStorage.removeItem('inPrivate');
          resolve(false);
        }
      } catch (_) {
        navigator.cookieEnabled ? resolve(true) : resolve(false);
      }
      return true;
    };

    const version = parseInt(isSafari[1], 10);
    if (version < 11) return testLocalStorage();
    try {
      (window as any).openDatabase(null, null, null, null);
      resolve(false);
    } catch (_) {
      resolve(true);
    }
  }
  return !!isSafari;
}

function detectEdgeIE10(resolve: (response: boolean) => void): boolean {
  const isEdgeIE10 = !window.indexedDB && (window.PointerEvent || window.MSPointerEvent);
  if (isEdgeIE10) resolve(true);
  return !!isEdgeIE10;
}
