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
    props: ["online_count", "bots"]
})