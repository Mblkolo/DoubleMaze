import Vue from "vue"

export default Vue.extend({
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