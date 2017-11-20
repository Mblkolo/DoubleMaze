import Vue from 'vue'

export default Vue.extend({
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
});