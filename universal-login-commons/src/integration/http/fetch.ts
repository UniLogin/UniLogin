let fetch: GlobalFetch['fetch'];

if (typeof window === 'undefined') {
  fetch = require('node-fetch');
} else if (typeof window.fetch === 'undefined') {
  fetch = require('node-fetch');
} else {
  fetch = window.fetch.bind(window);
}

export {fetch};
