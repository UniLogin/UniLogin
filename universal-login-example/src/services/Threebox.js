import Box from '3box';

class ThreeBox {
  constructor(provider) {
    console.log(Box);
    this.provider = provider;
    this.enabled = false;
    this.box = null;
    this.addresses = [];
  }

  async enable() {
    this.addresses = await window.ethereum.enable();
    this.enabled = true;
  }

  async open() {
    this.box = await Box.openBox(this.addresses[0], window.ethereum);
  }
}

export default ThreeBox;
