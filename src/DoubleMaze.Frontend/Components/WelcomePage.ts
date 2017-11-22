import Vue from "vue";
import Page from "./Page.vue";
import Title from "./Title.vue";
import RatingTable from "./RatingTable.vue";
import LinkButton from "./LinkButton.vue";

export default Vue.extend({
    components: {
        Page,
        Title,
        RatingTable,
        LinkButton
    },
    props: ["ratings"]
})