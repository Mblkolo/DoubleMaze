import {IArea} from "./IArea.ts";

export class AreaController {
    private areas: { [id: string]: IArea } = {};
    private currentArea: IArea = null;

    public constructor(sendData: (data) => void) {
        this.areas["loading"] = new LoadingArea(sendData);
        this.areas["welcome"] = new WelcomeArea(sendData);
        this.areas["game"] = new GameArea(sendData);
    }

    public gotoArea(area: string) {
        if (this.currentArea != null)
            this.currentArea.leave();

        this.currentArea = this.areas[area];
        this.currentArea.enter();
    }

    public process(data: any): void {
        if (data.command === "goto") {
            this.gotoArea(data.area);
            return;
        }

        if (this.currentArea != null)
            this.currentArea.process(data);
    }
}

class LoadingArea implements IArea {
    private sendData: (data) => void;

    public constructor(sendData: (data) => void) {
        this.sendData = sendData;
    }

    public enter() {
        this.sendData(JSON.stringify({ Type: "token", Token: localStorage.getItem("token") }))
    }

    public leave() {
    }

    public process(data: any) {
        if (data.command == "setToken") {
            localStorage.setItem("token", data.Token)
        }
    }

}

class WelcomeArea implements IArea{
    private sendData: (data) => void;

    public constructor(sendData: (data) => void) {
        this.sendData = sendData;
    }

    public enter() {
    }

    public leave() {
    }

    public process(data: any) {

    }

}

class GameArea implements IArea {
    private sendData: (data) => void;

    public constructor(sendData: (data) => void) {
        this.sendData = sendData;
    }

    public enter() {
    }

    public leave() {
    }

    public process(data: any) {

    }
}

