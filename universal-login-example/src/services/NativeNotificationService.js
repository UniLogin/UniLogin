class NativeNotificationService {
  notify(alertMessage) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(alertMessage);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission((permission) => {
          if (permission === 'granted') {
            new Notification(alertMessage);
          }
        });
      }
    }
  }

  notifyLoginRequest(deviceInfo) {
    this.notify(`Login requested from ${deviceInfo.os} from ${deviceInfo.city}.`);
  }
}

export default NativeNotificationService;
