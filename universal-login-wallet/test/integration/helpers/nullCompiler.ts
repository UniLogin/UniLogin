const noop = () => 1;

require.extensions['.scss'] = noop;
require.extensions['.css'] = noop;
require.extensions['.svg'] = noop;
require.extensions['.png'] = noop;
require.extensions['.jpg'] = noop;
