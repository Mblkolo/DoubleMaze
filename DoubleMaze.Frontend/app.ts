import Vue from 'vue'

window.onload = function () {
    console.log("hello world");
};

let v = new Vue({
    el: "#content",
    template: `
    <div>
        <div>Hello {{name}}!</div>
        Name: <input v-model="name" type="text">
    </div>`,
    data: {
        name: "World"
    }
});