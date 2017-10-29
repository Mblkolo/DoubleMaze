import Vue from 'vue'

window.onload = function () {
    console.log("hello world");
};

const buttonComponent = Vue.extend({
    template: '<a href="#" class="link-button"  :class="computedSize">{{text}}</a>',
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

let v = new Vue({
    el: "#content",
    template: `
    <div>
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
        'LinkButton': buttonComponent
    }
});