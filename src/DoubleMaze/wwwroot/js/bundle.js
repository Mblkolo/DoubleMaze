/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var key_code_ts_1 = __webpack_require__(2);
var AreaController = (function () {
    function AreaController(sendData) {
        this.areas = {};
        this.currentArea = null;
        this.areas["loading"] = new LoadingArea(sendData);
        this.areas["welcome"] = new WelcomeArea(sendData);
        this.areas["game"] = new GameArea(sendData);
    }
    AreaController.prototype.gotoArea = function (area) {
        if (this.currentArea != null) {
            this.currentArea.leave();
        }
        this.currentArea = this.areas[area];
        this.currentArea.enter();
    };
    AreaController.prototype.process = function (data) {
        if (data.command === "goto") {
            this.gotoArea(data.area);
            return;
        }
        if (this.currentArea != null) {
            this.currentArea.process(data);
        }
    };
    return AreaController;
}());
exports.AreaController = AreaController;
var LoadingArea = (function () {
    function LoadingArea(sendData) {
        this.sendData = sendData;
    }
    LoadingArea.prototype.enter = function () {
        this.sendData(JSON.stringify({ Type: "token", Token: localStorage.getItem("token") }));
    };
    LoadingArea.prototype.leave = function () {
    };
    LoadingArea.prototype.process = function (data) {
        if (data.command === "setToken") {
            localStorage.setItem("token", data.token);
        }
    };
    return LoadingArea;
}());
var WelcomeArea = (function () {
    function WelcomeArea(sendData) {
        this.sendData = sendData;
    }
    WelcomeArea.prototype.enter = function () {
        var _this = this;
        $("#main-content").html($("#welcome-area-tempalte").html());
        $(".welcome-play-button").on("click", function (arg) { return _this.onClick(arg); });
    };
    WelcomeArea.prototype.onClick = function (arg) {
        var name = $("welcome-player-name").val();
        this.sendData(JSON.stringify({ Type: "PlayerName", Name: name }));
    };
    WelcomeArea.prototype.leave = function () {
    };
    WelcomeArea.prototype.process = function (data) {
    };
    return WelcomeArea;
}());
var GameArea = (function () {
    function GameArea(sendData) {
        this.currentPos = { x: 0, y: 0 };
        this.serverPos = { x: 0, y: 0 };
        this.serverTime = 0;
        this.secondPlayerPos = { x: 0, y: 0 };
        this.sendData = sendData;
    }
    GameArea.prototype.enter = function () {
        var _this = this;
        $("#main-content").html($("#game-area-tempalte").html());
        $("#game-canvas").on("keydown", function (arg) { return _this.onKeyDown(arg); });
        $(".game-gameover-screen-button").on("click", function (arg) { return _this.onPlayAgain(arg); });
    };
    GameArea.prototype.leave = function () {
        this.state = null;
    };
    GameArea.prototype.onKeyDown = function (e) {
        if (e.keyCode === key_code_ts_1.KeyCode.DOWN_ARROW || e.keyCode === key_code_ts_1.KeyCode.KEY_S) {
            this.sendKey("Down", e);
        }
        if (e.keyCode === key_code_ts_1.KeyCode.UP_ARROW || e.keyCode === key_code_ts_1.KeyCode.KEY_W) {
            this.sendKey("Up", e);
        }
        if (e.keyCode === key_code_ts_1.KeyCode.LEFT_ARROW || e.keyCode === key_code_ts_1.KeyCode.KEY_A) {
            this.sendKey("Left", e);
        }
        if (e.keyCode === key_code_ts_1.KeyCode.RIGHT_ARROW || e.keyCode === key_code_ts_1.KeyCode.KEY_D) {
            this.sendKey("Right", e);
        }
    };
    GameArea.prototype.onPlayAgain = function (e) {
        e.preventDefault();
        this.sendData(JSON.stringify({ type: "playAgain" }));
    };
    GameArea.prototype.sendKey = function (key, e) {
        e.preventDefault();
        this.sendData(JSON.stringify({ type: "keyDown", Command: key }));
    };
    GameArea.prototype.process = function (data) {
        if (data.command === "waitOpponent") {
            this.state = "waitOpponent";
        }
        if (data.command === "mazeFeild") {
            this.state = "mazeFeild";
            this.mazeField = data.field;
            $(".game-canvas-my-name").text(data.myName);
            $(".game-canvas-enemy-name").text(data.enemyName);
            this.drawLoop();
        }
        if (data.command === "gameOver") {
            this.state = "gameOver";
            this.isWin = data.status === "win";
        }
        if (data.command === "playerState")
            this.moveTo(data.myPos, data.enemyPos);
        this.render();
    };
    GameArea.prototype.render = function () {
        $("#game-wait-screen").toggleClass("hidden", this.state !== "waitOpponent");
        $("#game-canvas-screen").toggleClass("hidden", this.state !== "mazeFeild");
        $("#game-gameover-screen").toggleClass("hidden", this.state !== "gameOver");
        if (this.state === "gameOver") {
            $("#game-gameover-screen .winner").toggleClass("hidden", this.isWin == false);
            $("#game-gameover-screen .looser").toggleClass("hidden", this.isWin);
        }
    };
    GameArea.prototype.moveTo = function (myPos, enemyPos) {
        this.secondPlayerPos = enemyPos;
        this.currentPos.x = this.serverPos.x;
        this.currentPos.y = this.serverPos.y;
        this.serverPos.x = myPos.x;
        this.serverPos.y = myPos.y;
        this.serverTime = Date.now();
    };
    GameArea.prototype.drawOn = function (t) {
        var scale = 20;
        var ctx = $("#game-canvas")[0].getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.setTransform(1, 0, 0, 1, 10.5, 10.5);
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        //ctx.strokeStyle = "#227F32";
        ctx.strokeStyle = "#333";
        for (var y = 0; y < this.mazeField.length; ++y) {
            for (var x = 0; x < this.mazeField[y].length; ++x) {
                var topLeft = { x: x * scale, y: y * scale };
                var topRight = { x: (x + 1) * scale, y: y * scale };
                var bottomRight = { x: (x + 1) * scale, y: (y + 1) * scale };
                var bottomLeft = { x: x * scale, y: (y + 1) * scale };
                if ((this.mazeField[y][x] & 1) !== 0) {
                    ctx.moveTo(topLeft.x, topLeft.y);
                    ctx.lineTo(topRight.x, topRight.y);
                }
                if ((this.mazeField[y][x] & 2) !== 0) {
                    ctx.moveTo(topRight.x, topRight.y);
                    ctx.lineTo(bottomRight.x, bottomRight.y);
                }
                if ((this.mazeField[y][x] & 4) !== 0) {
                    ctx.moveTo(bottomRight.x, bottomRight.y);
                    ctx.lineTo(bottomLeft.x, bottomLeft.y);
                }
                if ((this.mazeField[y][x] & 8) !== 0) {
                    ctx.moveTo(bottomLeft.x, bottomLeft.y);
                    ctx.lineTo(topLeft.x, topLeft.y);
                }
            }
        }
        ctx.stroke();
        var x = (this.currentPos.x * (1 - t) + this.serverPos.x * t) * scale;
        var y = (this.currentPos.y * (1 - t) + this.serverPos.y * t) * scale;
        var center = { x: x + scale / 2, y: y + scale / 2 };
        var delta = { x: this.serverPos.x - this.currentPos.x, y: this.serverPos.y - this.currentPos.y };
        ctx.beginPath();
        ctx.moveTo(center.x - delta.x * 25, center.y - delta.y * 25);
        ctx.lineTo(center.x + (delta.y === 0 ? 0 : 3), center.y + (delta.x === 0 ? 0 : 3));
        ctx.lineTo(center.x + (delta.y === 0 ? 0 : -3), center.y + (delta.x === 0 ? 0 : -3));
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(center.x, center.y, 4, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.fillRect(this.secondPlayerPos.x * scale + (scale - 5) / 2, this.secondPlayerPos.y * scale + (scale - 5) / 2, 5, 5);
    };
    GameArea.prototype.drawLoop = function () {
        var _this = this;
        if (this.state !== "mazeFeild") {
            return;
        }
        var now = Date.now();
        var t = (now - this.serverTime) / 100;
        this.drawOn(t);
        requestAnimationFrame(function () { return _this.drawLoop(); });
    };
    return GameArea;
}());


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AreaController_ts_1 = __webpack_require__(0);
var controller = new AreaController_ts_1.AreaController(sendMessage);
var uri = "ws://" + window.location.host + "/test";
var socket;
function connect() {
    socket = new WebSocket(uri);
    socket.onopen = function (event) {
        console.log("opened connection to " + uri);
        controller.gotoArea("loading");
    };
    socket.onclose = function (event) {
        console.log("closed connection from " + uri);
    };
    socket.onmessage = function (event) {
        //appendItem(list, event.data);
        console.log(event.data);
        var res = JSON.parse(event.data);
        controller.process(res);
        //console.log(res);
        //if (res.command == "getToken")
        //    localStorage.setItem("token", res.Token);
        //if (res.command === "playerState")
        //    moveTo(res.myPos, res.enemyPos);
        //else if (res.command === "mazeFeild")
        //    setField(res.field)
        //else if (res.command == "getToken")
        //    localStorage.setItem("token", res.Token)
        //else if (res.command == "gameOwer")
        //    inGame = false;
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["BACKSPACE"] = 8] = "BACKSPACE";
    KeyCode[KeyCode["TAB"] = 9] = "TAB";
    KeyCode[KeyCode["ENTER"] = 13] = "ENTER";
    KeyCode[KeyCode["SHIFT"] = 16] = "SHIFT";
    KeyCode[KeyCode["CTRL"] = 17] = "CTRL";
    KeyCode[KeyCode["ALT"] = 18] = "ALT";
    KeyCode[KeyCode["PAUSE"] = 19] = "PAUSE";
    KeyCode[KeyCode["CAPS_LOCK"] = 20] = "CAPS_LOCK";
    KeyCode[KeyCode["ESCAPE"] = 27] = "ESCAPE";
    KeyCode[KeyCode["SPACE"] = 32] = "SPACE";
    KeyCode[KeyCode["PAGE_UP"] = 33] = "PAGE_UP";
    KeyCode[KeyCode["PAGE_DOWN"] = 34] = "PAGE_DOWN";
    KeyCode[KeyCode["END"] = 35] = "END";
    KeyCode[KeyCode["HOME"] = 36] = "HOME";
    KeyCode[KeyCode["LEFT_ARROW"] = 37] = "LEFT_ARROW";
    KeyCode[KeyCode["UP_ARROW"] = 38] = "UP_ARROW";
    KeyCode[KeyCode["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
    KeyCode[KeyCode["DOWN_ARROW"] = 40] = "DOWN_ARROW";
    KeyCode[KeyCode["INSERT"] = 45] = "INSERT";
    KeyCode[KeyCode["DELETE"] = 46] = "DELETE";
    KeyCode[KeyCode["KEY_0"] = 48] = "KEY_0";
    KeyCode[KeyCode["KEY_1"] = 49] = "KEY_1";
    KeyCode[KeyCode["KEY_2"] = 50] = "KEY_2";
    KeyCode[KeyCode["KEY_3"] = 51] = "KEY_3";
    KeyCode[KeyCode["KEY_4"] = 52] = "KEY_4";
    KeyCode[KeyCode["KEY_5"] = 53] = "KEY_5";
    KeyCode[KeyCode["KEY_6"] = 54] = "KEY_6";
    KeyCode[KeyCode["KEY_7"] = 55] = "KEY_7";
    KeyCode[KeyCode["KEY_8"] = 56] = "KEY_8";
    KeyCode[KeyCode["KEY_9"] = 57] = "KEY_9";
    KeyCode[KeyCode["KEY_A"] = 65] = "KEY_A";
    KeyCode[KeyCode["KEY_B"] = 66] = "KEY_B";
    KeyCode[KeyCode["KEY_C"] = 67] = "KEY_C";
    KeyCode[KeyCode["KEY_D"] = 68] = "KEY_D";
    KeyCode[KeyCode["KEY_E"] = 69] = "KEY_E";
    KeyCode[KeyCode["KEY_F"] = 70] = "KEY_F";
    KeyCode[KeyCode["KEY_G"] = 71] = "KEY_G";
    KeyCode[KeyCode["KEY_H"] = 72] = "KEY_H";
    KeyCode[KeyCode["KEY_I"] = 73] = "KEY_I";
    KeyCode[KeyCode["KEY_J"] = 74] = "KEY_J";
    KeyCode[KeyCode["KEY_K"] = 75] = "KEY_K";
    KeyCode[KeyCode["KEY_L"] = 76] = "KEY_L";
    KeyCode[KeyCode["KEY_M"] = 77] = "KEY_M";
    KeyCode[KeyCode["KEY_N"] = 78] = "KEY_N";
    KeyCode[KeyCode["KEY_O"] = 79] = "KEY_O";
    KeyCode[KeyCode["KEY_P"] = 80] = "KEY_P";
    KeyCode[KeyCode["KEY_Q"] = 81] = "KEY_Q";
    KeyCode[KeyCode["KEY_R"] = 82] = "KEY_R";
    KeyCode[KeyCode["KEY_S"] = 83] = "KEY_S";
    KeyCode[KeyCode["KEY_T"] = 84] = "KEY_T";
    KeyCode[KeyCode["KEY_U"] = 85] = "KEY_U";
    KeyCode[KeyCode["KEY_V"] = 86] = "KEY_V";
    KeyCode[KeyCode["KEY_W"] = 87] = "KEY_W";
    KeyCode[KeyCode["KEY_X"] = 88] = "KEY_X";
    KeyCode[KeyCode["KEY_Y"] = 89] = "KEY_Y";
    KeyCode[KeyCode["KEY_Z"] = 90] = "KEY_Z";
    KeyCode[KeyCode["LEFT_META"] = 91] = "LEFT_META";
    KeyCode[KeyCode["RIGHT_META"] = 92] = "RIGHT_META";
    KeyCode[KeyCode["SELECT"] = 93] = "SELECT";
    KeyCode[KeyCode["NUMPAD_0"] = 96] = "NUMPAD_0";
    KeyCode[KeyCode["NUMPAD_1"] = 97] = "NUMPAD_1";
    KeyCode[KeyCode["NUMPAD_2"] = 98] = "NUMPAD_2";
    KeyCode[KeyCode["NUMPAD_3"] = 99] = "NUMPAD_3";
    KeyCode[KeyCode["NUMPAD_4"] = 100] = "NUMPAD_4";
    KeyCode[KeyCode["NUMPAD_5"] = 101] = "NUMPAD_5";
    KeyCode[KeyCode["NUMPAD_6"] = 102] = "NUMPAD_6";
    KeyCode[KeyCode["NUMPAD_7"] = 103] = "NUMPAD_7";
    KeyCode[KeyCode["NUMPAD_8"] = 104] = "NUMPAD_8";
    KeyCode[KeyCode["NUMPAD_9"] = 105] = "NUMPAD_9";
    KeyCode[KeyCode["MULTIPLY"] = 106] = "MULTIPLY";
    KeyCode[KeyCode["ADD"] = 107] = "ADD";
    KeyCode[KeyCode["SUBTRACT"] = 109] = "SUBTRACT";
    KeyCode[KeyCode["DECIMAL"] = 110] = "DECIMAL";
    KeyCode[KeyCode["DIVIDE"] = 111] = "DIVIDE";
    KeyCode[KeyCode["F1"] = 112] = "F1";
    KeyCode[KeyCode["F2"] = 113] = "F2";
    KeyCode[KeyCode["F3"] = 114] = "F3";
    KeyCode[KeyCode["F4"] = 115] = "F4";
    KeyCode[KeyCode["F5"] = 116] = "F5";
    KeyCode[KeyCode["F6"] = 117] = "F6";
    KeyCode[KeyCode["F7"] = 118] = "F7";
    KeyCode[KeyCode["F8"] = 119] = "F8";
    KeyCode[KeyCode["F9"] = 120] = "F9";
    KeyCode[KeyCode["F10"] = 121] = "F10";
    KeyCode[KeyCode["F11"] = 122] = "F11";
    KeyCode[KeyCode["F12"] = 123] = "F12";
    KeyCode[KeyCode["NUM_LOCK"] = 144] = "NUM_LOCK";
    KeyCode[KeyCode["SCROLL_LOCK"] = 145] = "SCROLL_LOCK";
    KeyCode[KeyCode["SEMICOLON"] = 186] = "SEMICOLON";
    KeyCode[KeyCode["EQUALS"] = 187] = "EQUALS";
    KeyCode[KeyCode["COMMA"] = 188] = "COMMA";
    KeyCode[KeyCode["DASH"] = 189] = "DASH";
    KeyCode[KeyCode["PERIOD"] = 190] = "PERIOD";
    KeyCode[KeyCode["FORWARD_SLASH"] = 191] = "FORWARD_SLASH";
    KeyCode[KeyCode["GRAVE_ACCENT"] = 192] = "GRAVE_ACCENT";
    KeyCode[KeyCode["OPEN_BRACKET"] = 219] = "OPEN_BRACKET";
    KeyCode[KeyCode["BACK_SLASH"] = 220] = "BACK_SLASH";
    KeyCode[KeyCode["CLOSE_BRACKET"] = 221] = "CLOSE_BRACKET";
    KeyCode[KeyCode["SINGLE_QUOTE"] = 222] = "SINGLE_QUOTE";
})(KeyCode = exports.KeyCode || (exports.KeyCode = {}));
;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDY1OTljMDE4ODk5MTcxZWEzY2EiLCJ3ZWJwYWNrOi8vLy4vU2NyaXB0cy9BcmVhQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly8vLi9TY3JpcHRzL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9TY3JpcHRzL2tleV9jb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQy9EQSwyQ0FBc0M7QUFFdEM7SUFJSSx3QkFBbUIsUUFBNkI7UUFIeEMsVUFBSyxHQUE0QixFQUFFLENBQUM7UUFDcEMsZ0JBQVcsR0FBVSxJQUFJLENBQUM7UUFHOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLGlDQUFRLEdBQWYsVUFBZ0IsSUFBWTtRQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixDQUFDO1FBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVNLGdDQUFPLEdBQWQsVUFBZSxJQUFTO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUM7SUFDTCxDQUFDO0lBQ0wscUJBQUM7QUFBRCxDQUFDO0FBN0JZLHdDQUFjO0FBK0IzQjtJQUdJLHFCQUFtQixRQUE2QjtRQUM1QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUM3QixDQUFDO0lBRU0sMkJBQUssR0FBWjtRQUNJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUVNLDJCQUFLLEdBQVo7SUFDQSxDQUFDO0lBRU0sNkJBQU8sR0FBZCxVQUFlLElBQVM7UUFDcEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzlCLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxDQUFDO0lBQ0wsQ0FBQztJQUVMLGtCQUFDO0FBQUQsQ0FBQztBQUVEO0lBR0kscUJBQW1CLFFBQTZCO1FBQzVDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFTSwyQkFBSyxHQUFaO1FBQUEsaUJBR0M7UUFGRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLEdBQXNCLElBQUssWUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFTSw2QkFBTyxHQUFkLFVBQWUsR0FBc0I7UUFDakMsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFTSwyQkFBSyxHQUFaO0lBQ0EsQ0FBQztJQUVNLDZCQUFPLEdBQWQsVUFBZSxJQUFTO0lBRXhCLENBQUM7SUFFTCxrQkFBQztBQUFELENBQUM7QUFFRDtJQUdJLGtCQUFtQixRQUE2QjtRQTJFeEMsZUFBVSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDNUIsY0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDM0IsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUNmLG9CQUFlLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQTdFckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUVNLHdCQUFLLEdBQVo7UUFBQSxpQkFJQztRQUhHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFDLEdBQXNCLElBQUssWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDO1FBQ2pGLENBQUMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQyxHQUFzQixJQUFLLFlBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQXJCLENBQXFCLENBQUMsQ0FBQztJQUNyRyxDQUFDO0lBRU0sd0JBQUssR0FBWjtRQUNJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7SUFFTyw0QkFBUyxHQUFqQixVQUFrQixDQUFvQjtRQUNsQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLHFCQUFPLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUsscUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLHFCQUFPLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUsscUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLHFCQUFPLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUsscUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLHFCQUFPLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUsscUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdCLENBQUM7SUFDTCxDQUFDO0lBRU8sOEJBQVcsR0FBbkIsVUFBb0IsQ0FBb0I7UUFDcEMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELDBCQUFPLEdBQVAsVUFBUSxHQUFXLEVBQUUsQ0FBQztRQUNsQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFTSwwQkFBTyxHQUFkLFVBQWUsSUFBUztRQUNwQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUM7UUFDaEMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDNUIsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwQixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUM7UUFDdkMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssYUFBYSxDQUFDO1lBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFM0MsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFNTyx5QkFBTSxHQUFkO1FBQ0ksQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxLQUFLLGNBQWMsQ0FBQyxDQUFDO1FBQzVFLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDLENBQUM7UUFDNUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQztZQUM5RSxDQUFDLENBQUMsK0JBQStCLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6RSxDQUFDO0lBQ0wsQ0FBQztJQU9PLHlCQUFNLEdBQWQsVUFBZSxLQUFLLEVBQUUsUUFBUTtRQUMxQixJQUFJLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQztRQUVoQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUVyQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVPLHlCQUFNLEdBQWQsVUFBZSxDQUFDO1FBQ1osSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWpCLElBQUksR0FBRyxHQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQXVCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV6RCxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLEdBQUcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3RCLDhCQUE4QjtRQUM5QixHQUFHLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUN6QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDN0MsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUVoRCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUM7Z0JBQzdDLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDO2dCQUNwRCxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDO2dCQUM3RCxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQztnQkFFdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUNELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUdiLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBRXJFLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3RELElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ25HLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzdELEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckYsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVYLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0MsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUdYLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxD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QjtJQUNuQix1REFBa0I7QUFDdEIsQ0FBQyxFQXBHVyxPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUFvR2xCO0FBQUEsQ0FBQyIsImZpbGUiOiIuL3d3d3Jvb3QvanMvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0NjU5OWMwMTg4OTkxNzFlYTNjYSIsImltcG9ydCB7SUFyZWF9IGZyb20gXCIuL0lBcmVhLnRzXCI7XHJcbmltcG9ydCB7S2V5Q29kZX0gZnJvbSBcIi4va2V5X2NvZGUudHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBcmVhQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIGFyZWFzOiB7IFtpZDogc3RyaW5nXTogSUFyZWEgfSA9IHt9O1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50QXJlYTogSUFyZWEgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuYXJlYXNbXCJsb2FkaW5nXCJdID0gbmV3IExvYWRpbmdBcmVhKHNlbmREYXRhKTtcclxuICAgICAgICB0aGlzLmFyZWFzW1wid2VsY29tZVwiXSA9IG5ldyBXZWxjb21lQXJlYShzZW5kRGF0YSk7XHJcbiAgICAgICAgdGhpcy5hcmVhc1tcImdhbWVcIl0gPSBuZXcgR2FtZUFyZWEoc2VuZERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnb3RvQXJlYShhcmVhOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50QXJlYSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFyZWEubGVhdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudEFyZWEgPSB0aGlzLmFyZWFzW2FyZWFdO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEFyZWEuZW50ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJvY2VzcyhkYXRhOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZGF0YS5jb21tYW5kID09PSBcImdvdG9cIikge1xyXG4gICAgICAgICAgICB0aGlzLmdvdG9BcmVhKGRhdGEuYXJlYSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRBcmVhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QXJlYS5wcm9jZXNzKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTG9hZGluZ0FyZWEgaW1wbGVtZW50cyBJQXJlYSB7XHJcbiAgICBwcml2YXRlIHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEgPSBzZW5kRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW50ZXIoKSB7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YShKU09OLnN0cmluZ2lmeSh7IFR5cGU6IFwidG9rZW5cIiwgVG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIikgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsZWF2ZSgpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJvY2VzcyhkYXRhOiBhbnkpIHtcclxuICAgICAgICBpZiAoZGF0YS5jb21tYW5kID09PSBcInNldFRva2VuXCIpIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlblwiLCBkYXRhLnRva2VuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jbGFzcyBXZWxjb21lQXJlYSBpbXBsZW1lbnRzIElBcmVhIHtcclxuICAgIHByaXZhdGUgc2VuZERhdGE6IChkYXRhOiBhbnkpID0+IHZvaWQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YSA9IHNlbmREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnRlcigpIHtcclxuICAgICAgICAkKFwiI21haW4tY29udGVudFwiKS5odG1sKCQoXCIjd2VsY29tZS1hcmVhLXRlbXBhbHRlXCIpLmh0bWwoKSk7XHJcbiAgICAgICAgJChcIi53ZWxjb21lLXBsYXktYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKGFyZzogSlF1ZXJ5RXZlbnRPYmplY3QpID0+IHRoaXMub25DbGljayhhcmcpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25DbGljayhhcmc6IEpRdWVyeUV2ZW50T2JqZWN0KSB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9ICQoXCJ3ZWxjb21lLXBsYXllci1uYW1lXCIpLnZhbCgpO1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEoSlNPTi5zdHJpbmdpZnkoeyBUeXBlOiBcIlBsYXllck5hbWVcIiwgTmFtZTogbmFtZSB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxlYXZlKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcm9jZXNzKGRhdGE6IGFueSkge1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNsYXNzIEdhbWVBcmVhIGltcGxlbWVudHMgSUFyZWEge1xyXG4gICAgcHJpdmF0ZSBzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3Ioc2VuZERhdGE6IChkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLnNlbmREYXRhID0gc2VuZERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudGVyKCkge1xyXG4gICAgICAgICQoXCIjbWFpbi1jb250ZW50XCIpLmh0bWwoJChcIiNnYW1lLWFyZWEtdGVtcGFsdGVcIikuaHRtbCgpKTtcclxuICAgICAgICAkKFwiI2dhbWUtY2FudmFzXCIpLm9uKFwia2V5ZG93blwiLCAoYXJnOiBKUXVlcnlFdmVudE9iamVjdCkgPT4gdGhpcy5vbktleURvd24oYXJnKSk7XHJcbiAgICAgICAgJChcIi5nYW1lLWdhbWVvdmVyLXNjcmVlbi1idXR0b25cIikub24oXCJjbGlja1wiLCAoYXJnOiBKUXVlcnlFdmVudE9iamVjdCkgPT4gdGhpcy5vblBsYXlBZ2FpbihhcmcpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGVhdmUoKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbktleURvd24oZTogSlF1ZXJ5RXZlbnRPYmplY3QpIHtcclxuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBLZXlDb2RlLkRPV05fQVJST1cgfHwgZS5rZXlDb2RlID09PSBLZXlDb2RlLktFWV9TKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZEtleShcIkRvd25cIiwgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IEtleUNvZGUuVVBfQVJST1cgfHwgZS5rZXlDb2RlID09PSBLZXlDb2RlLktFWV9XKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZEtleShcIlVwXCIsIGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBLZXlDb2RlLkxFRlRfQVJST1cgfHwgZS5rZXlDb2RlID09PSBLZXlDb2RlLktFWV9BKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZEtleShcIkxlZnRcIiwgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IEtleUNvZGUuUklHSFRfQVJST1cgfHwgZS5rZXlDb2RlID09PSBLZXlDb2RlLktFWV9EKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZEtleShcIlJpZ2h0XCIsIGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uUGxheUFnYWluKGU6IEpRdWVyeUV2ZW50T2JqZWN0KSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEoSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiBcInBsYXlBZ2FpblwiIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBzZW5kS2V5KGtleTogc3RyaW5nLCBlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEoSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiBcImtleURvd25cIiwgQ29tbWFuZDoga2V5IH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJvY2VzcyhkYXRhOiBhbnkpIHtcclxuICAgICAgICBpZiAoZGF0YS5jb21tYW5kID09PSBcIndhaXRPcHBvbmVudFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBcIndhaXRPcHBvbmVudFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGF0YS5jb21tYW5kID09PSBcIm1hemVGZWlsZFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBcIm1hemVGZWlsZFwiO1xyXG4gICAgICAgICAgICB0aGlzLm1hemVGaWVsZCA9IGRhdGEuZmllbGQ7XHJcbiAgICAgICAgICAgICQoXCIuZ2FtZS1jYW52YXMtbXktbmFtZVwiKS50ZXh0KGRhdGEubXlOYW1lKTtcclxuICAgICAgICAgICAgJChcIi5nYW1lLWNhbnZhcy1lbmVteS1uYW1lXCIpLnRleHQoZGF0YS5lbmVteU5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdMb29wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkYXRhLmNvbW1hbmQgPT09IFwiZ2FtZU92ZXJcIikge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gXCJnYW1lT3ZlclwiO1xyXG4gICAgICAgICAgICB0aGlzLmlzV2luID0gZGF0YS5zdGF0dXMgPT09IFwid2luXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0YS5jb21tYW5kID09PSBcInBsYXllclN0YXRlXCIpXHJcbiAgICAgICAgICAgIHRoaXMubW92ZVRvKGRhdGEubXlQb3MsIGRhdGEuZW5lbXlQb3MpO1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGU6IHN0cmluZztcclxuICAgIHByaXZhdGUgbWF6ZUZpZWxkOiBhbnk7XHJcbiAgICBwcml2YXRlIGlzV2luOiBib29sZWFuO1xyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyKCkge1xyXG4gICAgICAgICQoXCIjZ2FtZS13YWl0LXNjcmVlblwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCB0aGlzLnN0YXRlICE9PSBcIndhaXRPcHBvbmVudFwiKTtcclxuICAgICAgICAkKFwiI2dhbWUtY2FudmFzLXNjcmVlblwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCB0aGlzLnN0YXRlICE9PSBcIm1hemVGZWlsZFwiKTtcclxuICAgICAgICAkKFwiI2dhbWUtZ2FtZW92ZXItc2NyZWVuXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZGVuXCIsIHRoaXMuc3RhdGUgIT09IFwiZ2FtZU92ZXJcIik7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IFwiZ2FtZU92ZXJcIikge1xyXG4gICAgICAgICAgICAkKFwiI2dhbWUtZ2FtZW92ZXItc2NyZWVuIC53aW5uZXJcIikudG9nZ2xlQ2xhc3MoXCJoaWRkZW5cIiwgdGhpcy5pc1dpbiA9PSBmYWxzZSk7XHJcbiAgICAgICAgICAgICQoXCIjZ2FtZS1nYW1lb3Zlci1zY3JlZW4gLmxvb3NlclwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCB0aGlzLmlzV2luKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50UG9zID0geyB4OiAwLCB5OiAwIH07XHJcbiAgICBwcml2YXRlIHNlcnZlclBvcyA9IHsgeDogMCwgeTogMCB9O1xyXG4gICAgcHJpdmF0ZSBzZXJ2ZXJUaW1lID0gMDtcclxuICAgIHByaXZhdGUgc2Vjb25kUGxheWVyUG9zID0geyB4OiAwLCB5OiAwIH07XHJcblxyXG4gICAgcHJpdmF0ZSBtb3ZlVG8obXlQb3MsIGVuZW15UG9zKSB7XHJcbiAgICAgICAgdGhpcy5zZWNvbmRQbGF5ZXJQb3MgPSBlbmVteVBvcztcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50UG9zLnggPSB0aGlzLnNlcnZlclBvcy54O1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBvcy55ID0gdGhpcy5zZXJ2ZXJQb3MueTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXJ2ZXJQb3MueCA9IG15UG9zLng7XHJcbiAgICAgICAgdGhpcy5zZXJ2ZXJQb3MueSA9IG15UG9zLnk7XHJcblxyXG4gICAgICAgIHRoaXMuc2VydmVyVGltZSA9IERhdGUubm93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3T24odCkge1xyXG4gICAgICAgIGNvbnN0IHNjYWxlID0gMjA7XHJcblxyXG4gICAgICAgIHZhciBjdHggPSAoJChcIiNnYW1lLWNhbnZhc1wiKVswXSBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjdHguY2FudmFzLndpZHRoLCBjdHguY2FudmFzLmhlaWdodCk7XHJcblxyXG4gICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMTAuNSwgMTAuNSk7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xyXG4gICAgICAgIGN0eC5saW5lQ2FwID0gXCJyb3VuZFwiO1xyXG4gICAgICAgIC8vY3R4LnN0cm9rZVN0eWxlID0gXCIjMjI3RjMyXCI7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCIjMzMzXCI7XHJcbiAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLm1hemVGaWVsZC5sZW5ndGg7ICsreSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMubWF6ZUZpZWxkW3ldLmxlbmd0aDsgKyt4KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRvcExlZnQgPSB7IHg6IHggKiBzY2FsZSwgeTogeSAqIHNjYWxlIH07XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9wUmlnaHQgPSB7IHg6ICh4ICsgMSkgKiBzY2FsZSwgeTogeSAqIHNjYWxlIH07XHJcbiAgICAgICAgICAgICAgICB2YXIgYm90dG9tUmlnaHQgPSB7IHg6ICh4ICsgMSkgKiBzY2FsZSwgeTogKHkgKyAxKSAqIHNjYWxlIH07XHJcbiAgICAgICAgICAgICAgICB2YXIgYm90dG9tTGVmdCA9IHsgeDogeCAqIHNjYWxlLCB5OiAoeSArIDEpICogc2NhbGUgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKHRoaXMubWF6ZUZpZWxkW3ldW3hdICYgMSkgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHRvcExlZnQueCwgdG9wTGVmdC55KTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHRvcFJpZ2h0LngsIHRvcFJpZ2h0LnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgodGhpcy5tYXplRmllbGRbeV1beF0gJiAyKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8odG9wUmlnaHQueCwgdG9wUmlnaHQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhib3R0b21SaWdodC54LCBib3R0b21SaWdodC55KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKHRoaXMubWF6ZUZpZWxkW3ldW3hdICYgNCkgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKGJvdHRvbVJpZ2h0LngsIGJvdHRvbVJpZ2h0LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYm90dG9tTGVmdC54LCBib3R0b21MZWZ0LnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgodGhpcy5tYXplRmllbGRbeV1beF0gJiA4KSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oYm90dG9tTGVmdC54LCBib3R0b21MZWZ0LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8odG9wTGVmdC54LCB0b3BMZWZ0LnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgdmFyIHggPSAodGhpcy5jdXJyZW50UG9zLnggKiAoMSAtIHQpICsgdGhpcy5zZXJ2ZXJQb3MueCAqIHQpICogc2NhbGU7XHJcbiAgICAgICAgdmFyIHkgPSAodGhpcy5jdXJyZW50UG9zLnkgKiAoMSAtIHQpICsgdGhpcy5zZXJ2ZXJQb3MueSAqIHQpICogc2NhbGU7XHJcblxyXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IHsgeDogeCArIHNjYWxlIC8gMiwgeTogeSArIHNjYWxlIC8gMiB9O1xyXG4gICAgICAgIGNvbnN0IGRlbHRhID0geyB4OiB0aGlzLnNlcnZlclBvcy54IC0gdGhpcy5jdXJyZW50UG9zLngsIHk6IHRoaXMuc2VydmVyUG9zLnkgLSB0aGlzLmN1cnJlbnRQb3MueSB9O1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGNlbnRlci54IC0gZGVsdGEueCAqIDI1LCBjZW50ZXIueSAtIGRlbHRhLnkgKiAyNSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhjZW50ZXIueCArIChkZWx0YS55ID09PSAwID8gMCA6IDMpLCBjZW50ZXIueSArIChkZWx0YS54ID09PSAwID8gMCA6IDMpKTtcclxuICAgICAgICBjdHgubGluZVRvKGNlbnRlci54ICsgKGRlbHRhLnkgPT09IDAgPyAwIDogLTMpLCBjZW50ZXIueSArIChkZWx0YS54ID09PSAwID8gMCA6IC0zKSk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguYXJjKGNlbnRlci54LCBjZW50ZXIueSwgNCwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMuc2Vjb25kUGxheWVyUG9zLnggKiBzY2FsZSArIChzY2FsZSAtIDUpIC8gMiwgdGhpcy5zZWNvbmRQbGF5ZXJQb3MueSAqIHNjYWxlICsgKHNjYWxlIC0gNSkgLyAyLCA1LCA1KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3TG9vcCgpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gXCJtYXplRmVpbGRcIikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgICAgICB2YXIgdCA9IChub3cgLSB0aGlzLnNlcnZlclRpbWUpIC8gMTAwO1xyXG4gICAgICAgIHRoaXMuZHJhd09uKHQpO1xyXG5cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5kcmF3TG9vcCgpKTtcclxuICAgIH1cclxufVxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vU2NyaXB0cy9BcmVhQ29udHJvbGxlci50cyIsImltcG9ydCB7QXJlYUNvbnRyb2xsZXIgfSBmcm9tIFwiLi9BcmVhQ29udHJvbGxlci50c1wiO1xyXG5cclxubGV0IGNvbnRyb2xsZXIgPSBuZXcgQXJlYUNvbnRyb2xsZXIoc2VuZE1lc3NhZ2UpO1xyXG5cclxuXHJcbnZhciB1cmkgPSBcIndzOi8vXCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIFwiL3Rlc3RcIjtcclxubGV0IHNvY2tldDogV2ViU29ja2V0O1xyXG5mdW5jdGlvbiBjb25uZWN0KCkge1xyXG4gICAgc29ja2V0ID0gbmV3IFdlYlNvY2tldCh1cmkpO1xyXG4gICAgc29ja2V0Lm9ub3BlbiA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib3BlbmVkIGNvbm5lY3Rpb24gdG8gXCIgKyB1cmkpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIuZ290b0FyZWEoXCJsb2FkaW5nXCIpO1xyXG4gICAgfTtcclxuICAgIHNvY2tldC5vbmNsb3NlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjbG9zZWQgY29ubmVjdGlvbiBmcm9tIFwiICsgdXJpKTtcclxuICAgIH07XHJcbiAgICBzb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgLy9hcHBlbmRJdGVtKGxpc3QsIGV2ZW50LmRhdGEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmRhdGEpO1xyXG5cclxuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcclxuXHJcbiAgICAgICAgY29udHJvbGxlci5wcm9jZXNzKHJlcyk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgIC8vaWYgKHJlcy5jb21tYW5kID09IFwiZ2V0VG9rZW5cIilcclxuICAgICAgICAvLyAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRva2VuXCIsIHJlcy5Ub2tlbik7XHJcblxyXG5cclxuICAgICAgICAvL2lmIChyZXMuY29tbWFuZCA9PT0gXCJwbGF5ZXJTdGF0ZVwiKVxyXG4gICAgICAgIC8vICAgIG1vdmVUbyhyZXMubXlQb3MsIHJlcy5lbmVteVBvcyk7XHJcbiAgICAgICAgLy9lbHNlIGlmIChyZXMuY29tbWFuZCA9PT0gXCJtYXplRmVpbGRcIilcclxuICAgICAgICAvLyAgICBzZXRGaWVsZChyZXMuZmllbGQpXHJcbiAgICAgICAgLy9lbHNlIGlmIChyZXMuY29tbWFuZCA9PSBcImdldFRva2VuXCIpXHJcbiAgICAgICAgLy8gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlblwiLCByZXMuVG9rZW4pXHJcbiAgICAgICAgLy9lbHNlIGlmIChyZXMuY29tbWFuZCA9PSBcImdhbWVPd2VyXCIpXHJcbiAgICAgICAgLy8gICAgaW5HYW1lID0gZmFsc2U7XHJcblxyXG4gICAgfTtcclxuICAgIHNvY2tldC5vbmVycm9yID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJlcnJvcjogXCIgKyBldmVudC5yZXR1cm5WYWx1ZSk7XHJcbiAgICB9O1xyXG59XHJcbmNvbm5lY3QoKTtcclxuZnVuY3Rpb24gc2VuZE1lc3NhZ2UobWVzc2FnZSkge1xyXG4gICAgY29uc29sZS5sb2coXCJTZW5kaW5nOiBcIiArIG1lc3NhZ2UpO1xyXG4gICAgc29ja2V0LnNlbmQobWVzc2FnZSk7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9TY3JpcHRzL2FwcC50cyIsImV4cG9ydCBlbnVtIEtleUNvZGUge1xyXG4gICAgQkFDS1NQQUNFID0gOCxcclxuICAgIFRBQiA9IDksXHJcbiAgICBFTlRFUiA9IDEzLFxyXG4gICAgU0hJRlQgPSAxNixcclxuICAgIENUUkwgPSAxNyxcclxuICAgIEFMVCA9IDE4LFxyXG4gICAgUEFVU0UgPSAxOSxcclxuICAgIENBUFNfTE9DSyA9IDIwLFxyXG4gICAgRVNDQVBFID0gMjcsXHJcbiAgICBTUEFDRSA9IDMyLFxyXG4gICAgUEFHRV9VUCA9IDMzLFxyXG4gICAgUEFHRV9ET1dOID0gMzQsXHJcbiAgICBFTkQgPSAzNSxcclxuICAgIEhPTUUgPSAzNixcclxuICAgIExFRlRfQVJST1cgPSAzNyxcclxuICAgIFVQX0FSUk9XID0gMzgsXHJcbiAgICBSSUdIVF9BUlJPVyA9IDM5LFxyXG4gICAgRE9XTl9BUlJPVyA9IDQwLFxyXG4gICAgSU5TRVJUID0gNDUsXHJcbiAgICBERUxFVEUgPSA0NixcclxuICAgIEtFWV8wID0gNDgsXHJcbiAgICBLRVlfMSA9IDQ5LFxyXG4gICAgS0VZXzIgPSA1MCxcclxuICAgIEtFWV8zID0gNTEsXHJcbiAgICBLRVlfNCA9IDUyLFxyXG4gICAgS0VZXzUgPSA1MyxcclxuICAgIEtFWV82ID0gNTQsXHJcbiAgICBLRVlfNyA9IDU1LFxyXG4gICAgS0VZXzggPSA1NixcclxuICAgIEtFWV85ID0gNTcsXHJcbiAgICBLRVlfQSA9IDY1LFxyXG4gICAgS0VZX0IgPSA2NixcclxuICAgIEtFWV9DID0gNjcsXHJcbiAgICBLRVlfRCA9IDY4LFxyXG4gICAgS0VZX0UgPSA2OSxcclxuICAgIEtFWV9GID0gNzAsXHJcbiAgICBLRVlfRyA9IDcxLFxyXG4gICAgS0VZX0ggPSA3MixcclxuICAgIEtFWV9JID0gNzMsXHJcbiAgICBLRVlfSiA9IDc0LFxyXG4gICAgS0VZX0sgPSA3NSxcclxuICAgIEtFWV9MID0gNzYsXHJcbiAgICBLRVlfTSA9IDc3LFxyXG4gICAgS0VZX04gPSA3OCxcclxuICAgIEtFWV9PID0gNzksXHJcbiAgICBLRVlfUCA9IDgwLFxyXG4gICAgS0VZX1EgPSA4MSxcclxuICAgIEtFWV9SID0gODIsXHJcbiAgICBLRVlfUyA9IDgzLFxyXG4gICAgS0VZX1QgPSA4NCxcclxuICAgIEtFWV9VID0gODUsXHJcbiAgICBLRVlfViA9IDg2LFxyXG4gICAgS0VZX1cgPSA4NyxcclxuICAgIEtFWV9YID0gODgsXHJcbiAgICBLRVlfWSA9IDg5LFxyXG4gICAgS0VZX1ogPSA5MCxcclxuICAgIExFRlRfTUVUQSA9IDkxLFxyXG4gICAgUklHSFRfTUVUQSA9IDkyLFxyXG4gICAgU0VMRUNUID0gOTMsXHJcbiAgICBOVU1QQURfMCA9IDk2LFxyXG4gICAgTlVNUEFEXzEgPSA5NyxcclxuICAgIE5VTVBBRF8yID0gOTgsXHJcbiAgICBOVU1QQURfMyA9IDk5LFxyXG4gICAgTlVNUEFEXzQgPSAxMDAsXHJcbiAgICBOVU1QQURfNSA9IDEwMSxcclxuICAgIE5VTVBBRF82ID0gMTAyLFxyXG4gICAgTlVNUEFEXzcgPSAxMDMsXHJcbiAgICBOVU1QQURfOCA9IDEwNCxcclxuICAgIE5VTVBBRF85ID0gMTA1LFxyXG4gICAgTVVMVElQTFkgPSAxMDYsXHJcbiAgICBBREQgPSAxMDcsXHJcbiAgICBTVUJUUkFDVCA9IDEwOSxcclxuICAgIERFQ0lNQUwgPSAxMTAsXHJcbiAgICBESVZJREUgPSAxMTEsXHJcbiAgICBGMSA9IDExMixcclxuICAgIEYyID0gMTEzLFxyXG4gICAgRjMgPSAxMTQsXHJcbiAgICBGNCA9IDExNSxcclxuICAgIEY1ID0gMTE2LFxyXG4gICAgRjYgPSAxMTcsXHJcbiAgICBGNyA9IDExOCxcclxuICAgIEY4ID0gMTE5LFxyXG4gICAgRjkgPSAxMjAsXHJcbiAgICBGMTAgPSAxMjEsXHJcbiAgICBGMTEgPSAxMjIsXHJcbiAgICBGMTIgPSAxMjMsXHJcbiAgICBOVU1fTE9DSyA9IDE0NCxcclxuICAgIFNDUk9MTF9MT0NLID0gMTQ1LFxyXG4gICAgU0VNSUNPTE9OID0gMTg2LFxyXG4gICAgRVFVQUxTID0gMTg3LFxyXG4gICAgQ09NTUEgPSAxODgsXHJcbiAgICBEQVNIID0gMTg5LFxyXG4gICAgUEVSSU9EID0gMTkwLFxyXG4gICAgRk9SV0FSRF9TTEFTSCA9IDE5MSxcclxuICAgIEdSQVZFX0FDQ0VOVCA9IDE5MixcclxuICAgIE9QRU5fQlJBQ0tFVCA9IDIxOSxcclxuICAgIEJBQ0tfU0xBU0ggPSAyMjAsXHJcbiAgICBDTE9TRV9CUkFDS0VUID0gMjIxLFxyXG4gICAgU0lOR0xFX1FVT1RFID0gMjIyXHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vU2NyaXB0cy9rZXlfY29kZS50cyJdLCJzb3VyY2VSb290IjoiIn0=