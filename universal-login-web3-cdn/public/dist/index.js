"use strict";
var ULRemoteProvider = /** @class */ (function () {
    function ULRemoteProvider() {
        this.listeners = {};
    }
    ULRemoteProvider.prototype.init = function () {
        var _this = this;
        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('src', 'http://localhost:8080');
        document.getElementsByTagName('body')[0].appendChild(this.iframe);
        window.addEventListener('message', function (event) {
            if (event.data.type !== 'ulRPC') {
                return;
            }
            var rpc = event.data.payload;
            if (typeof rpc.id !== 'number') {
                console.error('invalid JSON rpc', event.data);
                return;
            }
            console.log('<', rpc);
            if (_this.listeners[rpc.id] === undefined) {
                console.error('no listener registered for RPC', rpc);
                return;
            }
            _this.listeners[rpc.id](rpc);
        });
    };
    ULRemoteProvider.prototype.send = function (msg, cb) {
        this.listeners[msg.id] = function (resp) { return cb(null, resp); };
        console.log('>', msg);
        this.iframe.contentWindow.postMessage({ type: 'ulRPC', payload: msg }, '*');
    };
    return ULRemoteProvider;
}());
var provider = new ULRemoteProvider();
provider.init();
window.web3 = new Web3(provider);
//# sourceMappingURL=index.js.map