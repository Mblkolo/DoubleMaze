import Vue from "vue"
import Player from "./Player.vue"
import LinkButton from "./LinkButton.vue"

export default Vue.extend({
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
         Player,
         LinkButton
    }
})
