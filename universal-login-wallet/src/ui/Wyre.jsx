import React, {Component} from 'react';
import WyreLogo from'../assets/wyre-logo.svg';
import TextBox from './Login/TextBox';


class Wyre extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	address: '0xB4DC65f8adE347d9D87D0d077F256aFC798c4dC6', 
    	wyreAccount: 'AK-JLWBQZXZ-UDHJ9LGM-H3ZZB9GR-M9WM4P3P',
      amount: 0.001
    };
    window.emitter = props.services.emitter;
  }

  componentDidMount () {
  	console.log(this.services);
  	window.addEventListener("message", this.receiveMessage, false);
    var address = this.state.address;
    var wyreAccount = this.state.wyreAccount;
    var amount = this.state.amount;

    const wyreScript = document.createElement("script");
    wyreScript.src = "https://verify.sendwyre.com/js/widget-loader.js";
    wyreScript.onload = function () {
		const wyreWidget = document.createElement("script");
	    wyreWidget.innerHTML = "var deviceToken=localStorage.getItem('DEVICE_TOKEN');if(!deviceToken){var array=new Uint8Array(25);window.crypto.getRandomValues(array);deviceToken=Array.prototype.map.call(array,x=>('00'+x.toString(16)).slice(-2)).join('');localStorage.setItem('DEVICE_TOKEN',deviceToken)}var widget=new Wyre.Widget({env:'test',accountId:'" + wyreAccount + "',auth:{type:'secretKey',secretKey:deviceToken},operation:{type:'debitcard',destCurrency:'DAI',dest:'ethereum:" + address + "',destAmount:" + amount + "}});document.getElementById('verifyButton').addEventListener('click',function(e){widget.open()});widget.on('close',function(e){window.postMessage('closed')});";
	    document.body.appendChild(wyreWidget);
	  }
    document.body.appendChild(wyreScript);
  }

  receiveMessage(event) {
  	if (event.data === 'closed') {
  		//console.log("GO TO DASHBOARD");
    	window.emitter.emit('setView', 'Dashboard');
  	}
	}

  render() {
    return (
      <div className="container">
	      <div className="login-view">
	      	<h1 className="main-title">Wyre Your Account</h1>
          <p className="login-view-text">
          	Load up your account with 10 DAI via debit card!
          </p>
	      	<div className="id-selector">
        		<div>
	    	  		<input id="verifyButton" display='block' border-radius='50px' type="image" outline='none' height='82.5' width='500px' src={WyreLogo}/>
    	  		</div>
	      	</div>
	      </div>
      </div>
    );
  }
}

export default Wyre;
