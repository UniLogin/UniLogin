import localforage from 'localforage';

const IDENTITY_KEY = 'universal-login-identity';
const DEVICES_KEY = 'universal-login-devices';

class StorageService {
  checkForIdentity() {
    return localforage.getItem(IDENTITY_KEY).then(function (value) {
      return value;
    }).catch(function() {
      return false;
    });
  }

  storeIdentity(identity) {
    return localforage.setItem(IDENTITY_KEY, identity).then(function () {
      return true;
    }).catch(function() {
      return false;
    });
  }

  getDevices() {
    return localforage.getItem(DEVICES_KEY).then(function (value) {
      return value;
    }).catch(function() {
      return false;
    });
  }

  async clearStorage() {
    localforage.clear();
  }

  async storeDevice(name, publicKey) {
    let devices = [];
    if (await this.getDevices()) { devices = await this.getDevices(); }
    var device = {name: name, publicKey: publicKey};
    devices.push(device);
    return localforage.setItem(DEVICES_KEY, devices).then(function () {
      return true;
    }).catch(function() {
      return false;
    });
  }

  async removeDevice(publicKey) {
    let devices = await this.getDevices();
    if (devices) {
      // If device removed is this device, clear identity
      if (devices[0].publicKey == publicKey) { 
        this.clearStorage();
        return true;
      }
      // Find device in storage json object and delete
      for (var i = 0; i < devices.length; i++) {
        if (devices[i].publicKey == publicKey){
          devices.splice(i, 1);
          break;
        }
      }
      // Push new json object to storage
      return localforage.setItem(DEVICES_KEY, devices).then(function () {
        return true;
      }).catch(function() {
        return false;
      });
    }
  }
}

export default StorageService;