import url from 'url';
import {ApplicationInfo, EMPTY_LOGO} from '@unilogin/commons';

export const getApplicationInfoFromDocument = (): ApplicationInfo => {
  const applicationName = document.title;
  const logo = getFaviconUrl() || EMPTY_LOGO;
  return {applicationName, logo, type: 'laptop'};
};

const getFaviconUrl = () => {
  const favicon = getFavicon();
  const siteURL = document.URL;
  return favicon ? url.resolve(siteURL, favicon as any) : null;
};

const getFavicon = () => {
  let favicon;
  const nodeList = document.getElementsByTagName('link');
  for (let i = 0; i < nodeList.length; i++) {
    if ((nodeList[i].getAttribute('rel') === 'icon') || (nodeList[i].getAttribute('rel') === 'shortcut icon')) {
      favicon = nodeList[i].getAttribute('href');
    }
  }
  return favicon;
};
