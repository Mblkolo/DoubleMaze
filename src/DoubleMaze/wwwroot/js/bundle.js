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
        this.areas["wait"] = function () { return new WaitArea(sendData); };
        this.areas["game"] = function () { return new GameArea(sendData); };
        this.areas["return"] = function () { return new ReturnArea(sendData); };
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
        $("#main-content").html($("#welcome-area-template").html());
        $(".welcome-play-button").on("click", function (arg) { return _this.onClick(arg); });
    };
    WelcomeArea.prototype.onClick = function (arg) {
        var name = $(".welcome-player-name").val();
        this.sendData(JSON.stringify({ Type: "PlayerName", Name: name }));
    };
    WelcomeArea.prototype.leave = function () {
    };
    WelcomeArea.prototype.process = function (data) {
    };
    return WelcomeArea;
}());
var WaitArea = (function () {
    function WaitArea(sendData) {
        this.sendData = sendData;
    }
    WaitArea.prototype.enter = function () {
        $("#main-content").html($("#wait-area-template").html());
    };
    WaitArea.prototype.leave = function () {
    };
    WaitArea.prototype.process = function (data) {
        if (data.command === "showBots") {
            for (var i = 0; i < data.bots.length; ++i) {
                var bot = data.bots[i];
                $(".wait-game-bots").append("<tr><td>" + (i + 1) + "</td><td></td><td></td><td></td></tr>");
                var cells = $(".wait-game-bots").children().last().children();
                cells.eq(1).text(bot.name).prop("title", bot.name);
                cells.eq(2).text(bot.rating);
                if (bot.isAwaible) {
                    cells.eq(3).append("<a href=\"#play\" class=\"link-button\">Играть</a>");
                }
                else {
                    cells.eq(3).text("В игре");
                }
            }
        }
    };
    return WaitArea;
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
        $("#main-content").html($("#game-area-template").html());
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
        $("#wait-game-screen").toggleClass("hidden", this.state !== "waitOpponent");
        $("#game-canvas-screen").toggleClass("hidden", this.state !== "mazeFeild");
        $("#game-gameover-screen").toggleClass("hidden", this.state !== "gameOver");
        if (this.state === "mazeFeild") {
            $(".game-canvas-my-name").text(this.mazeField.me.name).prop("title", this.mazeField.me.name);
            $(".game-canvas-my-rating").text(this.mazeField.me.rating);
            $(".game-canvas-enemy-name").text(this.mazeField.enemy.name).prop("title", this.mazeField.enemy.name);
            $(".game-canvas-enemy-rating").text(this.mazeField.enemy.rating);
        }
        if (this.state === "gameOver") {
            $("#game-gameover-screen .winner").toggleClass("hidden", this.gameOver.status !== "win");
            $("#game-gameover-screen .looser").toggleClass("hidden", this.gameOver.status === "win");
            for (var i = 0; i < this.gameOver.ratings.length; ++i) {
                var rating = this.gameOver.ratings[i];
                $(".game-canvas-ratings").append("<tr><td>" + (i + 1) + "</td><td></td><td></td></tr>");
                var cells = $(".game-canvas-ratings").children().last().children();
                cells.eq(1).text(rating.name).prop("title", rating.name);
                cells.eq(2).text(rating.rating);
                if (rating.isMe)
                    cells.eq(0).addClass("my-name");
                if (rating.isEnemy)
                    cells.eq(0).addClass("enemy-name");
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
var ReturnArea = (function () {
    function ReturnArea(sendData) {
        this.sendData = sendData;
    }
    ReturnArea.prototype.enter = function () {
        var _this = this;
        $("#main-content").html($("#return-area-template").html());
        $(".return-page__play-again-button").on("click", function (arg) { return _this.onClick("playAgain"); });
        $(".return-page__reset-button").on("click", function (arg) { return _this.onClick("resetPlayer"); });
    };
    ReturnArea.prototype.onClick = function (typeCommand) {
        this.sendData(JSON.stringify({ Type: typeCommand }));
    };
    ReturnArea.prototype.leave = function () {
    };
    ReturnArea.prototype.process = function (data) {
        if (data.command === "playerInfo") {
            this.playerInfo = data;
            this.render();
        }
    };
    ReturnArea.prototype.render = function () {
        if (this.playerInfo != null) {
            $(".return-page__my-name").text(this.playerInfo.name);
            $(".return-page__my-rating").text(this.playerInfo.rating);
        }
    };
    return ReturnArea;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDI2N2EyYjgxZDNlMmNjNmE4MWUiLCJ3ZWJwYWNrOi8vLy4vU2NyaXB0cy9BcmVhQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly8vLi9TY3JpcHRzL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9TY3JpcHRzL2tleV9jb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQy9EQSwyQ0FBc0M7QUFFdEM7SUFJSSx3QkFBbUIsUUFBNkI7UUFIeEMsVUFBSyxHQUFrQyxFQUFFLENBQUM7UUFDMUMsZ0JBQVcsR0FBVSxJQUFJLENBQUM7UUFHOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxjQUFNLFdBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUF6QixDQUF5QixDQUFDO1FBQ3hELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsY0FBTSxXQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBekIsQ0FBeUIsQ0FBQztRQUN4RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLGNBQU0sV0FBSSxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQXRCLENBQXNC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QztRQUV0QixJQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTNDLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2hGLElBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNuQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM3RCxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25GLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFWCxHQUFH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SUFDZCxxQ0FBUztJQUNULCtDQUFjO0lBQ2QsNkNBQWE7SUFDYiwyQ0FBWTtJQUNaLG1DQUFRO0lBQ1IsbUNBQVE7SUFDUixtQ0FBUTtJQUNSLG1DQUFRO0lBQ1IsbUNBQVE7SUFDUixtQ0FBUTtJQUNSLG1DQUFRO0lBQ1IsbUNBQVE7SUFDUixtQ0FBUTtJQUNSLHFDQUFTO0lBQ1QscUNBQVM7SUFDVCxxQ0FBUztJQUNULCtDQUFjO0lBQ2QscURBQWlCO0lBQ2pCLGlEQUFlO0lBQ2YsMkNBQVk7SUFDWix5Q0FBVztJQUNYLHVDQUFVO0lBQ1YsMkNBQVk7SUFDWix5REFBbUI7SUFDbkIsdURBQWtCO0lBQ2xCLHVEQUFrQjtJQUNsQixtREFBZ0I7SUFDaEIseURBQW1CO0lBQ25CLHVEQUFrQjtBQUN0QixDQUFDLEVBcEdXLE9BQU8sR0FBUCxlQUFPLEtBQVAsZUFBTyxRQW9HbEI7QUFBQSxDQUFDIiwiZmlsZSI6Ii4vd3d3cm9vdC9qcy9idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQyNjdhMmI4MWQzZTJjYzZhODFlIiwiaW1wb3J0IHtJQXJlYX0gZnJvbSBcIi4vSUFyZWEudHNcIjtcclxuaW1wb3J0IHtLZXlDb2RlfSBmcm9tIFwiLi9rZXlfY29kZS50c1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFyZWFDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgYXJlYXM6IHsgW2lkOiBzdHJpbmddOiAoKSA9PiBJQXJlYSB9ID0ge307XHJcbiAgICBwcml2YXRlIGN1cnJlbnRBcmVhOiBJQXJlYSA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5hcmVhc1tcImxvYWRpbmdcIl0gPSAoKSA9PiBuZXcgTG9hZGluZ0FyZWEoc2VuZERhdGEpO1xyXG4gICAgICAgIHRoaXMuYXJlYXNbXCJ3ZWxjb21lXCJdID0gKCkgPT4gbmV3IFdlbGNvbWVBcmVhKHNlbmREYXRhKTtcclxuICAgICAgICB0aGlzLmFyZWFzW1wid2FpdFwiXSA9ICgpID0+IG5ldyBXYWl0QXJlYShzZW5kRGF0YSk7XHJcbiAgICAgICAgdGhpcy5hcmVhc1tcImdhbWVcIl0gPSAoKSA9PiBuZXcgR2FtZUFyZWEoc2VuZERhdGEpO1xyXG4gICAgICAgIHRoaXMuYXJlYXNbXCJyZXR1cm5cIl0gPSAoKSA9PiBuZXcgUmV0dXJuQXJlYShzZW5kRGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdvdG9BcmVhKGFyZWE6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRBcmVhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QXJlYS5sZWF2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50QXJlYSA9IHRoaXMuYXJlYXNbYXJlYV0oKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRBcmVhLmVudGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByb2Nlc3MoZGF0YTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGRhdGEuY29tbWFuZCA9PT0gXCJnb3RvXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5nb3RvQXJlYShkYXRhLmFyZWEpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50QXJlYSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFyZWEucHJvY2VzcyhkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIExvYWRpbmdBcmVhIGltcGxlbWVudHMgSUFyZWEge1xyXG4gICAgcHJpdmF0ZSBzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3Ioc2VuZERhdGE6IChkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLnNlbmREYXRhID0gc2VuZERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudGVyKCkge1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEoSlNPTi5zdHJpbmdpZnkoeyBUeXBlOiBcInRva2VuXCIsIFRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGVhdmUoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByb2Nlc3MoZGF0YTogYW55KSB7XHJcbiAgICAgICAgaWYgKGRhdGEuY29tbWFuZCA9PT0gXCJzZXRUb2tlblwiKSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidG9rZW5cIiwgZGF0YS50b2tlbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY2xhc3MgV2VsY29tZUFyZWEgaW1wbGVtZW50cyBJQXJlYSB7XHJcbiAgICBwcml2YXRlIHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEgPSBzZW5kRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW50ZXIoKSB7XHJcbiAgICAgICAgJChcIiNtYWluLWNvbnRlbnRcIikuaHRtbCgkKFwiI3dlbGNvbWUtYXJlYS10ZW1wbGF0ZVwiKS5odG1sKCkpO1xyXG4gICAgICAgICQoXCIud2VsY29tZS1wbGF5LWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIChhcmc6IEpRdWVyeUV2ZW50T2JqZWN0KSA9PiB0aGlzLm9uQ2xpY2soYXJnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQ2xpY2soYXJnOiBKUXVlcnlFdmVudE9iamVjdCkge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSAkKFwiLndlbGNvbWUtcGxheWVyLW5hbWVcIikudmFsKCk7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YShKU09OLnN0cmluZ2lmeSh7IFR5cGU6IFwiUGxheWVyTmFtZVwiLCBOYW1lOiBuYW1lIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGVhdmUoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByb2Nlc3MoZGF0YTogYW55KSB7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY2xhc3MgV2FpdEFyZWEgaW1wbGVtZW50cyBJQXJlYSB7XHJcbiAgICBwcml2YXRlIHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEgPSBzZW5kRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW50ZXIoKSB7XHJcbiAgICAgICAgJChcIiNtYWluLWNvbnRlbnRcIikuaHRtbCgkKFwiI3dhaXQtYXJlYS10ZW1wbGF0ZVwiKS5odG1sKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsZWF2ZSgpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJvY2VzcyhkYXRhOiBhbnkpIHtcclxuICAgICAgICBpZiAoZGF0YS5jb21tYW5kID09PSBcInNob3dCb3RzXCIpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmJvdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdCA9IGRhdGEuYm90c1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKFwiLndhaXQtZ2FtZS1ib3RzXCIpLmFwcGVuZChgPHRyPjx0ZD4ke2kgKyAxfTwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PC90cj5gKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxscyA9ICQoXCIud2FpdC1nYW1lLWJvdHNcIikuY2hpbGRyZW4oKS5sYXN0KCkuY2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgICAgIGNlbGxzLmVxKDEpLnRleHQoYm90Lm5hbWUpLnByb3AoXCJ0aXRsZVwiLCBib3QubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjZWxscy5lcSgyKS50ZXh0KGJvdC5yYXRpbmcpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChib3QuaXNBd2FpYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbHMuZXEoMykuYXBwZW5kKFwiPGEgaHJlZj1cXFwiI3BsYXlcXFwiIGNsYXNzPVxcXCJsaW5rLWJ1dHRvblxcXCI+0JjQs9GA0LDRgtGMPC9hPlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGxzLmVxKDMpLnRleHQoXCLQkiDQuNCz0YDQtVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgR2FtZUFyZWEgaW1wbGVtZW50cyBJQXJlYSB7XHJcbiAgICBwcml2YXRlIHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkO1xyXG4gICAgcHJpdmF0ZSBvbktleURvd25IYW5kbGVyID0gKGFyZzogSlF1ZXJ5RXZlbnRPYmplY3QpID0+IHRoaXMub25LZXlEb3duKGFyZyk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YSA9IHNlbmREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnRlcigpIHtcclxuICAgICAgICAkKFwiI21haW4tY29udGVudFwiKS5odG1sKCQoXCIjZ2FtZS1hcmVhLXRlbXBsYXRlXCIpLmh0bWwoKSk7XHJcbiAgICAgICAgJChkb2N1bWVudCkub24oXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duSGFuZGxlcik7XHJcbiAgICAgICAgJChcIi5nYW1lLWdhbWVvdmVyLXNjcmVlbi1idXR0b25cIikub24oXCJjbGlja1wiLCAoYXJnOiBKUXVlcnlFdmVudE9iamVjdCkgPT4gdGhpcy5vblBsYXlBZ2FpbihhcmcpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbGVhdmUoKSB7XHJcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bkhhbmRsZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uS2V5RG93bihlOiBKUXVlcnlFdmVudE9iamVjdCkge1xyXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT0gS2V5Q29kZS5ET1dOX0FSUk9XXHJcbiAgICAgICAgICAgIHx8IGUua2V5Q29kZSA9PSBLZXlDb2RlLlVQX0FSUk9XXHJcbiAgICAgICAgICAgIHx8IGUua2V5Q29kZSA9PSBLZXlDb2RlLkxFRlRfQVJST1dcclxuICAgICAgICAgICAgfHwgZS5rZXlDb2RlID09IEtleUNvZGUuUklHSFRfQVJST1cpIHtcclxuXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IEtleUNvZGUuRE9XTl9BUlJPVyB8fCBlLmtleUNvZGUgPT09IEtleUNvZGUuS0VZX1MpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kS2V5KFwiRG93blwiLCBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gS2V5Q29kZS5VUF9BUlJPVyB8fCBlLmtleUNvZGUgPT09IEtleUNvZGUuS0VZX1cpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kS2V5KFwiVXBcIiwgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IEtleUNvZGUuTEVGVF9BUlJPVyB8fCBlLmtleUNvZGUgPT09IEtleUNvZGUuS0VZX0EpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kS2V5KFwiTGVmdFwiLCBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gS2V5Q29kZS5SSUdIVF9BUlJPVyB8fCBlLmtleUNvZGUgPT09IEtleUNvZGUuS0VZX0QpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kS2V5KFwiUmlnaHRcIiwgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25QbGF5QWdhaW4oZTogSlF1ZXJ5RXZlbnRPYmplY3QpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YShKU09OLnN0cmluZ2lmeSh7IHR5cGU6IFwicGxheUFnYWluXCIgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbmRLZXkoa2V5OiBzdHJpbmcsIGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YShKU09OLnN0cmluZ2lmeSh7IHR5cGU6IFwia2V5RG93blwiLCBDb21tYW5kOiBrZXkgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcm9jZXNzKGRhdGE6IGFueSkge1xyXG4gICAgICAgIGlmIChkYXRhLmNvbW1hbmQgPT09IFwid2FpdE9wcG9uZW50XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFwid2FpdE9wcG9uZW50XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkYXRhLmNvbW1hbmQgPT09IFwibWF6ZUZlaWxkXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFwibWF6ZUZlaWxkXCI7XHJcbiAgICAgICAgICAgIHRoaXMubWF6ZUZpZWxkID0gZGF0YTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0xvb3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRhdGEuY29tbWFuZCA9PT0gXCJnYW1lT3ZlclwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBcImdhbWVPdmVyXCI7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRhdGEuY29tbWFuZCA9PT0gXCJwbGF5ZXJTdGF0ZVwiKVxyXG4gICAgICAgICAgICB0aGlzLm1vdmVUbyhkYXRhLm15UG9zLCBkYXRhLmVuZW15UG9zKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIG1hemVGaWVsZDogYW55O1xyXG4gICAgcHJpdmF0ZSBnYW1lT3ZlcjogYW55O1xyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyKCkge1xyXG4gICAgICAgICQoXCIjd2FpdC1nYW1lLXNjcmVlblwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCB0aGlzLnN0YXRlICE9PSBcIndhaXRPcHBvbmVudFwiKTtcclxuICAgICAgICAkKFwiI2dhbWUtY2FudmFzLXNjcmVlblwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCB0aGlzLnN0YXRlICE9PSBcIm1hemVGZWlsZFwiKTtcclxuICAgICAgICAkKFwiI2dhbWUtZ2FtZW92ZXItc2NyZWVuXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZGVuXCIsIHRoaXMuc3RhdGUgIT09IFwiZ2FtZU92ZXJcIik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBcIm1hemVGZWlsZFwiKSB7XHJcbiAgICAgICAgICAgICQoXCIuZ2FtZS1jYW52YXMtbXktbmFtZVwiKS50ZXh0KHRoaXMubWF6ZUZpZWxkLm1lLm5hbWUpLnByb3AoXCJ0aXRsZVwiLCB0aGlzLm1hemVGaWVsZC5tZS5uYW1lKTtcclxuICAgICAgICAgICAgJChcIi5nYW1lLWNhbnZhcy1teS1yYXRpbmdcIikudGV4dCh0aGlzLm1hemVGaWVsZC5tZS5yYXRpbmcpO1xyXG4gICAgICAgICAgICAkKFwiLmdhbWUtY2FudmFzLWVuZW15LW5hbWVcIikudGV4dCh0aGlzLm1hemVGaWVsZC5lbmVteS5uYW1lKS5wcm9wKFwidGl0bGVcIiwgdGhpcy5tYXplRmllbGQuZW5lbXkubmFtZSk7XHJcbiAgICAgICAgICAgICQoXCIuZ2FtZS1jYW52YXMtZW5lbXktcmF0aW5nXCIpLnRleHQodGhpcy5tYXplRmllbGQuZW5lbXkucmF0aW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBcImdhbWVPdmVyXCIpIHtcclxuICAgICAgICAgICAgJChcIiNnYW1lLWdhbWVvdmVyLXNjcmVlbiAud2lubmVyXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZGVuXCIsIHRoaXMuZ2FtZU92ZXIuc3RhdHVzICE9PSBcIndpblwiKTtcclxuICAgICAgICAgICAgJChcIiNnYW1lLWdhbWVvdmVyLXNjcmVlbiAubG9vc2VyXCIpLnRvZ2dsZUNsYXNzKFwiaGlkZGVuXCIsIHRoaXMuZ2FtZU92ZXIuc3RhdHVzID09PSBcIndpblwiKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lT3Zlci5yYXRpbmdzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByYXRpbmcgPSB0aGlzLmdhbWVPdmVyLnJhdGluZ3NbaV07XHJcbiAgICAgICAgICAgICAgICAkKFwiLmdhbWUtY2FudmFzLXJhdGluZ3NcIikuYXBwZW5kKGA8dHI+PHRkPiR7aSArIDF9PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48L3RyPmApO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGxzID0gJChcIi5nYW1lLWNhbnZhcy1yYXRpbmdzXCIpLmNoaWxkcmVuKCkubGFzdCgpLmNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgICAgICBjZWxscy5lcSgxKS50ZXh0KHJhdGluZy5uYW1lKS5wcm9wKFwidGl0bGVcIiwgcmF0aW5nLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgY2VsbHMuZXEoMikudGV4dChyYXRpbmcucmF0aW5nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmF0aW5nLmlzTWUpXHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbHMuZXEoMCkuYWRkQ2xhc3MoXCJteS1uYW1lXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyYXRpbmcuaXNFbmVteSlcclxuICAgICAgICAgICAgICAgICAgICBjZWxscy5lcSgwKS5hZGRDbGFzcyhcImVuZW15LW5hbWVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXJ2ZXJUaW1lID0gMDtcclxuICAgIHByaXZhdGUgcGxheWVyUG9zOiBQbGF5ZXJQb3NpdGlvbjtcclxuICAgIHByaXZhdGUgZW5lbXlQb3M6IFBsYXllclBvc2l0aW9uO1xyXG5cclxuICAgIHByaXZhdGUgbW92ZVRvKG15UG9zLCBlbmVteVBvcykge1xyXG4gICAgICAgIGlmICh0aGlzLmVuZW15UG9zID09IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuZW5lbXlQb3MgPSBuZXcgUGxheWVyUG9zaXRpb24oZW5lbXlQb3MueCwgZW5lbXlQb3MueSk7XHJcbiAgICAgICAgdGhpcy5lbmVteVBvcy5TZXRQb3MoZW5lbXlQb3MueCwgZW5lbXlQb3MueSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBsYXllclBvcyA9PSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLnBsYXllclBvcyA9IG5ldyBQbGF5ZXJQb3NpdGlvbihteVBvcy54LCBteVBvcy55KTtcclxuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJQb3MuU2V0UG9zKG15UG9zLngsIG15UG9zLnkpO1xyXG5cclxuICAgICAgICB0aGlzLnNlcnZlclRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2NhbGUgPSAyMDtcclxuXHJcbiAgICBwcml2YXRlIGRyYXdPbih0KSB7XHJcbiAgICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLnNjYWxlO1xyXG4gICAgICAgIGNvbnN0IG1hemVGaWVsZCA9IHRoaXMubWF6ZUZpZWxkLmZpZWxkXHJcblxyXG4gICAgICAgIHZhciBjdHggPSAoJChcIiNnYW1lLWNhbnZhc1wiKVswXSBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjdHguY2FudmFzLndpZHRoLCBjdHguY2FudmFzLmhlaWdodCk7XHJcblxyXG4gICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMTAuNSwgMTAuNSk7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xyXG4gICAgICAgIGN0eC5saW5lQ2FwID0gXCJyb3VuZFwiO1xyXG4gICAgICAgIC8vY3R4LnN0cm9rZVN0eWxlID0gXCIjMjI3RjMyXCI7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCIjMzMzXCI7XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBtYXplRmllbGQubGVuZ3RoOyArK3kpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBtYXplRmllbGRbeV0ubGVuZ3RoOyArK3gpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdG9wTGVmdCA9IHsgeDogeCAqIHNjYWxlLCB5OiB5ICogc2NhbGUgfTtcclxuICAgICAgICAgICAgICAgIHZhciB0b3BSaWdodCA9IHsgeDogKHggKyAxKSAqIHNjYWxlLCB5OiB5ICogc2NhbGUgfTtcclxuICAgICAgICAgICAgICAgIHZhciBib3R0b21SaWdodCA9IHsgeDogKHggKyAxKSAqIHNjYWxlLCB5OiAoeSArIDEpICogc2NhbGUgfTtcclxuICAgICAgICAgICAgICAgIHZhciBib3R0b21MZWZ0ID0geyB4OiB4ICogc2NhbGUsIHk6ICh5ICsgMSkgKiBzY2FsZSB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgobWF6ZUZpZWxkW3ldW3hdICYgMSkgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHRvcExlZnQueCwgdG9wTGVmdC55KTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHRvcFJpZ2h0LngsIHRvcFJpZ2h0LnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgobWF6ZUZpZWxkW3ldW3hdICYgMikgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHRvcFJpZ2h0LngsIHRvcFJpZ2h0LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYm90dG9tUmlnaHQueCwgYm90dG9tUmlnaHQueSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKChtYXplRmllbGRbeV1beF0gJiA0KSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oYm90dG9tUmlnaHQueCwgYm90dG9tUmlnaHQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhib3R0b21MZWZ0LngsIGJvdHRvbUxlZnQueSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKChtYXplRmllbGRbeV1beF0gJiA4KSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oYm90dG9tTGVmdC54LCBib3R0b21MZWZ0LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8odG9wTGVmdC54LCB0b3BMZWZ0LnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyUG9zICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5EcmF3UGxheWVyKHRoaXMucGxheWVyUG9zLCBjdHgsIHQsIFwiIzIyN0YzMlwiLCA0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVuZW15UG9zICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5EcmF3UGxheWVyKHRoaXMuZW5lbXlQb3MsIGN0eCwgdCwgXCIjYmYwZDMxXCIsIDMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIERyYXdQbGF5ZXIocGxheWVyUG9zOiBQbGF5ZXJQb3NpdGlvbiwgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHByb2dyZXNzOiBudW1iZXIsIGNvbG9yOiBzdHJpbmcsIHNpemU6IG51bWJlcikge1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuXHJcbiAgICAgICAgY29uc3QgcG9zID0gcGxheWVyUG9zLkdldFBvc3Rpb24ocHJvZ3Jlc3MpO1xyXG5cclxuICAgICAgICBjb25zdCBjZW50ZXIgPSB7IHg6IChwb3MueCArIDAuNSkgKiB0aGlzLnNjYWxlLCB5OiAocG9zLnkgKyAwLjUpICogdGhpcy5zY2FsZSB9O1xyXG4gICAgICAgIGNvbnN0IGRlbHRhID0gcGxheWVyUG9zLkdldERlbHRhKCk7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oY2VudGVyLnggLSBkZWx0YS54ICogMjUsIGNlbnRlci55IC0gZGVsdGEueSAqIDI1KTtcclxuICAgICAgICBjdHgubGluZVRvKGNlbnRlci54ICsgKGRlbHRhLnkgPT09IDAgPyAwIDogMyksIGNlbnRlci55ICsgKGRlbHRhLnggPT09IDAgPyAwIDogMykpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oY2VudGVyLnggKyAoZGVsdGEueSA9PT0gMCA/IDAgOiAtMyksIGNlbnRlci55ICsgKGRlbHRhLnggPT09IDAgPyAwIDogLTMpKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5hcmMoY2VudGVyLngsIGNlbnRlci55LCBzaXplLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgZHJhd0xvb3AoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IFwibWF6ZUZlaWxkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5vdyA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdmFyIHQgPSAobm93IC0gdGhpcy5zZXJ2ZXJUaW1lKSAvIDEwMDtcclxuICAgICAgICB0aGlzLmRyYXdPbih0KTtcclxuXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZHJhd0xvb3AoKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFBsYXllclBvc2l0aW9uIHtcclxuICAgIHB1YmxpYyBjdXJyZW50UG9zOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XHJcbiAgICBwdWJsaWMgbmV4dFBvczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBvcyA9IHsgeDogeCwgeTogeSB9XHJcbiAgICAgICAgdGhpcy5uZXh0UG9zID0geyB4OiB4LCB5OiB5IH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgU2V0UG9zKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UG9zLnggPSB0aGlzLm5leHRQb3MueDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQb3MueSA9IHRoaXMubmV4dFBvcy55O1xyXG5cclxuICAgICAgICB0aGlzLm5leHRQb3MueCA9IHg7XHJcbiAgICAgICAgdGhpcy5uZXh0UG9zLnkgPSB5O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgR2V0UG9zdGlvbihwcm9ncmVzczogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogKHRoaXMuY3VycmVudFBvcy54ICogKDEgLSBwcm9ncmVzcykgKyB0aGlzLm5leHRQb3MueCAqIHByb2dyZXNzKSxcclxuICAgICAgICAgICAgeTogKHRoaXMuY3VycmVudFBvcy55ICogKDEgLSBwcm9ncmVzcykgKyB0aGlzLm5leHRQb3MueSAqIHByb2dyZXNzKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgR2V0RGVsdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogKHRoaXMubmV4dFBvcy54IC0gdGhpcy5jdXJyZW50UG9zLngpLFxyXG4gICAgICAgICAgICB5OiAodGhpcy5uZXh0UG9zLnkgLSB0aGlzLmN1cnJlbnRQb3MueSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuY2xhc3MgUmV0dXJuQXJlYSBpbXBsZW1lbnRzIElBcmVhIHtcclxuICAgIHByaXZhdGUgc2VuZERhdGE6IChkYXRhOiBhbnkpID0+IHZvaWQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YSA9IHNlbmREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnRlcigpIHtcclxuICAgICAgICAkKFwiI21haW4tY29udGVudFwiKS5odG1sKCQoXCIjcmV0dXJuLWFyZWEtdGVtcGxhdGVcIikuaHRtbCgpKTtcclxuICAgICAgICAkKFwiLnJldHVybi1wYWdlX19wbGF5LWFnYWluLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIChhcmc6IEpRdWVyeUV2ZW50T2JqZWN0KSA9PiB0aGlzLm9uQ2xpY2soXCJwbGF5QWdhaW5cIikpO1xyXG4gICAgICAgICQoXCIucmV0dXJuLXBhZ2VfX3Jlc2V0LWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIChhcmc6IEpRdWVyeUV2ZW50T2JqZWN0KSA9PiB0aGlzLm9uQ2xpY2soXCJyZXNldFBsYXllclwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQ2xpY2sodHlwZUNvbW1hbmQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEoSlNPTi5zdHJpbmdpZnkoeyBUeXBlOiB0eXBlQ29tbWFuZCB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxlYXZlKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGxheWVySW5mbztcclxuICAgIHB1YmxpYyBwcm9jZXNzKGRhdGE6IGFueSkge1xyXG4gICAgICAgIGlmIChkYXRhLmNvbW1hbmQgPT09IFwicGxheWVySW5mb1wiKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVySW5mbyA9IGRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBsYXllckluZm8gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAkKFwiLnJldHVybi1wYWdlX19teS1uYW1lXCIpLnRleHQodGhpcy5wbGF5ZXJJbmZvLm5hbWUpXHJcbiAgICAgICAgICAgICQoXCIucmV0dXJuLXBhZ2VfX215LXJhdGluZ1wiKS50ZXh0KHRoaXMucGxheWVySW5mby5yYXRpbmcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9TY3JpcHRzL0FyZWFDb250cm9sbGVyLnRzIiwiaW1wb3J0IHtBcmVhQ29udHJvbGxlciB9IGZyb20gXCIuL0FyZWFDb250cm9sbGVyLnRzXCI7XHJcblxyXG5sZXQgY29udHJvbGxlciA9IG5ldyBBcmVhQ29udHJvbGxlcihzZW5kTWVzc2FnZSk7XHJcblxyXG5cclxudmFyIHVyaSA9IFwid3M6Ly9cIiArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgXCIvdGVzdFwiO1xyXG5sZXQgc29ja2V0OiBXZWJTb2NrZXQ7XHJcbmZ1bmN0aW9uIGNvbm5lY3QoKSB7XHJcbiAgICBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KHVyaSk7XHJcbiAgICBzb2NrZXQub25vcGVuID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJvcGVuZWQgY29ubmVjdGlvbiB0byBcIiArIHVyaSk7XHJcbiAgICAgICAgY29udHJvbGxlci5nb3RvQXJlYShcImxvYWRpbmdcIik7XHJcbiAgICB9O1xyXG4gICAgc29ja2V0Lm9uY2xvc2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNsb3NlZCBjb25uZWN0aW9uIGZyb20gXCIgKyB1cmkpO1xyXG4gICAgfTtcclxuICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAvL2FwcGVuZEl0ZW0obGlzdCwgZXZlbnQuZGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YSk7XHJcblxyXG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xyXG5cclxuICAgICAgICBjb250cm9sbGVyLnByb2Nlc3MocmVzKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgLy9pZiAocmVzLmNvbW1hbmQgPT0gXCJnZXRUb2tlblwiKVxyXG4gICAgICAgIC8vICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidG9rZW5cIiwgcmVzLlRva2VuKTtcclxuXHJcblxyXG4gICAgICAgIC8vaWYgKHJlcy5jb21tYW5kID09PSBcInBsYXllclN0YXRlXCIpXHJcbiAgICAgICAgLy8gICAgbW92ZVRvKHJlcy5teVBvcywgcmVzLmVuZW15UG9zKTtcclxuICAgICAgICAvL2Vsc2UgaWYgKHJlcy5jb21tYW5kID09PSBcIm1hemVGZWlsZFwiKVxyXG4gICAgICAgIC8vICAgIHNldEZpZWxkKHJlcy5maWVsZClcclxuICAgICAgICAvL2Vsc2UgaWYgKHJlcy5jb21tYW5kID09IFwiZ2V0VG9rZW5cIilcclxuICAgICAgICAvLyAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRva2VuXCIsIHJlcy5Ub2tlbilcclxuICAgICAgICAvL2Vsc2UgaWYgKHJlcy5jb21tYW5kID09IFwiZ2FtZU93ZXJcIilcclxuICAgICAgICAvLyAgICBpbkdhbWUgPSBmYWxzZTtcclxuXHJcbiAgICB9O1xyXG4gICAgc29ja2V0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yOiBcIiArIGV2ZW50LnJldHVyblZhbHVlKTtcclxuICAgIH07XHJcbn1cclxuY29ubmVjdCgpO1xyXG5mdW5jdGlvbiBzZW5kTWVzc2FnZShtZXNzYWdlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmc6IFwiICsgbWVzc2FnZSk7XHJcbiAgICBzb2NrZXQuc2VuZChtZXNzYWdlKTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL1NjcmlwdHMvYXBwLnRzIiwiZXhwb3J0IGVudW0gS2V5Q29kZSB7XHJcbiAgICBCQUNLU1BBQ0UgPSA4LFxyXG4gICAgVEFCID0gOSxcclxuICAgIEVOVEVSID0gMTMsXHJcbiAgICBTSElGVCA9IDE2LFxyXG4gICAgQ1RSTCA9IDE3LFxyXG4gICAgQUxUID0gMTgsXHJcbiAgICBQQVVTRSA9IDE5LFxyXG4gICAgQ0FQU19MT0NLID0gMjAsXHJcbiAgICBFU0NBUEUgPSAyNyxcclxuICAgIFNQQUNFID0gMzIsXHJcbiAgICBQQUdFX1VQID0gMzMsXHJcbiAgICBQQUdFX0RPV04gPSAzNCxcclxuICAgIEVORCA9IDM1LFxyXG4gICAgSE9NRSA9IDM2LFxyXG4gICAgTEVGVF9BUlJPVyA9IDM3LFxyXG4gICAgVVBfQVJST1cgPSAzOCxcclxuICAgIFJJR0hUX0FSUk9XID0gMzksXHJcbiAgICBET1dOX0FSUk9XID0gNDAsXHJcbiAgICBJTlNFUlQgPSA0NSxcclxuICAgIERFTEVURSA9IDQ2LFxyXG4gICAgS0VZXzAgPSA0OCxcclxuICAgIEtFWV8xID0gNDksXHJcbiAgICBLRVlfMiA9IDUwLFxyXG4gICAgS0VZXzMgPSA1MSxcclxuICAgIEtFWV80ID0gNTIsXHJcbiAgICBLRVlfNSA9IDUzLFxyXG4gICAgS0VZXzYgPSA1NCxcclxuICAgIEtFWV83ID0gNTUsXHJcbiAgICBLRVlfOCA9IDU2LFxyXG4gICAgS0VZXzkgPSA1NyxcclxuICAgIEtFWV9BID0gNjUsXHJcbiAgICBLRVlfQiA9IDY2LFxyXG4gICAgS0VZX0MgPSA2NyxcclxuICAgIEtFWV9EID0gNjgsXHJcbiAgICBLRVlfRSA9IDY5LFxyXG4gICAgS0VZX0YgPSA3MCxcclxuICAgIEtFWV9HID0gNzEsXHJcbiAgICBLRVlfSCA9IDcyLFxyXG4gICAgS0VZX0kgPSA3MyxcclxuICAgIEtFWV9KID0gNzQsXHJcbiAgICBLRVlfSyA9IDc1LFxyXG4gICAgS0VZX0wgPSA3NixcclxuICAgIEtFWV9NID0gNzcsXHJcbiAgICBLRVlfTiA9IDc4LFxyXG4gICAgS0VZX08gPSA3OSxcclxuICAgIEtFWV9QID0gODAsXHJcbiAgICBLRVlfUSA9IDgxLFxyXG4gICAgS0VZX1IgPSA4MixcclxuICAgIEtFWV9TID0gODMsXHJcbiAgICBLRVlfVCA9IDg0LFxyXG4gICAgS0VZX1UgPSA4NSxcclxuICAgIEtFWV9WID0gODYsXHJcbiAgICBLRVlfVyA9IDg3LFxyXG4gICAgS0VZX1ggPSA4OCxcclxuICAgIEtFWV9ZID0gODksXHJcbiAgICBLRVlfWiA9IDkwLFxyXG4gICAgTEVGVF9NRVRBID0gOTEsXHJcbiAgICBSSUdIVF9NRVRBID0gOTIsXHJcbiAgICBTRUxFQ1QgPSA5MyxcclxuICAgIE5VTVBBRF8wID0gOTYsXHJcbiAgICBOVU1QQURfMSA9IDk3LFxyXG4gICAgTlVNUEFEXzIgPSA5OCxcclxuICAgIE5VTVBBRF8zID0gOTksXHJcbiAgICBOVU1QQURfNCA9IDEwMCxcclxuICAgIE5VTVBBRF81ID0gMTAxLFxyXG4gICAgTlVNUEFEXzYgPSAxMDIsXHJcbiAgICBOVU1QQURfNyA9IDEwMyxcclxuICAgIE5VTVBBRF84ID0gMTA0LFxyXG4gICAgTlVNUEFEXzkgPSAxMDUsXHJcbiAgICBNVUxUSVBMWSA9IDEwNixcclxuICAgIEFERCA9IDEwNyxcclxuICAgIFNVQlRSQUNUID0gMTA5LFxyXG4gICAgREVDSU1BTCA9IDExMCxcclxuICAgIERJVklERSA9IDExMSxcclxuICAgIEYxID0gMTEyLFxyXG4gICAgRjIgPSAxMTMsXHJcbiAgICBGMyA9IDExNCxcclxuICAgIEY0ID0gMTE1LFxyXG4gICAgRjUgPSAxMTYsXHJcbiAgICBGNiA9IDExNyxcclxuICAgIEY3ID0gMTE4LFxyXG4gICAgRjggPSAxMTksXHJcbiAgICBGOSA9IDEyMCxcclxuICAgIEYxMCA9IDEyMSxcclxuICAgIEYxMSA9IDEyMixcclxuICAgIEYxMiA9IDEyMyxcclxuICAgIE5VTV9MT0NLID0gMTQ0LFxyXG4gICAgU0NST0xMX0xPQ0sgPSAxNDUsXHJcbiAgICBTRU1JQ09MT04gPSAxODYsXHJcbiAgICBFUVVBTFMgPSAxODcsXHJcbiAgICBDT01NQSA9IDE4OCxcclxuICAgIERBU0ggPSAxODksXHJcbiAgICBQRVJJT0QgPSAxOTAsXHJcbiAgICBGT1JXQVJEX1NMQVNIID0gMTkxLFxyXG4gICAgR1JBVkVfQUNDRU5UID0gMTkyLFxyXG4gICAgT1BFTl9CUkFDS0VUID0gMjE5LFxyXG4gICAgQkFDS19TTEFTSCA9IDIyMCxcclxuICAgIENMT1NFX0JSQUNLRVQgPSAyMjEsXHJcbiAgICBTSU5HTEVfUVVPVEUgPSAyMjJcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9TY3JpcHRzL2tleV9jb2RlLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==