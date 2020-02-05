"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ULRemoteProvider = /** @class */ (function () {
    function ULRemoteProvider() {
    }
    ULRemoteProvider.prototype.init = function () {
        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('src', 'http://localhost:8080');
        document.getElementsByTagName('body')[0].appendChild(this.iframe);
    };
    ULRemoteProvider.prototype.send = function (msg, cb) {
        window.addEventListener('message', function (event) {
            console.log('<', event.data);
            cb(null, event.data);
        });
        console.log('>', msg);
        this.iframe.contentWindow.postMessage(msg, '*');
    };
    return ULRemoteProvider;
}());
var provider = new ULRemoteProvider();
provider.init();
window.web3 = new Web3(provider);
//# sourceMappingURL=index.js.map