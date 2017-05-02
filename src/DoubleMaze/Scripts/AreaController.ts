import {IArea} from "./IArea.ts";

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
    }

    public leave() {
    }

    public process(data: any) {
        if (data.command === "waitOpponent") {
            this.state = "waitOpponent";
        }
        if (data.command === "mazeFeild") {
            this.state = "mazeFeild";
        }
        if (data.command === "gameOver") {
            this.state = "gameOver";
        }

        this.render();
    }

    private state: string;

    private render() {
        $("#game-wait-screen").toggleClass("hidden", this.state !== "waitOpponent");
        $("#game-canvas-screen").toggleClass("hidden", this.state !== "mazeFeild");
        $("#game-gameover-screen").toggleClass("hidden", this.state !== "gameOver");
    }
}

