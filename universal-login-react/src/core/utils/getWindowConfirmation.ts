export const getWindowConfirmation = (message: string, callback: (ok: boolean) => void) => {
  if (!window || !window.confirm || process.env.NODE_ENV === 'test') {
    callback(true);
    return;
  }
  try {
    const isConfirmed = window.confirm(message);
    callback(isConfirmed);
  } catch (e) {
    callback(true);
  }
};
