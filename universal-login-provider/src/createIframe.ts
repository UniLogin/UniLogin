export function createIFrame(url: string) {
  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    left: '0',
    top: '0',
    background: 'none transparent',
    border: 'none',
    display: 'none',
  });
  iframe.setAttribute('src', url);
  document.getElementsByTagName('body')[0].appendChild(iframe);
  return iframe;
}
