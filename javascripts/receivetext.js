
(function () {
    for (var q = CryptoJS, x = q.lib.BlockCipher, r = q.algo, j = [], y = [], z = [], A = [], B = [], C = [], s = [], u = [], v = [], w = [], g = [], k = 0; 256 > k; k++)g[k] = 128 > k ? k << 1 : k << 1 ^ 283; for (var n = 0, l = 0, k = 0; 256 > k; k++) { var f = l ^ l << 1 ^ l << 2 ^ l << 3 ^ l << 4, f = f >>> 8 ^ f & 255 ^ 99; j[n] = f; y[f] = n; var t = g[n], D = g[t], E = g[D], b = 257 * g[f] ^ 16843008 * f; z[n] = b << 24 | b >>> 8; A[n] = b << 16 | b >>> 16; B[n] = b << 8 | b >>> 24; C[n] = b; b = 16843009 * E ^ 65537 * D ^ 257 * t ^ 16843008 * n; s[f] = b << 24 | b >>> 8; u[f] = b << 16 | b >>> 16; v[f] = b << 8 | b >>> 24; w[f] = b; n ? (n = t ^ g[g[g[E ^ t]]], l ^= g[g[l]]) : n = l = 1 } var F = [0, 1, 2, 4, 8,
        16, 32, 64, 128, 27, 54], r = r.AES = x.extend({
            _doReset: function () {
                for (var c = this._key, e = c.words, a = c.sigBytes / 4, c = 4 * ((this._nRounds = a + 6) + 1), b = this._keySchedule = [], h = 0; h < c; h++)if (h < a) b[h] = e[h]; else { var d = b[h - 1]; h % a ? 6 < a && 4 == h % a && (d = j[d >>> 24] << 24 | j[d >>> 16 & 255] << 16 | j[d >>> 8 & 255] << 8 | j[d & 255]) : (d = d << 8 | d >>> 24, d = j[d >>> 24] << 24 | j[d >>> 16 & 255] << 16 | j[d >>> 8 & 255] << 8 | j[d & 255], d ^= F[h / a | 0] << 24); b[h] = b[h - a] ^ d } e = this._invKeySchedule = []; for (a = 0; a < c; a++)h = c - a, d = a % 4 ? b[h] : b[h - 4], e[a] = 4 > a || 4 >= h ? d : s[j[d >>> 24]] ^ u[j[d >>> 16 & 255]] ^ v[j[d >>>
                    8 & 255]] ^ w[j[d & 255]]
            }, encryptBlock: function (c, e) { this._doCryptBlock(c, e, this._keySchedule, z, A, B, C, j) }, decryptBlock: function (c, e) { var a = c[e + 1]; c[e + 1] = c[e + 3]; c[e + 3] = a; this._doCryptBlock(c, e, this._invKeySchedule, s, u, v, w, y); a = c[e + 1]; c[e + 1] = c[e + 3]; c[e + 3] = a }, _doCryptBlock: function (c, e, a, b, h, d, j, m) {
                for (var n = this._nRounds, f = c[e] ^ a[0], g = c[e + 1] ^ a[1], k = c[e + 2] ^ a[2], p = c[e + 3] ^ a[3], l = 4, t = 1; t < n; t++)var q = b[f >>> 24] ^ h[g >>> 16 & 255] ^ d[k >>> 8 & 255] ^ j[p & 255] ^ a[l++], r = b[g >>> 24] ^ h[k >>> 16 & 255] ^ d[p >>> 8 & 255] ^ j[f & 255] ^ a[l++], s =
                    b[k >>> 24] ^ h[p >>> 16 & 255] ^ d[f >>> 8 & 255] ^ j[g & 255] ^ a[l++], p = b[p >>> 24] ^ h[f >>> 16 & 255] ^ d[g >>> 8 & 255] ^ j[k & 255] ^ a[l++], f = q, g = r, k = s; q = (m[f >>> 24] << 24 | m[g >>> 16 & 255] << 16 | m[k >>> 8 & 255] << 8 | m[p & 255]) ^ a[l++]; r = (m[g >>> 24] << 24 | m[k >>> 16 & 255] << 16 | m[p >>> 8 & 255] << 8 | m[f & 255]) ^ a[l++]; s = (m[k >>> 24] << 24 | m[p >>> 16 & 255] << 16 | m[f >>> 8 & 255] << 8 | m[g & 255]) ^ a[l++]; p = (m[p >>> 24] << 24 | m[f >>> 16 & 255] << 16 | m[g >>> 8 & 255] << 8 | m[k & 255]) ^ a[l++]; c[e] = q; c[e + 1] = r; c[e + 2] = s; c[e + 3] = p
            }, keySize: 8
        }); q.AES = x._createHelper(r)
})();


var TextReceiver = (function() {
    var receivers;

    function onReceive(recvPayload, recvObj) {
        recvObj.content = Quiet.mergeab(recvObj.content, recvPayload);
        var encryptedMessage = Quiet.ab2str(recvObj.content);
        var decryptedMessage = CryptoJS.AES.decrypt(encryptedMessage, "SuperSonic");
        var originalMessage = decryptedMessage.toString(CryptoJS.enc.Utf8);
        recvObj.target.textContent = originalMessage;
        recvObj.successes++;
        var total = recvObj.failures + recvObj.successes
        var ratio = recvObj.failures/total * 100;
        recvObj.warningbox.textContent = "You may need to move the transmitter closer to the receiver and set the volume to 50%. Packet Loss: " + recvObj.failures + "/" + total + " (" + ratio.toFixed(0) + "%)";
    };

    function onReceiverCreateFail(reason, recvObj) {
        console.log("failed to create quiet receiver: " + reason);
        recvObj.warningbox.classList.remove("hidden");
        recvObj.warningbox.textContent = "Sorry, it looks like this example is not supported by your browser. Please give permission to use the microphone or try again in Google Chrome or Microsoft Edge."
    };

    function onReceiveFail(num_fails, recvObj) {
        recvObj.warningbox.classList.remove("hidden");
        recvObj.failures = num_fails;
        var total = recvObj.failures + recvObj.successes
        var ratio = recvObj.failures/total * 100;
        recvObj.warningbox.textContent = "You may need to move the transmitter closer to the receiver and set the volume to 50%. Packet Loss: " + recvObj.failures + "/" + total + " (" + ratio.toFixed(0) + "%)";
    };

    function onClick(e, recvObj) {
        e.target.disabled = true;
        var originalText = e.target.innerText;
        e.target.innerText = e.target.getAttribute('data-quiet-receiving-text');
        e.target.setAttribute('data-quiet-receiving-text', originalText);

        var receiverOnReceive = function(payload) { onReceive(payload, recvObj); };
        var receiverOnReceiverCreateFail = function(reason) { onReceiverCreateFail(reason, recvObj); };
        var receiverOnReceiveFail = function(num_fails) { onReceiveFail(num_fails, recvObj); };
        Quiet.receiver({profile: recvObj.profilename,
            onReceive: receiverOnReceive,
            onCreateFail: receiverOnReceiverCreateFail,
            onReceiveFail: receiverOnReceiveFail
        });

        recvObj.target.classList.remove('hidden');
    }

    function setupReceiver(receiver) {
        var recvObj = {
            profilename: receiver.getAttribute('data-quiet-profile-name'),
            btn: receiver.querySelector('[data-quiet-receive-text-button]'),
            target: receiver.querySelector('[data-quiet-receive-text-target]'),
            warningbox: receiver.querySelector('[data-quiet-receive-text-warning]'),
            successes: 0,
            failures: 0,
            content: new ArrayBuffer(0)
        };
        var onBtnClick = function(e) { return onClick(e, recvObj); };
        recvObj.btn.addEventListener('click', onBtnClick, false);
    };

    function onQuietReady() {
        for (var i = 0; i < receivers.length; i++) {
            setupReceiver(receivers[i]);
        }
    };

    function onQuietFail(reason) {
        console.log("quiet failed to initialize: " + reason);
        var warningbox = document.querySelector('[data-quiet-receive-text-warning]');
        warningbox.classList.remove("hidden");
        warningbox.textContent = "Sorry, it looks like there was a problem with this example (" + reason + ")";
    };

    function onDOMLoad() {
        receivers = document.querySelectorAll('[data-quiet-receive-text]');
        Quiet.addReadyCallback(onQuietReady, onQuietFail);
    };

    document.addEventListener("DOMContentLoaded", onDOMLoad);
})();
