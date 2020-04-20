export const getApplicationInfoFromDocument = () => {
  const applicationName = document.title;
  const logo = getFaviconUrl() || 'none';
  return {applicationName, logo, type: 'laptop'};
};

const removeLastChar = (value: string) => value.slice(0, -1);

const getFaviconUrl = () => {
  const favicon = getFavicon();
  const siteURL = removeLastChar(document.URL);
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
