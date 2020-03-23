export function createIFrame(url: string) {
  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    position: 'fixed',
    width: '100%',
    height: '100%',
    left: '0',
    top: '0',
    background: 'none transparent',
    border: 'none',
    display: 'none',
    'z-index': '100000',
  });
  iframe.setAttribute('src', url);
  document.getElementsByTagName('body')[0].appendChild(iframe);
  return iframe;
}
