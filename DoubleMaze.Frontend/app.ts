import Vue from 'vue'

function LoadTemplate(name: string) : string {
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

let v = new Vue({
    el: "#content",
    template: `
    <div>
        <Header text="Йа заголовок!"  />
        <div>Hello {{name}}!</div>
        Name: <input v-model="name" type="text">

        <LinkButton text="Йа мелко кнопко" size="small" />
        <LinkButton text="Йа кнопко" />
        <LinkButton text="Йа грос кнопко" size="big" />
    </div>`,
    data: {
        name: "World"
    },
    components: {
        'LinkButton': buttonComponent,
        'Header': titleComponent
    }
});