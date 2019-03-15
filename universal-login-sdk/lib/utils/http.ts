const headers = {'Content-Type': 'application/json; charset=utf-8'};

let fetch: GlobalFetch['fetch'];

if (typeof window === 'undefined') {
  fetch = require('node-fetch');
} else {
  fetch = window.fetch;
}

export {headers, fetch};
