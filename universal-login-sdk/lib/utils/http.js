const headers = {'Content-Type': 'application/json; charset=utf-8'};

let fetchFunction;

// eslint-disable-next-line no-undef
if (typeof window === 'undefined') {
  fetchFunction = require('node-fetch');
} else {
  // eslint-disable-next-line no-undef
  fetchFunction = window.fetch;
}

const fetch = fetchFunction;

export {headers, fetch};
