export const getWindowCenterForPopUp = (width: number, height: number) => {
  const top = window.outerHeight / 2 + window.screenY - (height / 2);
  const left = window.outerWidth / 2 + window.screenX - (width / 2);
  return {top, left};
};
