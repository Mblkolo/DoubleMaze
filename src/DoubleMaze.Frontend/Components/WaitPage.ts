import Vue from "vue";
import Page from "./Page.vue";
import Title from "./Title.vue";
import BotTable from "./BotTable.vue";
import LinkButton from "./LinkButton.vue";

export default Vue.extend({
    components: {
        Page,
        Title,
        BotTable,
        LinkButton
    },
    data: function () {
        return {
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
    }
})