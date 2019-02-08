const headers = {'Content-Type': 'application/json; charset=utf-8'};

let fetchFunction;

if (typeof window === 'undefined') {
  fetchFunction = require('node-fetch');
} else {
  fetchFunction = window.fetch;
}

const fetch = fetchFunction;

export {headers, fetch};
