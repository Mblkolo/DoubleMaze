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
        this.sendData(JSON.stringify({
            Type: "token",
            PlayerId: localStorage.getItem("playerId"),
            Token: localStorage.getItem("token")
        }));
    };
    LoadingArea.prototype.leave = function () {
    };
    LoadingArea.prototype.process = function (data) {
        if (data.command === "setToken") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("playerId", data.playerId);
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
        var _this = this;
        if (data.command === "showBots") {
            for (var i = 0; i < data.bots.length; ++i) {
                var bot = data.bots[i];
                $(".wait-game-bots").append("<tr><td>" + (i + 1) + "</td><td></td><td></td><td></td></tr>");
                var cells = $(".wait-game-bots").children().last().children();
                cells.eq(1).text(bot.name).prop("title", bot.name);
                cells.eq(2).text(bot.rating);
                if (bot.isAwaible) {
                    cells.eq(3).append("<a href=\"#play\" class=\"link-button\">Играть</a>");
                    cells.eq(3).on("click", "a", bot.id, function (arg) { return _this.playWithBot(arg.data); });
                }
                else {
                    cells.eq(3).text("В игре");
                }
            }
        }
    };
    WaitArea.prototype.playWithBot = function (botId) {
        this.sendData(JSON.stringify({ type: "playWithBot", botId: botId }));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWJmMGVlYWU2NzdmZTExZTk0NTgiLCJ3ZWJwYWNrOi8vLy4vU2NyaXB0cy9BcmVhQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly8vLi9TY3JpcHRzL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9TY3JpcHRzL2tleV9jb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQy9EQSwyQ0FBc0M7QUFFdEM7SUFJSSx3QkFBbUIsUUFBNkI7UUFIeEMsVUFBSyxHQUFrQyxFQUFFLENBQUM7UUFDMUMsZ0JBQVcsR0FBVSxJQUFJLENBQUM7UUFHOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxjQUFNLFdBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUF6QixDQUF5QixDQUFDO1FBQ3hELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsY0FBTSxXQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBekIsQ0FBeUIsQ0FBQztRQUN4RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLGNBQU0sV0FBSSxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQXRCLENBQXNC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UCxlQUFPLFFBb0dsQjtBQUFBLENBQUMiLCJmaWxlIjoiLi93d3dyb290L2pzL2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMWJmMGVlYWU2NzdmZTExZTk0NTgiLCJpbXBvcnQge0lBcmVhfSBmcm9tIFwiLi9JQXJlYS50c1wiO1xyXG5pbXBvcnQge0tleUNvZGV9IGZyb20gXCIuL2tleV9jb2RlLnRzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQXJlYUNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBhcmVhczogeyBbaWQ6IHN0cmluZ106ICgpID0+IElBcmVhIH0gPSB7fTtcclxuICAgIHByaXZhdGUgY3VycmVudEFyZWE6IElBcmVhID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3Ioc2VuZERhdGE6IChkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLmFyZWFzW1wibG9hZGluZ1wiXSA9ICgpID0+IG5ldyBMb2FkaW5nQXJlYShzZW5kRGF0YSk7XHJcbiAgICAgICAgdGhpcy5hcmVhc1tcIndlbGNvbWVcIl0gPSAoKSA9PiBuZXcgV2VsY29tZUFyZWEoc2VuZERhdGEpO1xyXG4gICAgICAgIHRoaXMuYXJlYXNbXCJ3YWl0XCJdID0gKCkgPT4gbmV3IFdhaXRBcmVhKHNlbmREYXRhKTtcclxuICAgICAgICB0aGlzLmFyZWFzW1wiZ2FtZVwiXSA9ICgpID0+IG5ldyBHYW1lQXJlYShzZW5kRGF0YSk7XHJcbiAgICAgICAgdGhpcy5hcmVhc1tcInJldHVyblwiXSA9ICgpID0+IG5ldyBSZXR1cm5BcmVhKHNlbmREYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ290b0FyZWEoYXJlYTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEFyZWEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBcmVhLmxlYXZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRBcmVhID0gdGhpcy5hcmVhc1thcmVhXSgpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEFyZWEuZW50ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJvY2VzcyhkYXRhOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZGF0YS5jb21tYW5kID09PSBcImdvdG9cIikge1xyXG4gICAgICAgICAgICB0aGlzLmdvdG9BcmVhKGRhdGEuYXJlYSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRBcmVhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QXJlYS5wcm9jZXNzKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTG9hZGluZ0FyZWEgaW1wbGVtZW50cyBJQXJlYSB7XHJcbiAgICBwcml2YXRlIHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEgPSBzZW5kRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW50ZXIoKSB7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YShKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIFR5cGU6IFwidG9rZW5cIixcclxuICAgICAgICAgICAgUGxheWVySWQ6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGxheWVySWRcIiksXHJcbiAgICAgICAgICAgIFRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsZWF2ZSgpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJvY2VzcyhkYXRhOiBhbnkpIHtcclxuICAgICAgICBpZiAoZGF0YS5jb21tYW5kID09PSBcInNldFRva2VuXCIpIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlblwiLCBkYXRhLnRva2VuKTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwbGF5ZXJJZFwiLCBkYXRhLnBsYXllcklkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jbGFzcyBXZWxjb21lQXJlYSBpbXBsZW1lbnRzIElBcmVhIHtcclxuICAgIHByaXZhdGUgc2VuZERhdGE6IChkYXRhOiBhbnkpID0+IHZvaWQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YSA9IHNlbmREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnRlcigpIHtcclxuICAgICAgICAkKFwiI21haW4tY29udGVudFwiKS5odG1sKCQoXCIjd2VsY29tZS1hcmVhLXRlbXBsYXRlXCIpLmh0bWwoKSk7XHJcbiAgICAgICAgJChcIi53ZWxjb21lLXBsYXktYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKGFyZzogSlF1ZXJ5RXZlbnRPYmplY3QpID0+IHRoaXMub25DbGljayhhcmcpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25DbGljayhhcmc6IEpRdWVyeUV2ZW50T2JqZWN0KSB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9ICQoXCIud2VsY29tZS1wbGF5ZXItbmFtZVwiKS52YWwoKTtcclxuICAgICAgICB0aGlzLnNlbmREYXRhKEpTT04uc3RyaW5naWZ5KHsgVHlwZTogXCJQbGF5ZXJOYW1lXCIsIE5hbWU6IG5hbWUgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsZWF2ZSgpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJvY2VzcyhkYXRhOiBhbnkpIHtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5jbGFzcyBXYWl0QXJlYSBpbXBsZW1lbnRzIElBcmVhIHtcclxuICAgIHByaXZhdGUgc2VuZERhdGE6IChkYXRhOiBhbnkpID0+IHZvaWQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YSA9IHNlbmREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnRlcigpIHtcclxuICAgICAgICAkKFwiI21haW4tY29udGVudFwiKS5odG1sKCQoXCIjd2FpdC1hcmVhLXRlbXBsYXRlXCIpLmh0bWwoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxlYXZlKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcm9jZXNzKGRhdGE6IGFueSkge1xyXG4gICAgICAgIGlmIChkYXRhLmNvbW1hbmQgPT09IFwic2hvd0JvdHNcIikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEuYm90cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYm90ID0gZGF0YS5ib3RzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICQoXCIud2FpdC1nYW1lLWJvdHNcIikuYXBwZW5kKGA8dHI+PHRkPiR7aSArIDF9PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48L3RyPmApO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGxzID0gJChcIi53YWl0LWdhbWUtYm90c1wiKS5jaGlsZHJlbigpLmxhc3QoKS5jaGlsZHJlbigpO1xyXG4gICAgICAgICAgICAgICAgY2VsbHMuZXEoMSkudGV4dChib3QubmFtZSkucHJvcChcInRpdGxlXCIsIGJvdC5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGNlbGxzLmVxKDIpLnRleHQoYm90LnJhdGluZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGJvdC5pc0F3YWlibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjZWxscy5lcSgzKS5hcHBlbmQoXCI8YSBocmVmPVxcXCIjcGxheVxcXCIgY2xhc3M9XFxcImxpbmstYnV0dG9uXFxcIj7QmNCz0YDQsNGC0Yw8L2E+XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGxzLmVxKDMpLm9uKFwiY2xpY2tcIiwgXCJhXCIsIGJvdC5pZCwgKGFyZzogSlF1ZXJ5RXZlbnRPYmplY3QpID0+IHRoaXMucGxheVdpdGhCb3QoYXJnLmRhdGEpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGxzLmVxKDMpLnRleHQoXCLQkiDQuNCz0YDQtVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGxheVdpdGhCb3QoYm90SWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEoSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiBcInBsYXlXaXRoQm90XCIsIGJvdElkOiBib3RJZCB9KSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEdhbWVBcmVhIGltcGxlbWVudHMgSUFyZWEge1xyXG4gICAgcHJpdmF0ZSBzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZDtcclxuICAgIHByaXZhdGUgb25LZXlEb3duSGFuZGxlciA9IChhcmc6IEpRdWVyeUV2ZW50T2JqZWN0KSA9PiB0aGlzLm9uS2V5RG93bihhcmcpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEgPSBzZW5kRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW50ZXIoKSB7XHJcbiAgICAgICAgJChcIiNtYWluLWNvbnRlbnRcIikuaHRtbCgkKFwiI2dhbWUtYXJlYS10ZW1wbGF0ZVwiKS5odG1sKCkpO1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bkhhbmRsZXIpO1xyXG4gICAgICAgICQoXCIuZ2FtZS1nYW1lb3Zlci1zY3JlZW4tYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgKGFyZzogSlF1ZXJ5RXZlbnRPYmplY3QpID0+IHRoaXMub25QbGF5QWdhaW4oYXJnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxlYXZlKCkge1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9mZihcImtleWRvd25cIiwgdGhpcy5vbktleURvd25IYW5kbGVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbktleURvd24oZTogSlF1ZXJ5RXZlbnRPYmplY3QpIHtcclxuICAgICAgICBpZiAoZS5rZXlDb2RlID09IEtleUNvZGUuRE9XTl9BUlJPV1xyXG4gICAgICAgICAgICB8fCBlLmtleUNvZGUgPT0gS2V5Q29kZS5VUF9BUlJPV1xyXG4gICAgICAgICAgICB8fCBlLmtleUNvZGUgPT0gS2V5Q29kZS5MRUZUX0FSUk9XXHJcbiAgICAgICAgICAgIHx8IGUua2V5Q29kZSA9PSBLZXlDb2RlLlJJR0hUX0FSUk9XKSB7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBLZXlDb2RlLkRPV05fQVJST1cgfHwgZS5rZXlDb2RlID09PSBLZXlDb2RlLktFWV9TKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZEtleShcIkRvd25cIiwgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IEtleUNvZGUuVVBfQVJST1cgfHwgZS5rZXlDb2RlID09PSBLZXlDb2RlLktFWV9XKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZEtleShcIlVwXCIsIGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBLZXlDb2RlLkxFRlRfQVJST1cgfHwgZS5rZXlDb2RlID09PSBLZXlDb2RlLktFWV9BKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZEtleShcIkxlZnRcIiwgZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IEtleUNvZGUuUklHSFRfQVJST1cgfHwgZS5rZXlDb2RlID09PSBLZXlDb2RlLktFWV9EKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZEtleShcIlJpZ2h0XCIsIGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uUGxheUFnYWluKGU6IEpRdWVyeUV2ZW50T2JqZWN0KSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEoSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiBcInBsYXlBZ2FpblwiIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBzZW5kS2V5KGtleTogc3RyaW5nLCBlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEoSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiBcImtleURvd25cIiwgQ29tbWFuZDoga2V5IH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHJvY2VzcyhkYXRhOiBhbnkpIHtcclxuICAgICAgICBpZiAoZGF0YS5jb21tYW5kID09PSBcIndhaXRPcHBvbmVudFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBcIndhaXRPcHBvbmVudFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGF0YS5jb21tYW5kID09PSBcIm1hemVGZWlsZFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBcIm1hemVGZWlsZFwiO1xyXG4gICAgICAgICAgICB0aGlzLm1hemVGaWVsZCA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRyYXdMb29wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkYXRhLmNvbW1hbmQgPT09IFwiZ2FtZU92ZXJcIikge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gXCJnYW1lT3ZlclwiO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVPdmVyID0gZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXRhLmNvbW1hbmQgPT09IFwicGxheWVyU3RhdGVcIilcclxuICAgICAgICAgICAgdGhpcy5tb3ZlVG8oZGF0YS5teVBvcywgZGF0YS5lbmVteVBvcyk7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0ZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBtYXplRmllbGQ6IGFueTtcclxuICAgIHByaXZhdGUgZ2FtZU92ZXI6IGFueTtcclxuXHJcbiAgICBwcml2YXRlIHJlbmRlcigpIHtcclxuICAgICAgICAkKFwiI3dhaXQtZ2FtZS1zY3JlZW5cIikudG9nZ2xlQ2xhc3MoXCJoaWRkZW5cIiwgdGhpcy5zdGF0ZSAhPT0gXCJ3YWl0T3Bwb25lbnRcIik7XHJcbiAgICAgICAgJChcIiNnYW1lLWNhbnZhcy1zY3JlZW5cIikudG9nZ2xlQ2xhc3MoXCJoaWRkZW5cIiwgdGhpcy5zdGF0ZSAhPT0gXCJtYXplRmVpbGRcIik7XHJcbiAgICAgICAgJChcIiNnYW1lLWdhbWVvdmVyLXNjcmVlblwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCB0aGlzLnN0YXRlICE9PSBcImdhbWVPdmVyXCIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJtYXplRmVpbGRcIikge1xyXG4gICAgICAgICAgICAkKFwiLmdhbWUtY2FudmFzLW15LW5hbWVcIikudGV4dCh0aGlzLm1hemVGaWVsZC5tZS5uYW1lKS5wcm9wKFwidGl0bGVcIiwgdGhpcy5tYXplRmllbGQubWUubmFtZSk7XHJcbiAgICAgICAgICAgICQoXCIuZ2FtZS1jYW52YXMtbXktcmF0aW5nXCIpLnRleHQodGhpcy5tYXplRmllbGQubWUucmF0aW5nKTtcclxuICAgICAgICAgICAgJChcIi5nYW1lLWNhbnZhcy1lbmVteS1uYW1lXCIpLnRleHQodGhpcy5tYXplRmllbGQuZW5lbXkubmFtZSkucHJvcChcInRpdGxlXCIsIHRoaXMubWF6ZUZpZWxkLmVuZW15Lm5hbWUpO1xyXG4gICAgICAgICAgICAkKFwiLmdhbWUtY2FudmFzLWVuZW15LXJhdGluZ1wiKS50ZXh0KHRoaXMubWF6ZUZpZWxkLmVuZW15LnJhdGluZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJnYW1lT3ZlclwiKSB7XHJcbiAgICAgICAgICAgICQoXCIjZ2FtZS1nYW1lb3Zlci1zY3JlZW4gLndpbm5lclwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCB0aGlzLmdhbWVPdmVyLnN0YXR1cyAhPT0gXCJ3aW5cIik7XHJcbiAgICAgICAgICAgICQoXCIjZ2FtZS1nYW1lb3Zlci1zY3JlZW4gLmxvb3NlclwiKS50b2dnbGVDbGFzcyhcImhpZGRlblwiLCB0aGlzLmdhbWVPdmVyLnN0YXR1cyA9PT0gXCJ3aW5cIik7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZU92ZXIucmF0aW5ncy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmF0aW5nID0gdGhpcy5nYW1lT3Zlci5yYXRpbmdzW2ldO1xyXG4gICAgICAgICAgICAgICAgJChcIi5nYW1lLWNhbnZhcy1yYXRpbmdzXCIpLmFwcGVuZChgPHRyPjx0ZD4ke2kgKyAxfTwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PC90cj5gKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxscyA9ICQoXCIuZ2FtZS1jYW52YXMtcmF0aW5nc1wiKS5jaGlsZHJlbigpLmxhc3QoKS5jaGlsZHJlbigpO1xyXG4gICAgICAgICAgICAgICAgY2VsbHMuZXEoMSkudGV4dChyYXRpbmcubmFtZSkucHJvcChcInRpdGxlXCIsIHJhdGluZy5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGNlbGxzLmVxKDIpLnRleHQocmF0aW5nLnJhdGluZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJhdGluZy5pc01lKVxyXG4gICAgICAgICAgICAgICAgICAgIGNlbGxzLmVxKDApLmFkZENsYXNzKFwibXktbmFtZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmF0aW5nLmlzRW5lbXkpXHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbHMuZXEoMCkuYWRkQ2xhc3MoXCJlbmVteS1uYW1lXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VydmVyVGltZSA9IDA7XHJcbiAgICBwcml2YXRlIHBsYXllclBvczogUGxheWVyUG9zaXRpb247XHJcbiAgICBwcml2YXRlIGVuZW15UG9zOiBQbGF5ZXJQb3NpdGlvbjtcclxuXHJcbiAgICBwcml2YXRlIG1vdmVUbyhteVBvcywgZW5lbXlQb3MpIHtcclxuICAgICAgICBpZiAodGhpcy5lbmVteVBvcyA9PSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLmVuZW15UG9zID0gbmV3IFBsYXllclBvc2l0aW9uKGVuZW15UG9zLngsIGVuZW15UG9zLnkpO1xyXG4gICAgICAgIHRoaXMuZW5lbXlQb3MuU2V0UG9zKGVuZW15UG9zLngsIGVuZW15UG9zLnkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJQb3MgPT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJQb3MgPSBuZXcgUGxheWVyUG9zaXRpb24obXlQb3MueCwgbXlQb3MueSk7XHJcblxyXG4gICAgICAgIHRoaXMucGxheWVyUG9zLlNldFBvcyhteVBvcy54LCBteVBvcy55KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXJ2ZXJUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNjYWxlID0gMjA7XHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3T24odCkge1xyXG4gICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5zY2FsZTtcclxuICAgICAgICBjb25zdCBtYXplRmllbGQgPSB0aGlzLm1hemVGaWVsZC5maWVsZFxyXG5cclxuICAgICAgICB2YXIgY3R4ID0gKCQoXCIjZ2FtZS1jYW52YXNcIilbMF0gYXMgSFRNTENhbnZhc0VsZW1lbnQpLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDAsIDApO1xyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY3R4LmNhbnZhcy53aWR0aCwgY3R4LmNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIDEwLjUsIDEwLjUpO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMztcclxuICAgICAgICBjdHgubGluZUNhcCA9IFwicm91bmRcIjtcclxuICAgICAgICAvL2N0eC5zdHJva2VTdHlsZSA9IFwiIzIyN0YzMlwiO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiIzMzM1wiO1xyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgbWF6ZUZpZWxkLmxlbmd0aDsgKyt5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgbWF6ZUZpZWxkW3ldLmxlbmd0aDsgKyt4KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRvcExlZnQgPSB7IHg6IHggKiBzY2FsZSwgeTogeSAqIHNjYWxlIH07XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9wUmlnaHQgPSB7IHg6ICh4ICsgMSkgKiBzY2FsZSwgeTogeSAqIHNjYWxlIH07XHJcbiAgICAgICAgICAgICAgICB2YXIgYm90dG9tUmlnaHQgPSB7IHg6ICh4ICsgMSkgKiBzY2FsZSwgeTogKHkgKyAxKSAqIHNjYWxlIH07XHJcbiAgICAgICAgICAgICAgICB2YXIgYm90dG9tTGVmdCA9IHsgeDogeCAqIHNjYWxlLCB5OiAoeSArIDEpICogc2NhbGUgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKG1hemVGaWVsZFt5XVt4XSAmIDEpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh0b3BMZWZ0LngsIHRvcExlZnQueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh0b3BSaWdodC54LCB0b3BSaWdodC55KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKG1hemVGaWVsZFt5XVt4XSAmIDIpICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh0b3BSaWdodC54LCB0b3BSaWdodC55KTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKGJvdHRvbVJpZ2h0LngsIGJvdHRvbVJpZ2h0LnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgobWF6ZUZpZWxkW3ldW3hdICYgNCkgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKGJvdHRvbVJpZ2h0LngsIGJvdHRvbVJpZ2h0LnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYm90dG9tTGVmdC54LCBib3R0b21MZWZ0LnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgobWF6ZUZpZWxkW3ldW3hdICYgOCkgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKGJvdHRvbUxlZnQueCwgYm90dG9tTGVmdC55KTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHRvcExlZnQueCwgdG9wTGVmdC55KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBsYXllclBvcyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuRHJhd1BsYXllcih0aGlzLnBsYXllclBvcywgY3R4LCB0LCBcIiMyMjdGMzJcIiwgNCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5lbmVteVBvcyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuRHJhd1BsYXllcih0aGlzLmVuZW15UG9zLCBjdHgsIHQsIFwiI2JmMGQzMVwiLCAzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBEcmF3UGxheWVyKHBsYXllclBvczogUGxheWVyUG9zaXRpb24sIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwcm9ncmVzczogbnVtYmVyLCBjb2xvcjogc3RyaW5nLCBzaXplOiBudW1iZXIpIHtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XHJcblxyXG4gICAgICAgIGNvbnN0IHBvcyA9IHBsYXllclBvcy5HZXRQb3N0aW9uKHByb2dyZXNzKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2VudGVyID0geyB4OiAocG9zLnggKyAwLjUpICogdGhpcy5zY2FsZSwgeTogKHBvcy55ICsgMC41KSAqIHRoaXMuc2NhbGUgfTtcclxuICAgICAgICBjb25zdCBkZWx0YSA9IHBsYXllclBvcy5HZXREZWx0YSgpO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGNlbnRlci54IC0gZGVsdGEueCAqIDI1LCBjZW50ZXIueSAtIGRlbHRhLnkgKiAyNSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhjZW50ZXIueCArIChkZWx0YS55ID09PSAwID8gMCA6IDMpLCBjZW50ZXIueSArIChkZWx0YS54ID09PSAwID8gMCA6IDMpKTtcclxuICAgICAgICBjdHgubGluZVRvKGNlbnRlci54ICsgKGRlbHRhLnkgPT09IDAgPyAwIDogLTMpLCBjZW50ZXIueSArIChkZWx0YS54ID09PSAwID8gMCA6IC0zKSk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguYXJjKGNlbnRlci54LCBjZW50ZXIueSwgc2l6ZSwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIGRyYXdMb29wKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlICE9PSBcIm1hemVGZWlsZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIHZhciB0ID0gKG5vdyAtIHRoaXMuc2VydmVyVGltZSkgLyAxMDA7XHJcbiAgICAgICAgdGhpcy5kcmF3T24odCk7XHJcblxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmRyYXdMb29wKCkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBQbGF5ZXJQb3NpdGlvbiB7XHJcbiAgICBwdWJsaWMgY3VycmVudFBvczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9O1xyXG4gICAgcHVibGljIG5leHRQb3M6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQb3MgPSB7IHg6IHgsIHk6IHkgfVxyXG4gICAgICAgIHRoaXMubmV4dFBvcyA9IHsgeDogeCwgeTogeSB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIFNldFBvcyh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBvcy54ID0gdGhpcy5uZXh0UG9zLng7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UG9zLnkgPSB0aGlzLm5leHRQb3MueTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0UG9zLnggPSB4O1xyXG4gICAgICAgIHRoaXMubmV4dFBvcy55ID0geTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIEdldFBvc3Rpb24ocHJvZ3Jlc3M6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6ICh0aGlzLmN1cnJlbnRQb3MueCAqICgxIC0gcHJvZ3Jlc3MpICsgdGhpcy5uZXh0UG9zLnggKiBwcm9ncmVzcyksXHJcbiAgICAgICAgICAgIHk6ICh0aGlzLmN1cnJlbnRQb3MueSAqICgxIC0gcHJvZ3Jlc3MpICsgdGhpcy5uZXh0UG9zLnkgKiBwcm9ncmVzcylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEdldERlbHRhKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6ICh0aGlzLm5leHRQb3MueCAtIHRoaXMuY3VycmVudFBvcy54KSxcclxuICAgICAgICAgICAgeTogKHRoaXMubmV4dFBvcy55IC0gdGhpcy5jdXJyZW50UG9zLnkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcbmNsYXNzIFJldHVybkFyZWEgaW1wbGVtZW50cyBJQXJlYSB7XHJcbiAgICBwcml2YXRlIHNlbmREYXRhOiAoZGF0YTogYW55KSA9PiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihzZW5kRGF0YTogKGRhdGE6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEgPSBzZW5kRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW50ZXIoKSB7XHJcbiAgICAgICAgJChcIiNtYWluLWNvbnRlbnRcIikuaHRtbCgkKFwiI3JldHVybi1hcmVhLXRlbXBsYXRlXCIpLmh0bWwoKSk7XHJcbiAgICAgICAgJChcIi5yZXR1cm4tcGFnZV9fcGxheS1hZ2Fpbi1idXR0b25cIikub24oXCJjbGlja1wiLCAoYXJnOiBKUXVlcnlFdmVudE9iamVjdCkgPT4gdGhpcy5vbkNsaWNrKFwicGxheUFnYWluXCIpKTtcclxuICAgICAgICAkKFwiLnJldHVybi1wYWdlX19yZXNldC1idXR0b25cIikub24oXCJjbGlja1wiLCAoYXJnOiBKUXVlcnlFdmVudE9iamVjdCkgPT4gdGhpcy5vbkNsaWNrKFwicmVzZXRQbGF5ZXJcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkNsaWNrKHR5cGVDb21tYW5kOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNlbmREYXRhKEpTT04uc3RyaW5naWZ5KHsgVHlwZTogdHlwZUNvbW1hbmQgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsZWF2ZSgpIHtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBsYXllckluZm87XHJcbiAgICBwdWJsaWMgcHJvY2VzcyhkYXRhOiBhbnkpIHtcclxuICAgICAgICBpZiAoZGF0YS5jb21tYW5kID09PSBcInBsYXllckluZm9cIikge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllckluZm8gPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmRlcigpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJJbmZvICE9IG51bGwpIHtcclxuICAgICAgICAgICAgJChcIi5yZXR1cm4tcGFnZV9fbXktbmFtZVwiKS50ZXh0KHRoaXMucGxheWVySW5mby5uYW1lKVxyXG4gICAgICAgICAgICAkKFwiLnJldHVybi1wYWdlX19teS1yYXRpbmdcIikudGV4dCh0aGlzLnBsYXllckluZm8ucmF0aW5nKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vU2NyaXB0cy9BcmVhQ29udHJvbGxlci50cyIsImltcG9ydCB7QXJlYUNvbnRyb2xsZXIgfSBmcm9tIFwiLi9BcmVhQ29udHJvbGxlci50c1wiO1xyXG5cclxuXHJcblxyXG5jb25zdCBsb2MgPSB3aW5kb3cubG9jYXRpb247XHJcbmxldCB1cmkgPSAobG9jLnByb3RvY29sID09PSBcImh0dHBzOlwiKSA/IFwid3NzOlwiIDogXCJ3czpcIjtcclxudXJpICs9IFwiLy9cIiArIGxvYy5ob3N0ICsgbG9jLnBhdGhuYW1lLnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKSArIFwiL3Rlc3RcIjtcclxuXHJcbmxldCBjb250cm9sbGVyID0gbmV3IEFyZWFDb250cm9sbGVyKHNlbmRNZXNzYWdlKTtcclxubGV0IHNvY2tldDogV2ViU29ja2V0O1xyXG5mdW5jdGlvbiBjb25uZWN0KCkge1xyXG4gICAgc29ja2V0ID0gbmV3IFdlYlNvY2tldCh1cmkpO1xyXG4gICAgc29ja2V0Lm9ub3BlbiA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwib3BlbmVkIGNvbm5lY3Rpb24gdG8gXCIgKyB1cmkpO1xyXG4gICAgICAgIGNvbnRyb2xsZXIuZ290b0FyZWEoXCJsb2FkaW5nXCIpO1xyXG4gICAgfTtcclxuICAgIHNvY2tldC5vbmNsb3NlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjbG9zZWQgY29ubmVjdGlvbiBmcm9tIFwiICsgdXJpKTtcclxuICAgICAgICBhbGVydChcItCd0LXRgiDRgdCy0Y/Qt9C4INGBINGB0LXRgNCy0LXRgNC+0LwsINC+0LHQvdC+0LLQu9GOINGB0YLRgNCw0L3QuNGG0YMsINC80L7QttC10YIg0L/QvtC80L7Rh9GMXCIpO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgIH07XHJcbiAgICBzb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudC5kYXRhKTtcclxuXHJcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XHJcbiAgICAgICAgY29udHJvbGxlci5wcm9jZXNzKHJlcyk7XHJcbiAgICB9O1xyXG4gICAgc29ja2V0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yOiBcIiArIGV2ZW50LnJldHVyblZhbHVlKTtcclxuICAgIH07XHJcbn1cclxuY29ubmVjdCgpO1xyXG5mdW5jdGlvbiBzZW5kTWVzc2FnZShtZXNzYWdlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmc6IFwiICsgbWVzc2FnZSk7XHJcbiAgICBzb2NrZXQuc2VuZChtZXNzYWdlKTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL1NjcmlwdHMvYXBwLnRzIiwiZXhwb3J0IGVudW0gS2V5Q29kZSB7XHJcbiAgICBCQUNLU1BBQ0UgPSA4LFxyXG4gICAgVEFCID0gOSxcclxuICAgIEVOVEVSID0gMTMsXHJcbiAgICBTSElGVCA9IDE2LFxyXG4gICAgQ1RSTCA9IDE3LFxyXG4gICAgQUxUID0gMTgsXHJcbiAgICBQQVVTRSA9IDE5LFxyXG4gICAgQ0FQU19MT0NLID0gMjAsXHJcbiAgICBFU0NBUEUgPSAyNyxcclxuICAgIFNQQUNFID0gMzIsXHJcbiAgICBQQUdFX1VQID0gMzMsXHJcbiAgICBQQUdFX0RPV04gPSAzNCxcclxuICAgIEVORCA9IDM1LFxyXG4gICAgSE9NRSA9IDM2LFxyXG4gICAgTEVGVF9BUlJPVyA9IDM3LFxyXG4gICAgVVBfQVJST1cgPSAzOCxcclxuICAgIFJJR0hUX0FSUk9XID0gMzksXHJcbiAgICBET1dOX0FSUk9XID0gNDAsXHJcbiAgICBJTlNFUlQgPSA0NSxcclxuICAgIERFTEVURSA9IDQ2LFxyXG4gICAgS0VZXzAgPSA0OCxcclxuICAgIEtFWV8xID0gNDksXHJcbiAgICBLRVlfMiA9IDUwLFxyXG4gICAgS0VZXzMgPSA1MSxcclxuICAgIEtFWV80ID0gNTIsXHJcbiAgICBLRVlfNSA9IDUzLFxyXG4gICAgS0VZXzYgPSA1NCxcclxuICAgIEtFWV83ID0gNTUsXHJcbiAgICBLRVlfOCA9IDU2LFxyXG4gICAgS0VZXzkgPSA1NyxcclxuICAgIEtFWV9BID0gNjUsXHJcbiAgICBLRVlfQiA9IDY2LFxyXG4gICAgS0VZX0MgPSA2NyxcclxuICAgIEtFWV9EID0gNjgsXHJcbiAgICBLRVlfRSA9IDY5LFxyXG4gICAgS0VZX0YgPSA3MCxcclxuICAgIEtFWV9HID0gNzEsXHJcbiAgICBLRVlfSCA9IDcyLFxyXG4gICAgS0VZX0kgPSA3MyxcclxuICAgIEtFWV9KID0gNzQsXHJcbiAgICBLRVlfSyA9IDc1LFxyXG4gICAgS0VZX0wgPSA3NixcclxuICAgIEtFWV9NID0gNzcsXHJcbiAgICBLRVlfTiA9IDc4LFxyXG4gICAgS0VZX08gPSA3OSxcclxuICAgIEtFWV9QID0gODAsXHJcbiAgICBLRVlfUSA9IDgxLFxyXG4gICAgS0VZX1IgPSA4MixcclxuICAgIEtFWV9TID0gODMsXHJcbiAgICBLRVlfVCA9IDg0LFxyXG4gICAgS0VZX1UgPSA4NSxcclxuICAgIEtFWV9WID0gODYsXHJcbiAgICBLRVlfVyA9IDg3LFxyXG4gICAgS0VZX1ggPSA4OCxcclxuICAgIEtFWV9ZID0gODksXHJcbiAgICBLRVlfWiA9IDkwLFxyXG4gICAgTEVGVF9NRVRBID0gOTEsXHJcbiAgICBSSUdIVF9NRVRBID0gOTIsXHJcbiAgICBTRUxFQ1QgPSA5MyxcclxuICAgIE5VTVBBRF8wID0gOTYsXHJcbiAgICBOVU1QQURfMSA9IDk3LFxyXG4gICAgTlVNUEFEXzIgPSA5OCxcclxuICAgIE5VTVBBRF8zID0gOTksXHJcbiAgICBOVU1QQURfNCA9IDEwMCxcclxuICAgIE5VTVBBRF81ID0gMTAxLFxyXG4gICAgTlVNUEFEXzYgPSAxMDIsXHJcbiAgICBOVU1QQURfNyA9IDEwMyxcclxuICAgIE5VTVBBRF84ID0gMTA0LFxyXG4gICAgTlVNUEFEXzkgPSAxMDUsXHJcbiAgICBNVUxUSVBMWSA9IDEwNixcclxuICAgIEFERCA9IDEwNyxcclxuICAgIFNVQlRSQUNUID0gMTA5LFxyXG4gICAgREVDSU1BTCA9IDExMCxcclxuICAgIERJVklERSA9IDExMSxcclxuICAgIEYxID0gMTEyLFxyXG4gICAgRjIgPSAxMTMsXHJcbiAgICBGMyA9IDExNCxcclxuICAgIEY0ID0gMTE1LFxyXG4gICAgRjUgPSAxMTYsXHJcbiAgICBGNiA9IDExNyxcclxuICAgIEY3ID0gMTE4LFxyXG4gICAgRjggPSAxMTksXHJcbiAgICBGOSA9IDEyMCxcclxuICAgIEYxMCA9IDEyMSxcclxuICAgIEYxMSA9IDEyMixcclxuICAgIEYxMiA9IDEyMyxcclxuICAgIE5VTV9MT0NLID0gMTQ0LFxyXG4gICAgU0NST0xMX0xPQ0sgPSAxNDUsXHJcbiAgICBTRU1JQ09MT04gPSAxODYsXHJcbiAgICBFUVVBTFMgPSAxODcsXHJcbiAgICBDT01NQSA9IDE4OCxcclxuICAgIERBU0ggPSAxODksXHJcbiAgICBQRVJJT0QgPSAxOTAsXHJcbiAgICBGT1JXQVJEX1NMQVNIID0gMTkxLFxyXG4gICAgR1JBVkVfQUNDRU5UID0gMTkyLFxyXG4gICAgT1BFTl9CUkFDS0VUID0gMjE5LFxyXG4gICAgQkFDS19TTEFTSCA9IDIyMCxcclxuICAgIENMT1NFX0JSQUNLRVQgPSAyMjEsXHJcbiAgICBTSU5HTEVfUVVPVEUgPSAyMjJcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9TY3JpcHRzL2tleV9jb2RlLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==