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
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#227F32";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWU0YzNmNGYyNmQ5M2UyMDE0ODYiLCJ3ZWJwYWNrOi8vLy4vU2NyaXB0cy9BcmVhQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly8vLi9TY3JpcHRzL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9TY3JpcHRzL2tleV9jb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQy9EQSwyQ0FBc0M7QUFFdEM7SUFJSSx3QkFBbUIsUUFBNkI7UUFIeEMsVUFBSyxHQUE0QixFQUFFLENBQUM7UUFDcEMsZ0JBQVcsR0FBVSxJQUFJLENBQUM7UUFHOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLGlDQUFRLEdBQWYsVUFBZ0IsSUFBWTtRQUN4QixF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Q0FBQyxDQUFDO29CQUNuQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFDRCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFHYixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNyRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUVyRSxJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN0RCxJQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNuRyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM3RCxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENB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Q0FBVTtJQUNWLHdDQUFVO0lBQ1Ysd0NBQVU7SUFDVix3Q0FBVTtJQUNWLHdDQUFVO0lBQ1Ysd0NBQVU7SUFDVix3Q0FBVTtJQUNWLHdDQUFVO0lBQ1Ysd0NBQVU7SUFDVix3Q0FBVTtJQUNWLHdDQUFVO0lBQ1Ysd0NBQVU7SUFDVix3Q0FBVTtJQUNWLHdDQUFVO0lBQ1Ysd0NBQVU7SUFDVix3Q0FBVTtJQUNWLHdDQUFVO0lBQ1Ysd0NBQVU7SUFDVix3Q0FBVTtJQUNWLHdDQUFVO0lBQ1Ysd0NBQVU7SUFDVix3Q0FBVTtJQUNWLHdDQUFVO0lBQ1Ysd0NBQVU7SUFDVix3Q0FBVTtJQUNWLHdDQUFVO0lBQ1YsZ0RBQWM7SUFDZCxrREFBZTtJQUNmLDBDQUFXO0lBQ1gsOENBQWE7SUFDYiw4Q0FBYTtJQUNiLDhDQUFhO0lBQ2IsOENBQWE7SUFDYiwrQ0FBYztJQUNkLCtDQUFjO0lBQ2QsK0NBQWM7SUFDZCwrQ0FBYztJQUNkLCtDQUFjO0lBQ2QsK0NBQWM7SUFDZCwrQ0FBYztJQUNkLHFDQUFTO0lBQ1QsK0NBQWM7SUFDZCw2Q0FBYTtJQUNiLDJDQUFZO0lBQ1osbUNBQVE7SUFDUixtQ0FBUTtJQUNSLG1DQUFRO0lBQ1IsbUNBQVE7SUFDUixtQ0FBUTtJQUNSLG1DQUFRO0lBQ1IsbUNBQVE7SUFDUixtQ0FBUTtJQUNSLG1DQUFRO0lBQ1IscUNBQVM7SUFDVCxxQ0FBUztJQUNULHFDQUFTO0lBQ1QsK0NBQWM7SUFDZCxxREFBaUI7SUFDakIsaURBQWU7SUFDZiwyQ0FBWTtJQUNaLHlDQUFXO0lBQ1gsdUNBQVU7SUFDViwyQ0FBWTtJQUNaLHlEQUFtQjtJQUNuQix1REFBa0I7SUFDbEIsdURBQWtCO0lBQ2xCLG1EQUFnQjtJQUNoQix5REFBbUI7SUFDbkIsdURBQWtCO0FBQ3RCLENBQUMsRUFwR1csT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBb0dsQjtBQUFBLENBQUMiLCJmaWxlIjoiLi93d3dyb290L2pzL2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMWU0YzNmNGYyNmQ5M2UyMDE0ODYiLCJpbXBvcnQge0lBcmVhfSBmcm9tIFwiLi9JQXJlYS50c1wiO1xyXG5pbXBvcnQge0tleUNvZGV9IGZyb20gXCIuL2tleV9jb2RlLnRzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQXJlYUNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBhcmVhczogeyBbaWQ6IHN0cmluZ106IElBcmVhIH0gPSB7fTtcclxuICAgIHByaXZhdGUgY3VycmVudEFyZWE6IElBcmVhID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3Ioc2VuZERhdGE6IChkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLmFyZWFzW1wibG9hZGluZ1wiXSA9IG5ldyBMb2FkaW5nQXJlYShzZW5kRGF0YSk7XHJcbiAgICAgICAgdGhpcy5hcmVhc1tcIndlbGNvbWVcIl0gPSBuZXcgV2VsY29tZUFyZWEoc2VuZERhdGEpO1xyXG4gICAgICAgIHRoaXMuYXJlYXNbXCJnYW1lXCJdID0gbmV3IEdhbWVBcmVhKHNlbmREYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ290b0FyZWEoYXJlYTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEFyZWEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBcmVhLmxlYXZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRBcmVhID0gdGhpcy5hcmVhc1thcmVhXTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRBcmVhLmVudGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByb2Nlc3MoZGF0YTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGRhdGEuY29tbWFuZCA9PT0gXCJnb3RvXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5nb3RvQXJlYShkYXRhLmFyZWEpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50QXJlYSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFyZWEucHJvY2VzcyhkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIExvYWRpbmdBcmVhIGltcGxlbWVudHMgSUFyZWEge1xyXG4gICAgcHJpdmF0ZSBzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3Ioc2VuZERhdGE6IChkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLnNlbmREYXRhID0gc2VuZERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudGVyKCkge1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEoSlNPTi5zdHJpbmdpZnkoeyBUeXBlOiBcInRva2VuXCIsIFRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGVhdmUoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByb2Nlc3MoZGF0YTogYW55KSB7XHJcbiAgICAgICAgaWYgKGRhdGEuY29tbWFuZCA9PT0gXCJzZXRUb2tlblwiKSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidG9rZW5cIiwgZGF0YS50b2tlbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY2xhc3MgV2VsY29tZUFyZWEgaW1wbGVtZW50cyBJQXJlYSB7XHJcbiAgICBwcml2YXRlIHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEgPSBzZW5kRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW50ZXIoKSB7XHJcbiAgICAgICAgJChcIiNtYWluLWNvbnRlbnRcIikuaHRtbCgkKFwiI3dlbGNvbWUtYXJlYS10ZW1wYWx0ZVwiKS5odG1sKCkpO1xyXG4gICAgICAgICQoXCIud2VsY29tZS1wbGF5LWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIChhcmc6IEpRdWVyeUV2ZW50T2JqZWN0KSA9PiB0aGlzLm9uQ2xpY2soYXJnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQ2xpY2soYXJnOiBKUXVlcnlFdmVudE9iamVjdCkge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSAkKFwid2VsY29tZS1wbGF5ZXItbmFtZVwiKS52YWwoKTtcclxuICAgICAgICB0aGlzLnNlbmREYXRhKEpTT04uc3RyaW5naWZ5KHsgVHlwZTogXCJQbGF5ZXJOYW1lXCIsIE5hbWU6IG5hbWUgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsZWF2ZSgpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJvY2VzcyhkYXRhOiBhbnkpIHtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jbGFzcyBHYW1lQXJlYSBpbXBsZW1lbnRzIElBcmVhIHtcclxuICAgIHByaXZhdGUgc2VuZERhdGE6IChkYXRhOiBhbnkpID0+IHZvaWQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YSA9IHNlbmREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnRlcigpIHtcclxuICAgICAgICAkKFwiI21haW4tY29udGVudFwiKS5odG1sKCQoXCIjZ2FtZS1hcmVhLXRlbXBhbHRlXCIpLmh0bWwoKSk7XHJcbiAgICAgICAgJChcIiNnYW1lLWNhbnZhc1wiKS5vbihcImtleWRvd25cIiwgKGFyZzogSlF1ZXJ5RXZlbnRPYmplY3QpID0+IHRoaXMub25LZXlEb3duKGFyZykpO1xyXG4gICAgICAgICQoXCIuZ2FtZS1nYW1lb3Zlci1zY3JlZW4tYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKGFyZzogSlF1ZXJ5RXZlbnRPYmplY3QpID0+IHRoaXMub25QbGF5QWdhaW4oYXJnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxlYXZlKCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25LZXlEb3duKGU6IEpRdWVyeUV2ZW50T2JqZWN0KSB7XHJcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gS2V5Q29kZS5ET1dOX0FSUk9XIHx8IGUua2V5Q29kZSA9PT0gS2V5Q29kZS5LRVlfUykge1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRLZXkoXCJEb3duXCIsIGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBLZXlDb2RlLlVQX0FSUk9XIHx8IGUua2V5Q29kZSA9PT0gS2V5Q29kZS5LRVlfVykge1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRLZXkoXCJVcFwiLCBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gS2V5Q29kZS5MRUZUX0FSUk9XIHx8IGUua2V5Q29kZSA9PT0gS2V5Q29kZS5LRVlfQSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRLZXkoXCJMZWZ0XCIsIGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBLZXlDb2RlLlJJR0hUX0FSUk9XIHx8IGUua2V5Q29kZSA9PT0gS2V5Q29kZS5LRVlfRCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRLZXkoXCJSaWdodFwiLCBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblBsYXlBZ2FpbihlOiBKUXVlcnlFdmVudE9iamVjdCkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0aGlzLnNlbmREYXRhKEpTT04uc3RyaW5naWZ5KHsgdHlwZTogXCJwbGF5QWdhaW5cIiB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VuZEtleShrZXk6IHN0cmluZywgZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0aGlzLnNlbmREYXRhKEpTT04uc3RyaW5naWZ5KHsgdHlwZTogXCJrZXlEb3duXCIsIENvbW1hbmQ6IGtleSB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByb2Nlc3MoZGF0YTogYW55KSB7XHJcbiAgICAgICAgaWYgKGRhdGEuY29tbWFuZCA9PT0gXCJ3YWl0T3Bwb25lbnRcIikge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gXCJ3YWl0T3Bwb25lbnRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRhdGEuY29tbWFuZCA9PT0gXCJtYXplRmVpbGRcIikge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gXCJtYXplRmVpbGRcIjtcclxuICAgICAgICAgICAgdGhpcy5tYXplRmllbGQgPSBkYXRhLmZpZWxkO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdMb29wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkYXRhLmNvbW1hbmQgPT09IFwiZ2FtZU92ZXJcIikge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gXCJnYW1lT3ZlclwiO1xyXG4gICAgICAgICAgICB0aGlzLmlzV2luID0gZGF0YS5zdGF0dXMgPT09IFwid2luXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0YS5jb21tYW5kID09PSBcInBsYXllclN0YXRlXCIpXHJcbiAgICAgICAgICAgIHRoaXMubW92ZVRvKGRhdGEubXlQb3MsIGRhdGEuZW5lbXlQb3MpO1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGU6IHN0cmluZztcclxuICAgIHByaXZhdGUgbWF6ZUZpZWxkOiBhbnk7XHJcbiAgICBwcml2YXRlIGlzV2luOiBib29sZWFuO1xyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyKCkge1xyXG4gICAgICAgICQoXCIjZ2FtZS13YWl0LXNjcmVlblwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCB0aGlzLnN0YXRlICE9PSBcIndhaXRPcHBvbmVudFwiKTtcclxuICAgICAgICAkKFwiI2dhbWUtY2FudmFzLXNjcmVlblwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCB0aGlzLnN0YXRlICE9PSBcIm1hemVGZWlsZFwiKTtcclxuICAgICAgICAkKFwiI2dhbWUtZ2FtZW92ZXItc2NyZWVuXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZGVuXCIsIHRoaXMuc3RhdGUgIT09IFwiZ2FtZU92ZXJcIik7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IFwiZ2FtZU92ZXJcIikge1xyXG4gICAgICAgICAgICAkKFwiI2dhbWUtZ2FtZW92ZXItc2NyZWVuIC53aW5uZXJcIikudG9nZ2xlQ2xhc3MoXCJoaWRkZW5cIiwgdGhpcy5pc1dpbiA9PSBmYWxzZSk7XHJcbiAgICAgICAgICAgICQoXCIjZ2FtZS1nYW1lb3Zlci1zY3JlZW4gLmxvb3NlclwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCB0aGlzLmlzV2luKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50UG9zID0geyB4OiAwLCB5OiAwIH07XHJcbiAgICBwcml2YXRlIHNlcnZlclBvcyA9IHsgeDogMCwgeTogMCB9O1xyXG4gICAgcHJpdmF0ZSBzZXJ2ZXJUaW1lID0gMDtcclxuICAgIHByaXZhdGUgc2Vjb25kUGxheWVyUG9zID0geyB4OiAwLCB5OiAwIH07XHJcblxyXG4gICAgcHJpdmF0ZSBtb3ZlVG8obXlQb3MsIGVuZW15UG9zKSB7XHJcbiAgICAgICAgdGhpcy5zZWNvbmRQbGF5ZXJQb3MgPSBlbmVteVBvcztcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50UG9zLnggPSB0aGlzLnNlcnZlclBvcy54O1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBvcy55ID0gdGhpcy5zZXJ2ZXJQb3MueTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXJ2ZXJQb3MueCA9IG15UG9zLng7XHJcbiAgICAgICAgdGhpcy5zZXJ2ZXJQb3MueSA9IG15UG9zLnk7XHJcblxyXG4gICAgICAgIHRoaXMuc2VydmVyVGltZSA9IERhdGUubm93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3T24odCkge1xyXG4gICAgICAgIGNvbnN0IHNjYWxlID0gMjA7XHJcblxyXG4gICAgICAgIHZhciBjdHggPSAoJChcIiNnYW1lLWNhbnZhc1wiKVswXSBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjdHguY2FudmFzLndpZHRoLCBjdHguY2FudmFzLmhlaWdodCk7XHJcblxyXG4gICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMTAuNSwgMTAuNSk7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSA1O1xyXG4gICAgICAgIGN0eC5saW5lQ2FwID0gXCJyb3VuZFwiO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiIzIyN0YzMlwiO1xyXG4gICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5tYXplRmllbGQubGVuZ3RoOyArK3kpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLm1hemVGaWVsZFt5XS5sZW5ndGg7ICsreCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0b3BMZWZ0ID0geyB4OiB4ICogc2NhbGUsIHk6IHkgKiBzY2FsZSB9O1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvcFJpZ2h0ID0geyB4OiAoeCArIDEpICogc2NhbGUsIHk6IHkgKiBzY2FsZSB9O1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdHRvbVJpZ2h0ID0geyB4OiAoeCArIDEpICogc2NhbGUsIHk6ICh5ICsgMSkgKiBzY2FsZSB9O1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdHRvbUxlZnQgPSB7IHg6IHggKiBzY2FsZSwgeTogKHkgKyAxKSAqIHNjYWxlIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCh0aGlzLm1hemVGaWVsZFt5XVt4XSAmIDEpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh0b3BMZWZ0LngsIHRvcExlZnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh0b3BSaWdodC54LCB0b3BSaWdodC55KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKHRoaXMubWF6ZUZpZWxkW3ldW3hdICYgMikgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHRvcFJpZ2h0LngsIHRvcFJpZ2h0LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYm90dG9tUmlnaHQueCwgYm90dG9tUmlnaHQueSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCh0aGlzLm1hemVGaWVsZFt5XVt4XSAmIDQpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhib3R0b21SaWdodC54LCBib3R0b21SaWdodC55KTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKGJvdHRvbUxlZnQueCwgYm90dG9tTGVmdC55KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKHRoaXMubWF6ZUZpZWxkW3ldW3hdICYgOCkgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKGJvdHRvbUxlZnQueCwgYm90dG9tTGVmdC55KTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHRvcExlZnQueCwgdG9wTGVmdC55KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHZhciB4ID0gKHRoaXMuY3VycmVudFBvcy54ICogKDEgLSB0KSArIHRoaXMuc2VydmVyUG9zLnggKiB0KSAqIHNjYWxlO1xyXG4gICAgICAgIHZhciB5ID0gKHRoaXMuY3VycmVudFBvcy55ICogKDEgLSB0KSArIHRoaXMuc2VydmVyUG9zLnkgKiB0KSAqIHNjYWxlO1xyXG5cclxuICAgICAgICBjb25zdCBjZW50ZXIgPSB7IHg6IHggKyBzY2FsZSAvIDIsIHk6IHkgKyBzY2FsZSAvIDIgfTtcclxuICAgICAgICBjb25zdCBkZWx0YSA9IHsgeDogdGhpcy5zZXJ2ZXJQb3MueCAtIHRoaXMuY3VycmVudFBvcy54LCB5OiB0aGlzLnNlcnZlclBvcy55IC0gdGhpcy5jdXJyZW50UG9zLnkgfTtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhjZW50ZXIueCAtIGRlbHRhLnggKiAyNSwgY2VudGVyLnkgLSBkZWx0YS55ICogMjUpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oY2VudGVyLnggKyAoZGVsdGEueSA9PT0gMCA/IDAgOiAzKSwgY2VudGVyLnkgKyAoZGVsdGEueCA9PT0gMCA/IDAgOiAzKSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhjZW50ZXIueCArIChkZWx0YS55ID09PSAwID8gMCA6IC0zKSwgY2VudGVyLnkgKyAoZGVsdGEueCA9PT0gMCA/IDAgOiAtMykpO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmFyYyhjZW50ZXIueCwgY2VudGVyLnksIDQsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh0aGlzLnNlY29uZFBsYXllclBvcy54ICogc2NhbGUgKyAoc2NhbGUgLSA1KSAvIDIsIHRoaXMuc2Vjb25kUGxheWVyUG9zLnkgKiBzY2FsZSArIChzY2FsZSAtIDUpIC8gMiwgNSwgNSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgZHJhd0xvb3AoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IFwibWF6ZUZlaWxkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdmFyIHQgPSAobm93IC0gdGhpcy5zZXJ2ZXJUaW1lKSAvIDEwMDtcclxuICAgICAgICB0aGlzLmRyYXdPbih0KTtcclxuXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZHJhd0xvb3AoKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL1NjcmlwdHMvQXJlYUNvbnRyb2xsZXIudHMiLCJpbXBvcnQge0FyZWFDb250cm9sbGVyIH0gZnJvbSBcIi4vQXJlYUNvbnRyb2xsZXIudHNcIjtcclxuXHJcbmxldCBjb250cm9sbGVyID0gbmV3IEFyZWFDb250cm9sbGVyKHNlbmRNZXNzYWdlKTtcclxuXHJcblxyXG52YXIgdXJpID0gXCJ3czovL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyBcIi90ZXN0XCI7XHJcbmxldCBzb2NrZXQ6IFdlYlNvY2tldDtcclxuZnVuY3Rpb24gY29ubmVjdCgpIHtcclxuICAgIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJpKTtcclxuICAgIHNvY2tldC5vbm9wZW4gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9wZW5lZCBjb25uZWN0aW9uIHRvIFwiICsgdXJpKTtcclxuICAgICAgICBjb250cm9sbGVyLmdvdG9BcmVhKFwibG9hZGluZ1wiKTtcclxuICAgIH07XHJcbiAgICBzb2NrZXQub25jbG9zZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xvc2VkIGNvbm5lY3Rpb24gZnJvbSBcIiArIHVyaSk7XHJcbiAgICB9O1xyXG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIC8vYXBwZW5kSXRlbShsaXN0LCBldmVudC5kYXRhKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhKTtcclxuXHJcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XHJcblxyXG4gICAgICAgIGNvbnRyb2xsZXIucHJvY2VzcyhyZXMpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAvL2lmIChyZXMuY29tbWFuZCA9PSBcImdldFRva2VuXCIpXHJcbiAgICAgICAgLy8gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlblwiLCByZXMuVG9rZW4pO1xyXG5cclxuXHJcbiAgICAgICAgLy9pZiAocmVzLmNvbW1hbmQgPT09IFwicGxheWVyU3RhdGVcIilcclxuICAgICAgICAvLyAgICBtb3ZlVG8ocmVzLm15UG9zLCByZXMuZW5lbXlQb3MpO1xyXG4gICAgICAgIC8vZWxzZSBpZiAocmVzLmNvbW1hbmQgPT09IFwibWF6ZUZlaWxkXCIpXHJcbiAgICAgICAgLy8gICAgc2V0RmllbGQocmVzLmZpZWxkKVxyXG4gICAgICAgIC8vZWxzZSBpZiAocmVzLmNvbW1hbmQgPT0gXCJnZXRUb2tlblwiKVxyXG4gICAgICAgIC8vICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidG9rZW5cIiwgcmVzLlRva2VuKVxyXG4gICAgICAgIC8vZWxzZSBpZiAocmVzLmNvbW1hbmQgPT0gXCJnYW1lT3dlclwiKVxyXG4gICAgICAgIC8vICAgIGluR2FtZSA9IGZhbHNlO1xyXG5cclxuICAgIH07XHJcbiAgICBzb2NrZXQub25lcnJvciA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IFwiICsgZXZlbnQucmV0dXJuVmFsdWUpO1xyXG4gICAgfTtcclxufVxyXG5jb25uZWN0KCk7XHJcbmZ1bmN0aW9uIHNlbmRNZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZzogXCIgKyBtZXNzYWdlKTtcclxuICAgIHNvY2tldC5zZW5kKG1lc3NhZ2UpO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vU2NyaXB0cy9hcHAudHMiLCJleHBvcnQgZW51bSBLZXlDb2RlIHtcclxuICAgIEJBQ0tTUEFDRSA9IDgsXHJcbiAgICBUQUIgPSA5LFxyXG4gICAgRU5URVIgPSAxMyxcclxuICAgIFNISUZUID0gMTYsXHJcbiAgICBDVFJMID0gMTcsXHJcbiAgICBBTFQgPSAxOCxcclxuICAgIFBBVVNFID0gMTksXHJcbiAgICBDQVBTX0xPQ0sgPSAyMCxcclxuICAgIEVTQ0FQRSA9IDI3LFxyXG4gICAgU1BBQ0UgPSAzMixcclxuICAgIFBBR0VfVVAgPSAzMyxcclxuICAgIFBBR0VfRE9XTiA9IDM0LFxyXG4gICAgRU5EID0gMzUsXHJcbiAgICBIT01FID0gMzYsXHJcbiAgICBMRUZUX0FSUk9XID0gMzcsXHJcbiAgICBVUF9BUlJPVyA9IDM4LFxyXG4gICAgUklHSFRfQVJST1cgPSAzOSxcclxuICAgIERPV05fQVJST1cgPSA0MCxcclxuICAgIElOU0VSVCA9IDQ1LFxyXG4gICAgREVMRVRFID0gNDYsXHJcbiAgICBLRVlfMCA9IDQ4LFxyXG4gICAgS0VZXzEgPSA0OSxcclxuICAgIEtFWV8yID0gNTAsXHJcbiAgICBLRVlfMyA9IDUxLFxyXG4gICAgS0VZXzQgPSA1MixcclxuICAgIEtFWV81ID0gNTMsXHJcbiAgICBLRVlfNiA9IDU0LFxyXG4gICAgS0VZXzcgPSA1NSxcclxuICAgIEtFWV84ID0gNTYsXHJcbiAgICBLRVlfOSA9IDU3LFxyXG4gICAgS0VZX0EgPSA2NSxcclxuICAgIEtFWV9CID0gNjYsXHJcbiAgICBLRVlfQyA9IDY3LFxyXG4gICAgS0VZX0QgPSA2OCxcclxuICAgIEtFWV9FID0gNjksXHJcbiAgICBLRVlfRiA9IDcwLFxyXG4gICAgS0VZX0cgPSA3MSxcclxuICAgIEtFWV9IID0gNzIsXHJcbiAgICBLRVlfSSA9IDczLFxyXG4gICAgS0VZX0ogPSA3NCxcclxuICAgIEtFWV9LID0gNzUsXHJcbiAgICBLRVlfTCA9IDc2LFxyXG4gICAgS0VZX00gPSA3NyxcclxuICAgIEtFWV9OID0gNzgsXHJcbiAgICBLRVlfTyA9IDc5LFxyXG4gICAgS0VZX1AgPSA4MCxcclxuICAgIEtFWV9RID0gODEsXHJcbiAgICBLRVlfUiA9IDgyLFxyXG4gICAgS0VZX1MgPSA4MyxcclxuICAgIEtFWV9UID0gODQsXHJcbiAgICBLRVlfVSA9IDg1LFxyXG4gICAgS0VZX1YgPSA4NixcclxuICAgIEtFWV9XID0gODcsXHJcbiAgICBLRVlfWCA9IDg4LFxyXG4gICAgS0VZX1kgPSA4OSxcclxuICAgIEtFWV9aID0gOTAsXHJcbiAgICBMRUZUX01FVEEgPSA5MSxcclxuICAgIFJJR0hUX01FVEEgPSA5MixcclxuICAgIFNFTEVDVCA9IDkzLFxyXG4gICAgTlVNUEFEXzAgPSA5NixcclxuICAgIE5VTVBBRF8xID0gOTcsXHJcbiAgICBOVU1QQURfMiA9IDk4LFxyXG4gICAgTlVNUEFEXzMgPSA5OSxcclxuICAgIE5VTVBBRF80ID0gMTAwLFxyXG4gICAgTlVNUEFEXzUgPSAxMDEsXHJcbiAgICBOVU1QQURfNiA9IDEwMixcclxuICAgIE5VTVBBRF83ID0gMTAzLFxyXG4gICAgTlVNUEFEXzggPSAxMDQsXHJcbiAgICBOVU1QQURfOSA9IDEwNSxcclxuICAgIE1VTFRJUExZID0gMTA2LFxyXG4gICAgQUREID0gMTA3LFxyXG4gICAgU1VCVFJBQ1QgPSAxMDksXHJcbiAgICBERUNJTUFMID0gMTEwLFxyXG4gICAgRElWSURFID0gMTExLFxyXG4gICAgRjEgPSAxMTIsXHJcbiAgICBGMiA9IDExMyxcclxuICAgIEYzID0gMTE0LFxyXG4gICAgRjQgPSAxMTUsXHJcbiAgICBGNSA9IDExNixcclxuICAgIEY2ID0gMTE3LFxyXG4gICAgRjcgPSAxMTgsXHJcbiAgICBGOCA9IDExOSxcclxuICAgIEY5ID0gMTIwLFxyXG4gICAgRjEwID0gMTIxLFxyXG4gICAgRjExID0gMTIyLFxyXG4gICAgRjEyID0gMTIzLFxyXG4gICAgTlVNX0xPQ0sgPSAxNDQsXHJcbiAgICBTQ1JPTExfTE9DSyA9IDE0NSxcclxuICAgIFNFTUlDT0xPTiA9IDE4NixcclxuICAgIEVRVUFMUyA9IDE4NyxcclxuICAgIENPTU1BID0gMTg4LFxyXG4gICAgREFTSCA9IDE4OSxcclxuICAgIFBFUklPRCA9IDE5MCxcclxuICAgIEZPUldBUkRfU0xBU0ggPSAxOTEsXHJcbiAgICBHUkFWRV9BQ0NFTlQgPSAxOTIsXHJcbiAgICBPUEVOX0JSQUNLRVQgPSAyMTksXHJcbiAgICBCQUNLX1NMQVNIID0gMjIwLFxyXG4gICAgQ0xPU0VfQlJBQ0tFVCA9IDIyMSxcclxuICAgIFNJTkdMRV9RVU9URSA9IDIyMlxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL1NjcmlwdHMva2V5X2NvZGUudHMiXSwic291cmNlUm9vdCI6IiJ9