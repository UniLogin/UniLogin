import React, {Component} from 'react';

class Dogs extends Component {
  constructor(props: any) {
    super(props);
  }

  async componentDidMount () {
    const wyreScript = document.createElement("script");
    wyreScript.src = "https://verify.sendwyre.com/js/widget-loader.js";
    wyreScript.onload = function () {
      const wyreWidget = document.createElement("script");
      wyreWidget.innerHTML = "var deviceToken=localStorage.getItem('DEVICE_TOKEN');if(!deviceToken){var array=new Uint8Array(25);window.crypto.getRandomValues(array);deviceToken=Array.prototype.map.call(array,x=>('00'+x.toString(16)).slice(-2)).join('');localStorage.setItem('DEVICE_TOKEN',deviceToken)}var widget=new Wyre.Widget({env:'test',accountId:'YOUR_WYRE_ACCOUNT_ID',auth:{type:'secretKey',secretKey:deviceToken},operation:{type:'onramp',destCurrency:'ETH',dest:'ethereum:0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413'}});document.getElementById('verifyButton').addEventListener('click',function(e){widget.open()});";
      document.body.appendChild(wyreWidget);
    }
    document.body.appendChild(wyreScript);
  }

  render() {
    return (
      <div>
        <button id="verifyButton">Verify with Wyre!</button>
      </div>
    );
  }
}

export default Dogs;
