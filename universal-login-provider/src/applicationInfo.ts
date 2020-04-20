export const getApplicationInfoFromDocument = () => {
  const applicationName = document.title;
  const logo = getFaviconUrl() || 'none';
  return {applicationName, logo, type: 'laptop'};
};

const getFaviconUrl = () => {
  const favicon = getFavicon();
  const siteURL = document.URL.slice(0, -1);
  return favicon ? (siteURL + favicon) : null;
};

const getFavicon = () => {
  const nodeList = document.getElementsByTagName('link');
  for (let i = 0; i < nodeList.length; i++) {
    if ((nodeList[i].getAttribute('rel') === 'icon') || (nodeList[i].getAttribute('rel') === 'shortcut icon')) {
      return nodeList[i].getAttribute('href');
    }
  }
};
