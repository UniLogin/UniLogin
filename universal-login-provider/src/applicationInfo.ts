export const getApplicationInfoFromDocument = () => {
  const applicationName = document.title;
  const logo = getFaviconUrl() || 'none';
  const type = getType();
  return {applicationName, logo, type};
};

const removeLastChar = (value: string) => value.slice(0, -1);

const getSiteUrl = (url: string) => url.split('#')[0];

const getType = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width <= 512 || height <= 512) {
    return 'phone';
  } else if (width <= 1024) {
    return 'tablet';
  }
  return 'laptop';
};

const getFaviconUrl = () => {
  const favicon = getFavicon();
  if (!favicon) return null;
  const siteURL = getSiteUrl(document.URL);
  return (siteURL[siteURL.length - 1] === '/' && favicon[0] === '/')
    ? removeLastChar(siteURL) + favicon
    : siteURL + favicon;
};

const getFavicon = () => {
  const nodeList = document.getElementsByTagName('link');
  for (let i = 0; i < nodeList.length; i++) {
    if ((nodeList[i].getAttribute('rel') === 'icon') || (nodeList[i].getAttribute('rel') === 'shortcut icon')) {
      return nodeList[i].getAttribute('href');
    }
  }
};
