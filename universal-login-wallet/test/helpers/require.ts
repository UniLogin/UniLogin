let Module = require('module');
let originalRequire = Module.prototype.require;

Module.prototype.require = function (){
  const name = arguments[0];
  if (name === 'react') {
    const React = originalRequire.apply(this, arguments);
    return { ...React, useEffect: React.useLayoutEffect };
  } else {
    return originalRequire.apply(this, arguments);
  }
};

