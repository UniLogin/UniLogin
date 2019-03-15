let fetch: GlobalFetch['fetch'];

if (typeof window === 'undefined') {
  fetch = require('node-fetch');
} else {
  fetch = window.fetch;
}

export {fetch};
