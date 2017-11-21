import Vue from "vue"
import Player from "./Player.vue"

export default Vue.extend({
    props: ["ratings"],
    components: {
        Player
    }
})