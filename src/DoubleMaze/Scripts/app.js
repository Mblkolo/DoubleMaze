"use strict";
var AreaController_ts_1 = require("./AreaController.ts");
var loc = window.location;
var uri = (loc.protocol === "https:") ? "wss:" : "ws:";
uri += "//" + loc.host + loc.pathname.split('/').slice(0, -1).join('/') + "/test";
var controller = new AreaController_ts_1.AreaController(sendMessage);
var socket;
function connect() {
    socket = new WebSocket(uri);
    socket.onopen = function (event) {
        console.log("opened connection to " + uri);
        controller.gotoArea("loading");
    };
    socket.onclose = function (event) {
        console.log("closed connection from " + uri);
        alert("Нет связи с сервером, обновлю страницу, может помочь");
        window.location.reload();
    };
    socket.onmessage = function (event) {
        //console.log(event.data);
        var res = JSON.parse(event.data);
        controller.process(res);
    };
    socket.onerror = function (event) {
        console.log("error: " + event.returnValue);
    };
}
connect();
function sendMessage(message) {
    console.log("Sending: " + message);
    socket.send(message);
}
//# sourceMappingURL=app.js.map