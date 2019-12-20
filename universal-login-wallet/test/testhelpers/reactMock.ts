const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function (...args: any[]) {
  const name = args[0];
  if (name === 'react') {
    const React = originalRequire.apply(this, args);
    return {...React, useEffect: React.useLayoutEffect};
  } else {
    return originalRequire.apply(this, args);
  }
};
