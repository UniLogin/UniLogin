import React, {Component} from 'react';
import WyreLogo from'../assets/wyre-logo.svg';


class WyreComponent extends Component {
  constructor(props) {
    super(props);
    this.address = '0xB4DC65f8adE347d9D87D0d077F256aFC798c4dC6';
    this.wyreAccount = 'AK-JLWBQZXZ-UDHJ9LGM-H3ZZB9GR-M9WM4P3P';
  }

  async componentDidMount () {
    const wyreScript = document.createElement("script");
    wyreScript.src = "https://verify.sendwyre.com/js/widget-loader.js";
    wyreScript.onload = function () {
      const wyreWidget = document.createElement("script");
      wyreWidget.innerHTML = "var deviceToken=localStorage.getItem('DEVICE_TOKEN');if(!deviceToken){var array=new Uint8Array(25);window.crypto.getRandomValues(array);deviceToken=Array.prototype.map.call(array,x=>('00'+x.toString(16)).slice(-2)).join('');localStorage.setItem('DEVICE_TOKEN',deviceToken)}var widget=new Wyre.Widget({env:'test',accountId:'" + this.wyreAccount + "',auth:{type:'secretKey',secretKey:deviceToken},operation:{type:'onramp',destCurrency:'DAI',dest:'ethereum:" + this.address + "'}});document.getElementById('verifyButton').addEventListener('click',function(e){widget.open()});";
      document.body.appendChild(wyreWidget);
    }
    document.body.appendChild(wyreScript);
  }

  render() {
    return (
      <div>
    	<input id="verifyButton" border-radius='50px' type="image" outline='none' height='83.5px' width='250px' src={WyreLogo}/>
      </div>
    );
  }
}

export default WyreComponent;
