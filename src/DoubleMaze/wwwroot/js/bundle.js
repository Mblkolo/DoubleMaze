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
        this.areas["loading"] = function () { return new LoadingArea(sendData); };
        this.areas["welcome"] = function () { return new WelcomeArea(sendData); };
        this.areas["game"] = function () { return new GameArea(sendData); };
    }
    AreaController.prototype.gotoArea = function (area) {
        if (this.currentArea != null) {
            this.currentArea.leave();
        }
        this.currentArea = this.areas[area]();
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
        var _this = this;
        this.onKeyDownHandler = function (arg) { return _this.onKeyDown(arg); };
        this.serverTime = 0;
        this.scale = 20;
        this.sendData = sendData;
    }
    GameArea.prototype.enter = function () {
        var _this = this;
        $("#main-content").html($("#game-area-tempalte").html());
        $(document).on("keydown", this.onKeyDownHandler);
        $(".game-gameover-screen-button").on("click", function (arg) { return _this.onPlayAgain(arg); });
    };
    GameArea.prototype.leave = function () {
        $(document).off("keydown", this.onKeyDownHandler);
        this.state = null;
    };
    GameArea.prototype.onKeyDown = function (e) {
        if (e.keyCode == key_code_ts_1.KeyCode.DOWN_ARROW
            || e.keyCode == key_code_ts_1.KeyCode.UP_ARROW
            || e.keyCode == key_code_ts_1.KeyCode.LEFT_ARROW
            || e.keyCode == key_code_ts_1.KeyCode.RIGHT_ARROW) {
            e.preventDefault();
        }
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
            this.mazeField = data;
            this.drawLoop();
        }
        if (data.command === "gameOver") {
            this.state = "gameOver";
            this.gameOver = data;
        }
        if (data.command === "playerState")
            this.moveTo(data.myPos, data.enemyPos);
        this.render();
    };
    GameArea.prototype.render = function () {
        $("#game-wait-screen").toggleClass("hidden", this.state !== "waitOpponent");
        $("#game-canvas-screen").toggleClass("hidden", this.state !== "mazeFeild");
        $("#game-gameover-screen").toggleClass("hidden", this.state !== "gameOver");
        if (this.state === "mazeFeild") {
            $(".game-canvas-my-name").text(this.mazeField.me.name).prop("title", this.mazeField.me.name);
            $(".game-canvas-my-rating").text(this.mazeField.me.rating);
            $(".game-canvas-enemy-name").text(this.mazeField.enemy.name).prop("title", this.mazeField.enemy.name);
            $(".game-canvas-enemy-rating").text(this.mazeField.enemy.rating);
        }
        if (this.state === "gameOver") {
            $("#game-gameover-screen .winner").toggleClass("hidden", this.gameOver.status === "win");
            $("#game-gameover-screen .looser").toggleClass("hidden", this.gameOver.status !== "win");
            for (var i = 0; i < this.gameOver.ratings.length; ++i) {
                var rating = this.gameOver.ratings[i];
                $(".game-canvas-ratings").append("<tr><td>" + (i + 1) + "</td><td></td><td></td></tr>");
                var cells = $(".game-canvas-ratings").children().last().children();
                cells.eq(1).text(rating.name).prop("title", rating.name);
                cells.eq(2).text(rating.rating);
            }
        }
    };
    GameArea.prototype.moveTo = function (myPos, enemyPos) {
        if (this.enemyPos == null)
            this.enemyPos = new PlayerPosition(enemyPos.x, enemyPos.y);
        this.enemyPos.SetPos(enemyPos.x, enemyPos.y);
        if (this.playerPos == null)
            this.playerPos = new PlayerPosition(myPos.x, myPos.y);
        this.playerPos.SetPos(myPos.x, myPos.y);
        this.serverTime = Date.now();
    };
    GameArea.prototype.drawOn = function (t) {
        var scale = this.scale;
        var mazeField = this.mazeField.field;
        var ctx = $("#game-canvas")[0].getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.setTransform(1, 0, 0, 1, 10.5, 10.5);
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        //ctx.strokeStyle = "#227F32";
        ctx.strokeStyle = "#333";
        for (var y = 0; y < mazeField.length; ++y) {
            for (var x = 0; x < mazeField[y].length; ++x) {
                var topLeft = { x: x * scale, y: y * scale };
                var topRight = { x: (x + 1) * scale, y: y * scale };
                var bottomRight = { x: (x + 1) * scale, y: (y + 1) * scale };
                var bottomLeft = { x: x * scale, y: (y + 1) * scale };
                if ((mazeField[y][x] & 1) !== 0) {
                    ctx.moveTo(topLeft.x, topLeft.y);
                    ctx.lineTo(topRight.x, topRight.y);
                }
                if ((mazeField[y][x] & 2) !== 0) {
                    ctx.moveTo(topRight.x, topRight.y);
                    ctx.lineTo(bottomRight.x, bottomRight.y);
                }
                if ((mazeField[y][x] & 4) !== 0) {
                    ctx.moveTo(bottomRight.x, bottomRight.y);
                    ctx.lineTo(bottomLeft.x, bottomLeft.y);
                }
                if ((mazeField[y][x] & 8) !== 0) {
                    ctx.moveTo(bottomLeft.x, bottomLeft.y);
                    ctx.lineTo(topLeft.x, topLeft.y);
                }
            }
        }
        ctx.stroke();
        if (this.playerPos != null) {
            this.DrawPlayer(this.playerPos, ctx, t, "#227F32", 4);
        }
        if (this.enemyPos != null) {
            this.DrawPlayer(this.enemyPos, ctx, t, "#bf0d31", 3);
        }
    };
    GameArea.prototype.DrawPlayer = function (playerPos, ctx, progress, color, size) {
        ctx.fillStyle = color;
        var pos = playerPos.GetPostion(progress);
        var center = { x: (pos.x + 0.5) * this.scale, y: (pos.y + 0.5) * this.scale };
        var delta = playerPos.GetDelta();
        ctx.beginPath();
        ctx.moveTo(center.x - delta.x * 25, center.y - delta.y * 25);
        ctx.lineTo(center.x + (delta.y === 0 ? 0 : 3), center.y + (delta.x === 0 ? 0 : 3));
        ctx.lineTo(center.x + (delta.y === 0 ? 0 : -3), center.y + (delta.x === 0 ? 0 : -3));
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(center.x, center.y, size, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
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
var PlayerPosition = (function () {
    function PlayerPosition(x, y) {
        this.currentPos = { x: x, y: y };
        this.nextPos = { x: x, y: y };
    }
    PlayerPosition.prototype.SetPos = function (x, y) {
        this.currentPos.x = this.nextPos.x;
        this.currentPos.y = this.nextPos.y;
        this.nextPos.x = x;
        this.nextPos.y = y;
    };
    PlayerPosition.prototype.GetPostion = function (progress) {
        return {
            x: (this.currentPos.x * (1 - progress) + this.nextPos.x * progress),
            y: (this.currentPos.y * (1 - progress) + this.nextPos.y * progress)
        };
    };
    PlayerPosition.prototype.GetDelta = function () {
        return {
            x: (this.nextPos.x - this.currentPos.x),
            y: (this.nextPos.y - this.currentPos.y)
        };
    };
    return PlayerPosition;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjI2OGUwNjc0NmI4ZWQ0ZDVkMjkiLCJ3ZWJwYWNrOi8vLy4vU2NyaXB0cy9BcmVhQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly8vLi9TY3JpcHRzL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9TY3JpcHRzL2tleV9jb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQy9EQSwyQ0FBc0M7QUFFdEM7SUFJSSx3QkFBbUIsUUFBNkI7UUFIeEMsVUFBSyxHQUFrQyxFQUFFLENBQUM7UUFDMUMsZ0JBQVcsR0FBVSxJQUFJLENBQUM7UUFHOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxjQUFNLFdBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUF6QixDQUF5QixDQUFDO1FBQ3hELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsY0FBTSxXQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBekIsQ0FBeUIsQ0FBQztRQUN4RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLGNBQU0sV0FBSSxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQXRCLENBQXNC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Q0FBQyxFQUFFLENBQUM7WUFDeEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBRTNDLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQztnQkFDN0MsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUM7Z0JBQ3BELElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUM7Z0JBQzdELElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDO2dCQUV0RCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENB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O0lBQ1Ysd0NBQVU7SUFDVixnREFBYztJQUNkLGtEQUFlO0lBQ2YsMENBQVc7SUFDWCw4Q0FBYTtJQUNiLDhDQUFhO0lBQ2IsOENBQWE7SUFDYiw4Q0FBYTtJQUNiLCtDQUFjO0lBQ2QsK0NBQWM7SUFDZCwrQ0FBYztJQUNkLCtDQUFjO0lBQ2QsK0NBQWM7SUFDZCwrQ0FBYztJQUNkLCtDQUFjO0lBQ2QscUNBQVM7SUFDVCwrQ0FBYztJQUNkLDZDQUFhO0lBQ2IsMkNBQVk7SUFDWixtQ0FBUTtJQUNSLG1DQUFRO0lBQ1IsbUNBQVE7SUFDUixtQ0FBUTtJQUNSLG1DQUFRO0lBQ1IsbUNBQVE7SUFDUixtQ0FBUTtJQUNSLG1DQUFRO0lBQ1IsbUNBQVE7SUFDUixxQ0FBUztJQUNULHFDQUFTO0lBQ1QscUNBQVM7SUFDVCwrQ0FBYztJQUNkLHFEQUFpQjtJQUNqQixpREFBZTtJQUNmLDJDQUFZO0lBQ1oseUNBQVc7SUFDWCx1Q0FBVTtJQUNWLDJDQUFZO0lBQ1oseURBQW1CO0lBQ25CLHVEQUFrQjtJQUNsQix1REFBa0I7SUFDbEIsbURBQWdCO0lBQ2hCLHlEQUFtQjtJQUNuQix1REFBa0I7QUFDdEIsQ0FBQyxFQXBHVyxPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUFvR2xCO0FBQUEsQ0FBQyIsImZpbGUiOiIuL3d3d3Jvb3QvanMvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBmMjY4ZTA2NzQ2YjhlZDRkNWQyOSIsImltcG9ydCB7SUFyZWF9IGZyb20gXCIuL0lBcmVhLnRzXCI7XHJcbmltcG9ydCB7S2V5Q29kZX0gZnJvbSBcIi4va2V5X2NvZGUudHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBcmVhQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIGFyZWFzOiB7IFtpZDogc3RyaW5nXTogKCkgPT4gSUFyZWEgfSA9IHt9O1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50QXJlYTogSUFyZWEgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuYXJlYXNbXCJsb2FkaW5nXCJdID0gKCkgPT4gbmV3IExvYWRpbmdBcmVhKHNlbmREYXRhKTtcclxuICAgICAgICB0aGlzLmFyZWFzW1wid2VsY29tZVwiXSA9ICgpID0+IG5ldyBXZWxjb21lQXJlYShzZW5kRGF0YSk7XHJcbiAgICAgICAgdGhpcy5hcmVhc1tcImdhbWVcIl0gPSAoKSA9PiBuZXcgR2FtZUFyZWEoc2VuZERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnb3RvQXJlYShhcmVhOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50QXJlYSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFyZWEubGVhdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudEFyZWEgPSB0aGlzLmFyZWFzW2FyZWFdKCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QXJlYS5lbnRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcm9jZXNzKGRhdGE6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGlmIChkYXRhLmNvbW1hbmQgPT09IFwiZ290b1wiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ290b0FyZWEoZGF0YS5hcmVhKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEFyZWEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBcmVhLnByb2Nlc3MoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBMb2FkaW5nQXJlYSBpbXBsZW1lbnRzIElBcmVhIHtcclxuICAgIHByaXZhdGUgc2VuZERhdGE6IChkYXRhOiBhbnkpID0+IHZvaWQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YSA9IHNlbmREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnRlcigpIHtcclxuICAgICAgICB0aGlzLnNlbmREYXRhKEpTT04uc3RyaW5naWZ5KHsgVHlwZTogXCJ0b2tlblwiLCBUb2tlbjogbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKSB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxlYXZlKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcm9jZXNzKGRhdGE6IGFueSkge1xyXG4gICAgICAgIGlmIChkYXRhLmNvbW1hbmQgPT09IFwic2V0VG9rZW5cIikge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRva2VuXCIsIGRhdGEudG9rZW4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNsYXNzIFdlbGNvbWVBcmVhIGltcGxlbWVudHMgSUFyZWEge1xyXG4gICAgcHJpdmF0ZSBzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3Ioc2VuZERhdGE6IChkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLnNlbmREYXRhID0gc2VuZERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudGVyKCkge1xyXG4gICAgICAgICQoXCIjbWFpbi1jb250ZW50XCIpLmh0bWwoJChcIiN3ZWxjb21lLWFyZWEtdGVtcGFsdGVcIikuaHRtbCgpKTtcclxuICAgICAgICAkKFwiLndlbGNvbWUtcGxheS1idXR0b25cIikub24oXCJjbGlja1wiLCAoYXJnOiBKUXVlcnlFdmVudE9iamVjdCkgPT4gdGhpcy5vbkNsaWNrKGFyZykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkNsaWNrKGFyZzogSlF1ZXJ5RXZlbnRPYmplY3QpIHtcclxuICAgICAgICBjb25zdCBuYW1lID0gJChcIndlbGNvbWUtcGxheWVyLW5hbWVcIikudmFsKCk7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YShKU09OLnN0cmluZ2lmeSh7IFR5cGU6IFwiUGxheWVyTmFtZVwiLCBOYW1lOiBuYW1lIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGVhdmUoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByb2Nlc3MoZGF0YTogYW55KSB7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY2xhc3MgR2FtZUFyZWEgaW1wbGVtZW50cyBJQXJlYSB7XHJcbiAgICBwcml2YXRlIHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkO1xyXG4gICAgcHJpdmF0ZSBvbktleURvd25IYW5kbGVyID0gKGFyZzogSlF1ZXJ5RXZlbnRPYmplY3QpID0+IHRoaXMub25LZXlEb3duKGFyZyk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YSA9IHNlbmREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnRlcigpIHtcclxuICAgICAgICAkKFwiI21haW4tY29udGVudFwiKS5odG1sKCQoXCIjZ2FtZS1hcmVhLXRlbXBhbHRlXCIpLmh0bWwoKSk7XHJcbiAgICAgICAgJChkb2N1bWVudCkub24oXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duSGFuZGxlcik7XHJcbiAgICAgICAgJChcIi5nYW1lLWdhbWVvdmVyLXNjcmVlbi1idXR0b25cIikub24oXCJjbGlja1wiLCAoYXJnOiBKUXVlcnlFdmVudE9iamVjdCkgPT4gdGhpcy5vblBsYXlBZ2FpbihhcmcpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGVhdmUoKSB7XHJcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bkhhbmRsZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uS2V5RG93bihlOiBKUXVlcnlFdmVudE9iamVjdCkge1xyXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT0gS2V5Q29kZS5ET1dOX0FSUk9XXHJcbiAgICAgICAgICAgIHx8IGUua2V5Q29kZSA9PSBLZXlDb2RlLlVQX0FSUk9XXHJcbiAgICAgICAgICAgIHx8IGUua2V5Q29kZSA9PSBLZXlDb2RlLkxFRlRfQVJST1dcclxuICAgICAgICAgICAgfHwgZS5rZXlDb2RlID09IEtleUNvZGUuUklHSFRfQVJST1cpIHtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IEtleUNvZGUuRE9XTl9BUlJPVyB8fCBlLmtleUNvZGUgPT09IEtleUNvZGUuS0VZX1MpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kS2V5KFwiRG93blwiLCBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gS2V5Q29kZS5VUF9BUlJPVyB8fCBlLmtleUNvZGUgPT09IEtleUNvZGUuS0VZX1cpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kS2V5KFwiVXBcIiwgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IEtleUNvZGUuTEVGVF9BUlJPVyB8fCBlLmtleUNvZGUgPT09IEtleUNvZGUuS0VZX0EpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kS2V5KFwiTGVmdFwiLCBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gS2V5Q29kZS5SSUdIVF9BUlJPVyB8fCBlLmtleUNvZGUgPT09IEtleUNvZGUuS0VZX0QpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kS2V5KFwiUmlnaHRcIiwgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25QbGF5QWdhaW4oZTogSlF1ZXJ5RXZlbnRPYmplY3QpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YShKU09OLnN0cmluZ2lmeSh7IHR5cGU6IFwicGxheUFnYWluXCIgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbmRLZXkoa2V5OiBzdHJpbmcsIGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YShKU09OLnN0cmluZ2lmeSh7IHR5cGU6IFwia2V5RG93blwiLCBDb21tYW5kOiBrZXkgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcm9jZXNzKGRhdGE6IGFueSkge1xyXG4gICAgICAgIGlmIChkYXRhLmNvbW1hbmQgPT09IFwid2FpdE9wcG9uZW50XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFwid2FpdE9wcG9uZW50XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkYXRhLmNvbW1hbmQgPT09IFwibWF6ZUZlaWxkXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFwibWF6ZUZlaWxkXCI7XHJcbiAgICAgICAgICAgIHRoaXMubWF6ZUZpZWxkID0gZGF0YTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0xvb3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRhdGEuY29tbWFuZCA9PT0gXCJnYW1lT3ZlclwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBcImdhbWVPdmVyXCI7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRhdGEuY29tbWFuZCA9PT0gXCJwbGF5ZXJTdGF0ZVwiKVxyXG4gICAgICAgICAgICB0aGlzLm1vdmVUbyhkYXRhLm15UG9zLCBkYXRhLmVuZW15UG9zKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIG1hemVGaWVsZDogYW55O1xyXG4gICAgcHJpdmF0ZSBnYW1lT3ZlcjogYW55O1xyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyKCkge1xyXG4gICAgICAgICQoXCIjZ2FtZS13YWl0LXNjcmVlblwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCB0aGlzLnN0YXRlICE9PSBcIndhaXRPcHBvbmVudFwiKTtcclxuICAgICAgICAkKFwiI2dhbWUtY2FudmFzLXNjcmVlblwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCB0aGlzLnN0YXRlICE9PSBcIm1hemVGZWlsZFwiKTtcclxuICAgICAgICAkKFwiI2dhbWUtZ2FtZW92ZXItc2NyZWVuXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZGVuXCIsIHRoaXMuc3RhdGUgIT09IFwiZ2FtZU92ZXJcIik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBcIm1hemVGZWlsZFwiKSB7XHJcbiAgICAgICAgICAgICQoXCIuZ2FtZS1jYW52YXMtbXktbmFtZVwiKS50ZXh0KHRoaXMubWF6ZUZpZWxkLm1lLm5hbWUpLnByb3AoXCJ0aXRsZVwiLCB0aGlzLm1hemVGaWVsZC5tZS5uYW1lKTtcclxuICAgICAgICAgICAgJChcIi5nYW1lLWNhbnZhcy1teS1yYXRpbmdcIikudGV4dCh0aGlzLm1hemVGaWVsZC5tZS5yYXRpbmcpO1xyXG4gICAgICAgICAgICAkKFwiLmdhbWUtY2FudmFzLWVuZW15LW5hbWVcIikudGV4dCh0aGlzLm1hemVGaWVsZC5lbmVteS5uYW1lKS5wcm9wKFwidGl0bGVcIiwgdGhpcy5tYXplRmllbGQuZW5lbXkubmFtZSk7XHJcbiAgICAgICAgICAgICQoXCIuZ2FtZS1jYW52YXMtZW5lbXktcmF0aW5nXCIpLnRleHQodGhpcy5tYXplRmllbGQuZW5lbXkucmF0aW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBcImdhbWVPdmVyXCIpIHtcclxuICAgICAgICAgICAgJChcIiNnYW1lLWdhbWVvdmVyLXNjcmVlbiAud2lubmVyXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZGVuXCIsIHRoaXMuZ2FtZU92ZXIuc3RhdHVzID09PSBcIndpblwiKTtcclxuICAgICAgICAgICAgJChcIiNnYW1lLWdhbWVvdmVyLXNjcmVlbiAubG9vc2VyXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZGVuXCIsIHRoaXMuZ2FtZU92ZXIuc3RhdHVzICE9PSBcIndpblwiKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lT3Zlci5yYXRpbmdzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByYXRpbmcgPSB0aGlzLmdhbWVPdmVyLnJhdGluZ3NbaV07XHJcbiAgICAgICAgICAgICAgICAkKFwiLmdhbWUtY2FudmFzLXJhdGluZ3NcIikuYXBwZW5kKGA8dHI+PHRkPiR7aSArIDF9PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48L3RyPmApO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGxzID0gJChcIi5nYW1lLWNhbnZhcy1yYXRpbmdzXCIpLmNoaWxkcmVuKCkubGFzdCgpLmNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgICAgICBjZWxscy5lcSgxKS50ZXh0KHJhdGluZy5uYW1lKS5wcm9wKFwidGl0bGVcIiwgcmF0aW5nLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgY2VsbHMuZXEoMikudGV4dChyYXRpbmcucmF0aW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlcnZlclRpbWUgPSAwO1xyXG4gICAgcHJpdmF0ZSBwbGF5ZXJQb3M6IFBsYXllclBvc2l0aW9uO1xyXG4gICAgcHJpdmF0ZSBlbmVteVBvczogUGxheWVyUG9zaXRpb247XHJcblxyXG4gICAgcHJpdmF0ZSBtb3ZlVG8obXlQb3MsIGVuZW15UG9zKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZW5lbXlQb3MgPT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5lbmVteVBvcyA9IG5ldyBQbGF5ZXJQb3NpdGlvbihlbmVteVBvcy54LCBlbmVteVBvcy55KTtcclxuICAgICAgICB0aGlzLmVuZW15UG9zLlNldFBvcyhlbmVteVBvcy54LCBlbmVteVBvcy55KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyUG9zID09IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyUG9zID0gbmV3IFBsYXllclBvc2l0aW9uKG15UG9zLngsIG15UG9zLnkpO1xyXG5cclxuICAgICAgICB0aGlzLnBsYXllclBvcy5TZXRQb3MobXlQb3MueCwgbXlQb3MueSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2VydmVyVGltZSA9IERhdGUubm93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzY2FsZSA9IDIwO1xyXG5cclxuICAgIHByaXZhdGUgZHJhd09uKHQpIHtcclxuICAgICAgICBjb25zdCBzY2FsZSA9IHRoaXMuc2NhbGU7XHJcbiAgICAgICAgY29uc3QgbWF6ZUZpZWxkID0gdGhpcy5tYXplRmllbGQuZmllbGRcclxuXHJcbiAgICAgICAgdmFyIGN0eCA9ICgkKFwiI2dhbWUtY2FudmFzXCIpWzBdIGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcclxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGN0eC5jYW52YXMud2lkdGgsIGN0eC5jYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAxMC41LCAxMC41KTtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDM7XHJcbiAgICAgICAgY3R4LmxpbmVDYXAgPSBcInJvdW5kXCI7XHJcbiAgICAgICAgLy9jdHguc3Ryb2tlU3R5bGUgPSBcIiMyMjdGMzJcIjtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcIiMzMzNcIjtcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IG1hemVGaWVsZC5sZW5ndGg7ICsreSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IG1hemVGaWVsZFt5XS5sZW5ndGg7ICsreCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0b3BMZWZ0ID0geyB4OiB4ICogc2NhbGUsIHk6IHkgKiBzY2FsZSB9O1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvcFJpZ2h0ID0geyB4OiAoeCArIDEpICogc2NhbGUsIHk6IHkgKiBzY2FsZSB9O1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdHRvbVJpZ2h0ID0geyB4OiAoeCArIDEpICogc2NhbGUsIHk6ICh5ICsgMSkgKiBzY2FsZSB9O1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdHRvbUxlZnQgPSB7IHg6IHggKiBzY2FsZSwgeTogKHkgKyAxKSAqIHNjYWxlIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKChtYXplRmllbGRbeV1beF0gJiAxKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8odG9wTGVmdC54LCB0b3BMZWZ0LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8odG9wUmlnaHQueCwgdG9wUmlnaHQueSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKChtYXplRmllbGRbeV1beF0gJiAyKSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8odG9wUmlnaHQueCwgdG9wUmlnaHQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhib3R0b21SaWdodC54LCBib3R0b21SaWdodC55KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKG1hemVGaWVsZFt5XVt4XSAmIDQpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhib3R0b21SaWdodC54LCBib3R0b21SaWdodC55KTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKGJvdHRvbUxlZnQueCwgYm90dG9tTGVmdC55KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKG1hemVGaWVsZFt5XVt4XSAmIDgpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhib3R0b21MZWZ0LngsIGJvdHRvbUxlZnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh0b3BMZWZ0LngsIHRvcExlZnQueSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJQb3MgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLkRyYXdQbGF5ZXIodGhpcy5wbGF5ZXJQb3MsIGN0eCwgdCwgXCIjMjI3RjMyXCIsIDQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZW5lbXlQb3MgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLkRyYXdQbGF5ZXIodGhpcy5lbmVteVBvcywgY3R4LCB0LCBcIiNiZjBkMzFcIiwgMyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgRHJhd1BsYXllcihwbGF5ZXJQb3M6IFBsYXllclBvc2l0aW9uLCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcHJvZ3Jlc3M6IG51bWJlciwgY29sb3I6IHN0cmluZywgc2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG5cclxuICAgICAgICBjb25zdCBwb3MgPSBwbGF5ZXJQb3MuR2V0UG9zdGlvbihwcm9ncmVzcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IHsgeDogKHBvcy54ICsgMC41KSAqIHRoaXMuc2NhbGUsIHk6IChwb3MueSArIDAuNSkgKiB0aGlzLnNjYWxlIH07XHJcbiAgICAgICAgY29uc3QgZGVsdGEgPSBwbGF5ZXJQb3MuR2V0RGVsdGEoKTtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhjZW50ZXIueCAtIGRlbHRhLnggKiAyNSwgY2VudGVyLnkgLSBkZWx0YS55ICogMjUpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oY2VudGVyLnggKyAoZGVsdGEueSA9PT0gMCA/IDAgOiAzKSwgY2VudGVyLnkgKyAoZGVsdGEueCA9PT0gMCA/IDAgOiAzKSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhjZW50ZXIueCArIChkZWx0YS55ID09PSAwID8gMCA6IC0zKSwgY2VudGVyLnkgKyAoZGVsdGEueCA9PT0gMCA/IDAgOiAtMykpO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmFyYyhjZW50ZXIueCwgY2VudGVyLnksIHNpemUsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3TG9vcCgpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gXCJtYXplRmVpbGRcIikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgICAgICB2YXIgdCA9IChub3cgLSB0aGlzLnNlcnZlclRpbWUpIC8gMTAwO1xyXG4gICAgICAgIHRoaXMuZHJhd09uKHQpO1xyXG5cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5kcmF3TG9vcCgpKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUGxheWVyUG9zaXRpb24ge1xyXG4gICAgcHVibGljIGN1cnJlbnRQb3M6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcclxuICAgIHB1YmxpYyBuZXh0UG9zOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UG9zID0geyB4OiB4LCB5OiB5IH1cclxuICAgICAgICB0aGlzLm5leHRQb3MgPSB7IHg6IHgsIHk6IHkgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBTZXRQb3MoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQb3MueCA9IHRoaXMubmV4dFBvcy54O1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBvcy55ID0gdGhpcy5uZXh0UG9zLnk7XHJcblxyXG4gICAgICAgIHRoaXMubmV4dFBvcy54ID0geDtcclxuICAgICAgICB0aGlzLm5leHRQb3MueSA9IHk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBHZXRQb3N0aW9uKHByb2dyZXNzOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiAodGhpcy5jdXJyZW50UG9zLnggKiAoMSAtIHByb2dyZXNzKSArIHRoaXMubmV4dFBvcy54ICogcHJvZ3Jlc3MpLFxyXG4gICAgICAgICAgICB5OiAodGhpcy5jdXJyZW50UG9zLnkgKiAoMSAtIHByb2dyZXNzKSArIHRoaXMubmV4dFBvcy55ICogcHJvZ3Jlc3MpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBHZXREZWx0YSgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiAodGhpcy5uZXh0UG9zLnggLSB0aGlzLmN1cnJlbnRQb3MueCksXHJcbiAgICAgICAgICAgIHk6ICh0aGlzLm5leHRQb3MueSAtIHRoaXMuY3VycmVudFBvcy55KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL1NjcmlwdHMvQXJlYUNvbnRyb2xsZXIudHMiLCJpbXBvcnQge0FyZWFDb250cm9sbGVyIH0gZnJvbSBcIi4vQXJlYUNvbnRyb2xsZXIudHNcIjtcclxuXHJcbmxldCBjb250cm9sbGVyID0gbmV3IEFyZWFDb250cm9sbGVyKHNlbmRNZXNzYWdlKTtcclxuXHJcblxyXG52YXIgdXJpID0gXCJ3czovL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyBcIi90ZXN0XCI7XHJcbmxldCBzb2NrZXQ6IFdlYlNvY2tldDtcclxuZnVuY3Rpb24gY29ubmVjdCgpIHtcclxuICAgIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJpKTtcclxuICAgIHNvY2tldC5vbm9wZW4gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9wZW5lZCBjb25uZWN0aW9uIHRvIFwiICsgdXJpKTtcclxuICAgICAgICBjb250cm9sbGVyLmdvdG9BcmVhKFwibG9hZGluZ1wiKTtcclxuICAgIH07XHJcbiAgICBzb2NrZXQub25jbG9zZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2xvc2VkIGNvbm5lY3Rpb24gZnJvbSBcIiArIHVyaSk7XHJcbiAgICB9O1xyXG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIC8vYXBwZW5kSXRlbShsaXN0LCBldmVudC5kYXRhKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhKTtcclxuXHJcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XHJcblxyXG4gICAgICAgIGNvbnRyb2xsZXIucHJvY2VzcyhyZXMpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAvL2lmIChyZXMuY29tbWFuZCA9PSBcImdldFRva2VuXCIpXHJcbiAgICAgICAgLy8gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlblwiLCByZXMuVG9rZW4pO1xyXG5cclxuXHJcbiAgICAgICAgLy9pZiAocmVzLmNvbW1hbmQgPT09IFwicGxheWVyU3RhdGVcIilcclxuICAgICAgICAvLyAgICBtb3ZlVG8ocmVzLm15UG9zLCByZXMuZW5lbXlQb3MpO1xyXG4gICAgICAgIC8vZWxzZSBpZiAocmVzLmNvbW1hbmQgPT09IFwibWF6ZUZlaWxkXCIpXHJcbiAgICAgICAgLy8gICAgc2V0RmllbGQocmVzLmZpZWxkKVxyXG4gICAgICAgIC8vZWxzZSBpZiAocmVzLmNvbW1hbmQgPT0gXCJnZXRUb2tlblwiKVxyXG4gICAgICAgIC8vICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidG9rZW5cIiwgcmVzLlRva2VuKVxyXG4gICAgICAgIC8vZWxzZSBpZiAocmVzLmNvbW1hbmQgPT0gXCJnYW1lT3dlclwiKVxyXG4gICAgICAgIC8vICAgIGluR2FtZSA9IGZhbHNlO1xyXG5cclxuICAgIH07XHJcbiAgICBzb2NrZXQub25lcnJvciA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IFwiICsgZXZlbnQucmV0dXJuVmFsdWUpO1xyXG4gICAgfTtcclxufVxyXG5jb25uZWN0KCk7XHJcbmZ1bmN0aW9uIHNlbmRNZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZzogXCIgKyBtZXNzYWdlKTtcclxuICAgIHNvY2tldC5zZW5kKG1lc3NhZ2UpO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vU2NyaXB0cy9hcHAudHMiLCJleHBvcnQgZW51bSBLZXlDb2RlIHtcclxuICAgIEJBQ0tTUEFDRSA9IDgsXHJcbiAgICBUQUIgPSA5LFxyXG4gICAgRU5URVIgPSAxMyxcclxuICAgIFNISUZUID0gMTYsXHJcbiAgICBDVFJMID0gMTcsXHJcbiAgICBBTFQgPSAxOCxcclxuICAgIFBBVVNFID0gMTksXHJcbiAgICBDQVBTX0xPQ0sgPSAyMCxcclxuICAgIEVTQ0FQRSA9IDI3LFxyXG4gICAgU1BBQ0UgPSAzMixcclxuICAgIFBBR0VfVVAgPSAzMyxcclxuICAgIFBBR0VfRE9XTiA9IDM0LFxyXG4gICAgRU5EID0gMzUsXHJcbiAgICBIT01FID0gMzYsXHJcbiAgICBMRUZUX0FSUk9XID0gMzcsXHJcbiAgICBVUF9BUlJPVyA9IDM4LFxyXG4gICAgUklHSFRfQVJST1cgPSAzOSxcclxuICAgIERPV05fQVJST1cgPSA0MCxcclxuICAgIElOU0VSVCA9IDQ1LFxyXG4gICAgREVMRVRFID0gNDYsXHJcbiAgICBLRVlfMCA9IDQ4LFxyXG4gICAgS0VZXzEgPSA0OSxcclxuICAgIEtFWV8yID0gNTAsXHJcbiAgICBLRVlfMyA9IDUxLFxyXG4gICAgS0VZXzQgPSA1MixcclxuICAgIEtFWV81ID0gNTMsXHJcbiAgICBLRVlfNiA9IDU0LFxyXG4gICAgS0VZXzcgPSA1NSxcclxuICAgIEtFWV84ID0gNTYsXHJcbiAgICBLRVlfOSA9IDU3LFxyXG4gICAgS0VZX0EgPSA2NSxcclxuICAgIEtFWV9CID0gNjYsXHJcbiAgICBLRVlfQyA9IDY3LFxyXG4gICAgS0VZX0QgPSA2OCxcclxuICAgIEtFWV9FID0gNjksXHJcbiAgICBLRVlfRiA9IDcwLFxyXG4gICAgS0VZX0cgPSA3MSxcclxuICAgIEtFWV9IID0gNzIsXHJcbiAgICBLRVlfSSA9IDczLFxyXG4gICAgS0VZX0ogPSA3NCxcclxuICAgIEtFWV9LID0gNzUsXHJcbiAgICBLRVlfTCA9IDc2LFxyXG4gICAgS0VZX00gPSA3NyxcclxuICAgIEtFWV9OID0gNzgsXHJcbiAgICBLRVlfTyA9IDc5LFxyXG4gICAgS0VZX1AgPSA4MCxcclxuICAgIEtFWV9RID0gODEsXHJcbiAgICBLRVlfUiA9IDgyLFxyXG4gICAgS0VZX1MgPSA4MyxcclxuICAgIEtFWV9UID0gODQsXHJcbiAgICBLRVlfVSA9IDg1LFxyXG4gICAgS0VZX1YgPSA4NixcclxuICAgIEtFWV9XID0gODcsXHJcbiAgICBLRVlfWCA9IDg4LFxyXG4gICAgS0VZX1kgPSA4OSxcclxuICAgIEtFWV9aID0gOTAsXHJcbiAgICBMRUZUX01FVEEgPSA5MSxcclxuICAgIFJJR0hUX01FVEEgPSA5MixcclxuICAgIFNFTEVDVCA9IDkzLFxyXG4gICAgTlVNUEFEXzAgPSA5NixcclxuICAgIE5VTVBBRF8xID0gOTcsXHJcbiAgICBOVU1QQURfMiA9IDk4LFxyXG4gICAgTlVNUEFEXzMgPSA5OSxcclxuICAgIE5VTVBBRF80ID0gMTAwLFxyXG4gICAgTlVNUEFEXzUgPSAxMDEsXHJcbiAgICBOVU1QQURfNiA9IDEwMixcclxuICAgIE5VTVBBRF83ID0gMTAzLFxyXG4gICAgTlVNUEFEXzggPSAxMDQsXHJcbiAgICBOVU1QQURfOSA9IDEwNSxcclxuICAgIE1VTFRJUExZID0gMTA2LFxyXG4gICAgQUREID0gMTA3LFxyXG4gICAgU1VCVFJBQ1QgPSAxMDksXHJcbiAgICBERUNJTUFMID0gMTEwLFxyXG4gICAgRElWSURFID0gMTExLFxyXG4gICAgRjEgPSAxMTIsXHJcbiAgICBGMiA9IDExMyxcclxuICAgIEYzID0gMTE0LFxyXG4gICAgRjQgPSAxMTUsXHJcbiAgICBGNSA9IDExNixcclxuICAgIEY2ID0gMTE3LFxyXG4gICAgRjcgPSAxMTgsXHJcbiAgICBGOCA9IDExOSxcclxuICAgIEY5ID0gMTIwLFxyXG4gICAgRjEwID0gMTIxLFxyXG4gICAgRjExID0gMTIyLFxyXG4gICAgRjEyID0gMTIzLFxyXG4gICAgTlVNX0xPQ0sgPSAxNDQsXHJcbiAgICBTQ1JPTExfTE9DSyA9IDE0NSxcclxuICAgIFNFTUlDT0xPTiA9IDE4NixcclxuICAgIEVRVUFMUyA9IDE4NyxcclxuICAgIENPTU1BID0gMTg4LFxyXG4gICAgREFTSCA9IDE4OSxcclxuICAgIFBFUklPRCA9IDE5MCxcclxuICAgIEZPUldBUkRfU0xBU0ggPSAxOTEsXHJcbiAgICBHUkFWRV9BQ0NFTlQgPSAxOTIsXHJcbiAgICBPUEVOX0JSQUNLRVQgPSAyMTksXHJcbiAgICBCQUNLX1NMQVNIID0gMjIwLFxyXG4gICAgQ0xPU0VfQlJBQ0tFVCA9IDIyMSxcclxuICAgIFNJTkdMRV9RVU9URSA9IDIyMlxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL1NjcmlwdHMva2V5X2NvZGUudHMiXSwic291cmNlUm9vdCI6IiJ9