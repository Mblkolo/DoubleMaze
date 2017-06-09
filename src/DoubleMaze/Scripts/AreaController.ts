import {IArea} from "./IArea.ts";
import {KeyCode} from "./key_code.ts";

export class AreaController {
    private areas: { [id: string]: IArea } = {};
    private currentArea: IArea = null;

    public constructor(sendData: (data: any) => void) {
        this.areas["loading"] = new LoadingArea(sendData);
        this.areas["welcome"] = new WelcomeArea(sendData);
        this.areas["game"] = new GameArea(sendData);
    }

    public gotoArea(area: string) {
        if (this.currentArea != null) {
            this.currentArea.leave();
        }

        this.currentArea = this.areas[area];
        this.currentArea.enter();
    }

    public process(data: any): void {
        if (data.command === "goto") {
            this.gotoArea(data.area);
            return;
        }

        if (this.currentArea != null) {
            this.currentArea.process(data);
        }
    }
}

class LoadingArea implements IArea {
    private sendData: (data: any) => void;

    public constructor(sendData: (data: any) => void) {
        this.sendData = sendData;
    }

    public enter() {
        this.sendData(JSON.stringify({ Type: "token", Token: localStorage.getItem("token") }));
    }

    public leave() {
    }

    public process(data: any) {
        if (data.command === "setToken") {
            localStorage.setItem("token", data.token);
        }
    }

}

class WelcomeArea implements IArea {
    private sendData: (data: any) => void;

    public constructor(sendData: (data: any) => void) {
        this.sendData = sendData;
    }

    public enter() {
        $("#main-content").html($("#welcome-area-tempalte").html());
        $(".welcome-play-button").on("click", (arg: JQueryEventObject) => this.onClick(arg));
    }

    public onClick(arg: JQueryEventObject) {
        const name = $("welcome-player-name").val();
        this.sendData(JSON.stringify({ Type: "PlayerName", Name: name }));
    }

    public leave() {
    }

    public process(data: any) {

    }

}

class GameArea implements IArea {
    private sendData: (data: any) => void;

    public constructor(sendData: (data: any) => void) {
        this.sendData = sendData;
    }

    public enter() {
        $("#main-content").html($("#game-area-tempalte").html());
        $("#game-canvas").on("keydown", (arg: JQueryEventObject) => this.onKeyDown(arg));
        $(".game-gameover-screen-button").on("click", (arg: JQueryEventObject) => this.onPlayAgain(arg));
    }

    public leave() {
        this.state = null;
    }

    private onKeyDown(e: JQueryEventObject) {
        if (e.keyCode === KeyCode.DOWN_ARROW || e.keyCode === KeyCode.KEY_S) {
            this.sendKey("Down", e);
        }
        if (e.keyCode === KeyCode.UP_ARROW || e.keyCode === KeyCode.KEY_W) {
            this.sendKey("Up", e);
        }
        if (e.keyCode === KeyCode.LEFT_ARROW || e.keyCode === KeyCode.KEY_A) {
            this.sendKey("Left", e);
        }
        if (e.keyCode === KeyCode.RIGHT_ARROW || e.keyCode === KeyCode.KEY_D) {
            this.sendKey("Right", e);
        }
    }

    private onPlayAgain(e: JQueryEventObject) {
        e.preventDefault();
        this.sendData(JSON.stringify({ type: "playAgain" }));
    }

    sendKey(key: string, e) {
        e.preventDefault();
        this.sendData(JSON.stringify({ type: "keyDown", Command: key }));
    }

    public process(data: any) {
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
    }

    private state: string;
    private mazeField: any;
    private isWin: boolean;

    private render() {
        $("#game-wait-screen").toggleClass("hidden", this.state !== "waitOpponent");
        $("#game-canvas-screen").toggleClass("hidden", this.state !== "mazeFeild");
        $("#game-gameover-screen").toggleClass("hidden", this.state !== "gameOver");
        if (this.state === "gameOver") {
            $("#game-gameover-screen .winner").toggleClass("hidden", this.isWin == false);
            $("#game-gameover-screen .looser").toggleClass("hidden", this.isWin);
        }
    }

    private currentPos = { x: 0, y: 0 };
    private serverPos = { x: 0, y: 0 };
    private serverTime = 0;
    private secondPlayerPos = { x: 0, y: 0 };

    private moveTo(myPos, enemyPos) {
        this.secondPlayerPos = enemyPos;

        this.currentPos.x = this.serverPos.x;
        this.currentPos.y = this.serverPos.y;

        this.serverPos.x = myPos.x;
        this.serverPos.y = myPos.y;

        this.serverTime = Date.now();
    }

    private drawOn(t) {
        const scale = 20;

        var ctx = ($("#game-canvas")[0] as HTMLCanvasElement).getContext("2d");
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

        const center = { x: x + scale / 2, y: y + scale / 2 };
        const delta = { x: this.serverPos.x - this.currentPos.x, y: this.serverPos.y - this.currentPos.y };
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
    }


    private drawLoop() {
        if (this.state !== "mazeFeild") {
            return;
        }

        var now = Date.now();
        var t = (now - this.serverTime) / 100;
        this.drawOn(t);

        requestAnimationFrame(() => this.drawLoop());
    }
}

