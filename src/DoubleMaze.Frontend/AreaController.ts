import {IArea} from "./IArea";
import {KeyCode} from "./key_code";
import Vue from "vue";
import WelcomePage from "./Components/WelcomePage.vue";

export class AreaController {
    private areas: { [id: string]: () => IArea } = {};
    private currentArea: IArea;

    public constructor(sendData: (data: any) => void) {
        this.areas["loading"] = () => new LoadingArea(sendData);
        this.areas["welcome"] = () => new WelcomeArea(sendData);
        //this.areas["wait"] = () => new WaitArea(sendData);
        //this.areas["game"] = () => new GameArea(sendData);
        //this.areas["return"] = () => new ReturnArea(sendData);
    }

    public gotoArea(area: string) {
        if (this.currentArea != null) {
            this.currentArea.leave();
        }

        this.currentArea = this.areas[area]();
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
        this.sendData(JSON.stringify({
            Type: "token",
            PlayerId: localStorage.getItem("playerId"),
            Token: localStorage.getItem("token")
        }));
    }

    public leave() {
    }

    public process(data: any) {
        if (data.command === "setToken") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("playerId", data.playerId);
        }
    }

}

class WelcomeArea implements IArea {
    private sendData: (data: any) => void;
    private vm: any;

    public constructor(sendData: (data: any) => void) {
        this.sendData = sendData;
    }

    public enter() {
        const sendData = this.sendData;

        this.vm = new Vue({
            el: "#content",
            template: `<WelcomePage v-on:start="start" />`,
            components: {
                WelcomePage
            },
            methods: {
                start: () => {
                    sendData(JSON.stringify({ Type: "PlayerName", Name: name }));
                }
            }
        });
    }


    public leave() {
        this.vm.$destroy;
        this.vm.$el.innerHTML = "";
    }

    public process(data: any) {

    }

}

//class WaitArea implements IArea {
//    private sendData: (data: any) => void;

//    public constructor(sendData: (data: any) => void) {
//        this.sendData = sendData;
//    }

//    public enter() {
//        $("#main-content").html($("#wait-area-template").html());
//    }

//    public leave() {
//    }

//    public process(data: any) {
//        if (data.command === "showBots") {
//            for (let i = 0; i < data.bots.length; ++i) {
//                const bot = data.bots[i];

//                $(".wait-game-bots").append(`<tr><td>${i + 1}</td><td></td><td></td><td></td></tr>`);

//                const cells = $(".wait-game-bots").children().last().children();
//                cells.eq(1).text(bot.name).prop("title", bot.name);
//                cells.eq(2).text(bot.rating);

//                if (bot.isAwaible) {
//                    cells.eq(3).append("<a href=\"#play\" class=\"link-button\">Играть</a>");
//                    cells.eq(3).on("click", "a", bot.id, (arg: JQueryEventObject) => this.playWithBot(arg.data));
//                }
//                else {
//                    cells.eq(3).text("В игре");
//                }
//            }
//        }
//    }

//    public playWithBot(botId: string) {
//        this.sendData(JSON.stringify({ type: "playWithBot", botId: botId }));
//    }
//}

//class GameArea implements IArea {
//    private sendData: (data: any) => void;
//    private onKeyDownHandler = (arg: JQueryEventObject) => this.onKeyDown(arg);

//    public constructor(sendData: (data: any) => void) {
//        this.sendData = sendData;
//    }

//    public enter() {
//        $("#main-content").html($("#game-area-template").html());
//        $(document).on("keydown", this.onKeyDownHandler);
//        $(".game-gameover-screen-button").on("click", (arg: JQueryEventObject) => this.onPlayAgain(arg));
//    }

//    public leave() {
//        $(document).off("keydown", this.onKeyDownHandler);

//        this.state = null;
//    }

//    private onKeyDown(e: JQueryEventObject) {
//        if (e.keyCode == KeyCode.DOWN_ARROW
//            || e.keyCode == KeyCode.UP_ARROW
//            || e.keyCode == KeyCode.LEFT_ARROW
//            || e.keyCode == KeyCode.RIGHT_ARROW) {

//            e.preventDefault();
//        }

//        if (e.keyCode === KeyCode.DOWN_ARROW || e.keyCode === KeyCode.KEY_S) {
//            this.sendKey("Down", e);
//        }
//        if (e.keyCode === KeyCode.UP_ARROW || e.keyCode === KeyCode.KEY_W) {
//            this.sendKey("Up", e);
//        }
//        if (e.keyCode === KeyCode.LEFT_ARROW || e.keyCode === KeyCode.KEY_A) {
//            this.sendKey("Left", e);
//        }
//        if (e.keyCode === KeyCode.RIGHT_ARROW || e.keyCode === KeyCode.KEY_D) {
//            this.sendKey("Right", e);
//        }
//    }

//    private onPlayAgain(e: JQueryEventObject) {
//        e.preventDefault();
//        this.sendData(JSON.stringify({ type: "playAgain" }));
//    }

//    sendKey(key: string, e) {
//        e.preventDefault();
//        this.sendData(JSON.stringify({ type: "keyDown", Command: key }));
//    }

//    public process(data: any) {
//        if (data.command === "waitOpponent") {
//            this.state = "waitOpponent";
//        }
//        if (data.command === "mazeFeild") {
//            this.state = "mazeFeild";
//            this.mazeField = data;

//            this.drawLoop();
//        }
//        if (data.command === "gameOver") {
//            this.state = "gameOver";
//            this.gameOver = data;
//        }

//        if (data.command === "playerState")
//            this.moveTo(data.myPos, data.enemyPos);

//        this.render();
//    }

//    private state: string;
//    private mazeField: any;
//    private gameOver: any;

//    private render() {
//        $("#wait-game-screen").toggleClass("hidden", this.state !== "waitOpponent");
//        $("#game-canvas-screen").toggleClass("hidden", this.state !== "mazeFeild");
//        $("#game-gameover-screen").toggleClass("hidden", this.state !== "gameOver");

//        if (this.state === "mazeFeild") {
//            $(".game-canvas-my-name").text(this.mazeField.me.name).prop("title", this.mazeField.me.name);
//            $(".game-canvas-my-rating").text(this.mazeField.me.rating);
//            $(".game-canvas-enemy-name").text(this.mazeField.enemy.name).prop("title", this.mazeField.enemy.name);
//            $(".game-canvas-enemy-rating").text(this.mazeField.enemy.rating);
//        }

//        if (this.state === "gameOver") {
//            $("#game-gameover-screen .winner").toggleClass("hidden", this.gameOver.status !== "win");
//            $("#game-gameover-screen .looser").toggleClass("hidden", this.gameOver.status === "win");

//            for (let i = 0; i < this.gameOver.ratings.length; ++i) {
//                const rating = this.gameOver.ratings[i];
//                $(".game-canvas-ratings").append(`<tr><td>${i + 1}</td><td></td><td></td></tr>`);

//                const cells = $(".game-canvas-ratings").children().last().children();
//                cells.eq(1).text(rating.name).prop("title", rating.name);
//                cells.eq(2).text(rating.rating);

//                if (rating.isMe)
//                    cells.eq(0).addClass("my-name");

//                if (rating.isEnemy)
//                    cells.eq(0).addClass("enemy-name");
//            }
            


//        }
//    }

//    private serverTime = 0;
//    private playerPos: PlayerPosition;
//    private enemyPos: PlayerPosition;

//    private moveTo(myPos, enemyPos) {
//        if (this.enemyPos == null)
//            this.enemyPos = new PlayerPosition(enemyPos.x, enemyPos.y);
//        this.enemyPos.SetPos(enemyPos.x, enemyPos.y);

//        if (this.playerPos == null)
//            this.playerPos = new PlayerPosition(myPos.x, myPos.y);

//        this.playerPos.SetPos(myPos.x, myPos.y);

//        this.serverTime = Date.now();
//    }

//    private scale = 20;

//    private drawOn(t) {
//        const scale = this.scale;
//        const mazeField = this.mazeField.field

//        var ctx = ($("#game-canvas")[0] as HTMLCanvasElement).getContext("2d");
//        ctx.setTransform(1, 0, 0, 1, 0, 0);
//        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//        ctx.setTransform(1, 0, 0, 1, 10.5, 10.5);
//        ctx.beginPath();
//        ctx.lineWidth = 3;
//        ctx.lineCap = "round";
//        //ctx.strokeStyle = "#227F32";
//        ctx.strokeStyle = "#333";
//        for (let y = 0; y < mazeField.length; ++y) {
//            for (let x = 0; x < mazeField[y].length; ++x) {

//                var topLeft = { x: x * scale, y: y * scale };
//                var topRight = { x: (x + 1) * scale, y: y * scale };
//                var bottomRight = { x: (x + 1) * scale, y: (y + 1) * scale };
//                var bottomLeft = { x: x * scale, y: (y + 1) * scale };

//                if ((mazeField[y][x] & 1) !== 0) {
//                    ctx.moveTo(topLeft.x, topLeft.y);
//                    ctx.lineTo(topRight.x, topRight.y);
//                }

//                if ((mazeField[y][x] & 2) !== 0) {
//                    ctx.moveTo(topRight.x, topRight.y);
//                    ctx.lineTo(bottomRight.x, bottomRight.y);
//                }

//                if ((mazeField[y][x] & 4) !== 0) {
//                    ctx.moveTo(bottomRight.x, bottomRight.y);
//                    ctx.lineTo(bottomLeft.x, bottomLeft.y);
//                }

//                if ((mazeField[y][x] & 8) !== 0) {
//                    ctx.moveTo(bottomLeft.x, bottomLeft.y);
//                    ctx.lineTo(topLeft.x, topLeft.y);
//                }
//            }
//        }
//        ctx.stroke();
        

//        if (this.playerPos != null) {
//            this.DrawPlayer(this.playerPos, ctx, t, "#227F32", 4);
//        }

//        if (this.enemyPos != null) {
//            this.DrawPlayer(this.enemyPos, ctx, t, "#bf0d31", 3);
//        }
//    }

//    private DrawPlayer(playerPos: PlayerPosition, ctx: CanvasRenderingContext2D, progress: number, color: string, size: number) {
//        ctx.fillStyle = color;

//        const pos = playerPos.GetPostion(progress);

//        const center = { x: (pos.x + 0.5) * this.scale, y: (pos.y + 0.5) * this.scale };
//        const delta = playerPos.GetDelta();
//        ctx.beginPath();
//        ctx.moveTo(center.x - delta.x * 25, center.y - delta.y * 25);
//        ctx.lineTo(center.x + (delta.y === 0 ? 0 : 3), center.y + (delta.x === 0 ? 0 : 3));
//        ctx.lineTo(center.x + (delta.y === 0 ? 0 : -3), center.y + (delta.x === 0 ? 0 : -3));
//        ctx.closePath();
//        ctx.fill();

//        ctx.beginPath();
//        ctx.arc(center.x, center.y, size, 0, 2 * Math.PI);
//        ctx.closePath();
//        ctx.fill();
//    }


//    private drawLoop() {
//        if (this.state !== "mazeFeild") {
//            return;
//        }

//        var now = Date.now();
//        var t = (now - this.serverTime) / 100;
//        this.drawOn(t);

//        requestAnimationFrame(() => this.drawLoop());
//    }
//}

//class PlayerPosition {
//    public currentPos: { x: number, y: number };
//    public nextPos: { x: number, y: number };

//    public constructor(x: number, y: number) {
//        this.currentPos = { x: x, y: y }
//        this.nextPos = { x: x, y: y }
//    }

//    public SetPos(x: number, y: number) {
//        this.currentPos.x = this.nextPos.x;
//        this.currentPos.y = this.nextPos.y;

//        this.nextPos.x = x;
//        this.nextPos.y = y;
//    }
    
//    public GetPostion(progress: number) {
//        return {
//            x: (this.currentPos.x * (1 - progress) + this.nextPos.x * progress),
//            y: (this.currentPos.y * (1 - progress) + this.nextPos.y * progress)
//        }
//    }

//    public GetDelta() {
//        return {
//            x: (this.nextPos.x - this.currentPos.x),
//            y: (this.nextPos.y - this.currentPos.y)
//        }
//    }

//}


//class ReturnArea implements IArea {
//    private sendData: (data: any) => void;

//    public constructor(sendData: (data: any) => void) {
//        this.sendData = sendData;
//    }

//    public enter() {
//        $("#main-content").html($("#return-area-template").html());
//        $(".return-page__play-again-button").on("click", (arg: JQueryEventObject) => this.onClick("playAgain"));
//        $(".return-page__reset-button").on("click", (arg: JQueryEventObject) => this.onClick("resetPlayer"));
//    }

//    public onClick(typeCommand: string) {
//        this.sendData(JSON.stringify({ Type: typeCommand }));
//    }

//    public leave() {
//    }

//    private playerInfo;
//    public process(data: any) {
//        if (data.command === "playerInfo") {
//            this.playerInfo = data;
//            this.render();
//        }
//    }

//    private render() {
//        if (this.playerInfo != null) {
//            $(".return-page__my-name").text(this.playerInfo.name)
//            $(".return-page__my-rating").text(this.playerInfo.rating)
//        }
        
//    }

//}
