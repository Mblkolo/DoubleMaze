"use strict";
var key_code_ts_1 = require("./key_code.ts");
var AreaController = (function () {
    function AreaController(sendData) {
        this.areas = {};
        this.currentArea = null;
        this.areas["loading"] = function () { return new LoadingArea(sendData); };
        this.areas["welcome"] = function () { return new WelcomeArea(sendData); };
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
        $("#main-content").html($("#welcome-area-tempalte").html());
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
        $("#main-content").html($("#return-area-tempalte").html());
        $(".return-page__play-again-button").on("click", function (arg) { return _this.onClick("playAgain"); });
        $(".return-page__reset-button").on("click", function (arg) { return _this.onClick("resetPlayer"); });
    };
    ReturnArea.prototype.onClick = function (typeCommand) {
        this.sendData(JSON.stringify({ Type: "playAgain" }));
    };
    ReturnArea.prototype.leave = function () {
    };
    ReturnArea.prototype.process = function (data) {
        if (data.message === "playerInfo") {
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
//# sourceMappingURL=AreaController.js.map