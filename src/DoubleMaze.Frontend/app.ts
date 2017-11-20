import Vue from 'vue'
import {AreaController } from "./AreaController";

function LoadTemplate(name: string): string {
    const element = document.getElementById(name);
    return (element == null) ? "Bad template name" : element.innerHTML;
}

window.onload = function () {
    console.log("hello world");
};

const buttonComponent = Vue.extend({
    template: LoadTemplate("link-button-template"),
    props: {
        'text': {
            type: String,
            default: "###"
        },
        'size': {
            type: String,
            default: "middle"
        }
    },

    computed: {
        computedSize: function (): string {
            return "link-button--" + this.size;
        }
    }
})

const titleComponent = Vue.extend({
    template: LoadTemplate("title-template"),
    props: {
        'text': {
            type: String,
            default: "###"
        },
        'size': {
            type: String,
            default: null
        }
    },

    computed: {
        computedSize: function (): string {
            return this.size === null ? "" : "title--" + this.size;
        }
    }
})

const pageComponent = Vue.extend({
    template: `
        <div class="content center-block">
            <slot>Какое-то содержимое</slot>
        </div>
    `
})

const playerComponent = Vue.extend({
    template: `
        <span>{{name}}<span class="player__level">{{rating}}</span></span>
    `,
    props: ["name", "rating"]
})

const ratingTableComponent = Vue.extend({
    template: `
        <table class="rating">
            <tr v-for="line in ratings" :class="(line.isCurrent ? 'rating__select' : '' )">
                <td>{{line.place}}</td>
                <td><Player :name="line.name" :rating="line.rating" /></td>
            </tr>
        </table>
    `,
    props: ["ratings"],
    components: {
        'Player': playerComponent
    }
})

const botTableComponent = Vue.extend({
    template: `
        <table class="bots">
            <tr v-for="line in bots">
                <td><Player :name="line.name" :rating="line.rating" /></td>
                <td><LinkButton text="Играть" size="small" /></td>
            </tr>
        </table>
    `,
    props: ["bots"],
    components: {
        'Player': playerComponent,
        'LinkButton': buttonComponent
    }
})


let v = new Vue({
    el: "#content",
    template: `
        <div>
            <Page class=welcome-page v-if="welcome != null">
                <Header text="Лабиринт наперегонки"  />
                <RatingTable class="center-block welcome-page__rating" :ratings="welcome.ratings" />
                <div style="text-align: center" class="welcome-page__play-button" >
                    <LinkButton text="Играть" size="big" class="center-block"/>
                </div>
            </Page>

            <Page class="wait-page"  v-if="wait != null">
                <LinkButton text="Назад" size="small" />
                <Header text="Дождись противника" size="small"  />
                <img src=images/preloader.gif class="center-block top-padding4" />
                <div class="wait-page__online top-padding2">Игроков онлайн: {{wait.online_count}}</div>
                <div class="wait-page__delimeter top-padding6">Или</div>

                <Header text="Сыграй с ботом" size="small" class="top-padding2"  />
                <BotTable :bots="wait.bots" class="center-block top-padding2" />
            </Page>
        </div>
`,
    data: {
        welcome: {
            ratings: [
                {
                    place: 56,
                    name: "Коля",
                    rating: "0",
                    isCurrent: false
                }, {
                    place: 57,
                    name: "Александр",
                    rating: "2",
                    isCurrent: false
                }, {
                    place: 58,
                    name: "Вася",
                    rating: "21",
                    isCurrent: true
                }, {
                    place: 59,
                    name: "Дима",
                    rating: "2",
                    isCurrent: false
                }, {
                    place: 60,
                    name: "Маша",
                    rating: "4",
                    isCurrent: false
                }]
        },
        wait: {
            online_count: 6,
            bots: [
                {
                    name: "Бот 5",
                    rating: 0
                },
                {
                    name: "Бот 7",
                    rating: 3
                },
                {
                    name: "Бот 9",
                    rating: 78
                },
                {
                    name: "Бот 11",
                    rating: 1293
                },
                {
                    name: "Бот 19",
                    rating: 12933
                }
            ]
        }
    },
    components: {
        'LinkButton': buttonComponent,
        'Header': titleComponent,
        'Page': pageComponent,
        'RatingTable': ratingTableComponent,
        'Player': playerComponent,
        'BotTable': botTableComponent
    }
});







const loc = window.location;
let uri = (loc.protocol === "https:") ? "wss:" : "ws:";
uri += "//" + loc.host + loc.pathname.split('/').slice(0, -1).join('/') + "/test";

let controller = new AreaController(sendMessage);
let socket: WebSocket;
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

function sendMessage(message: string) {
    console.log("Sending: " + message);
    socket.send(message);
}