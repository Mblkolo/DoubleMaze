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
    data: function () {
        return {
            ratings: [
                {
                    place: 56,
                    name: "Коля",
                    rating: "0",
                    isCurrent: false
                }, {
                    place: 57,
                    name: "Александр",
                    rating: "2",
                    isCurrent: false
                }, {
                    place: 58,
                    name: "Вася",
                    rating: "21",
                    isCurrent: true
                }, {
                    place: 59,
                    name: "Дима",
                    rating: "2",
                    isCurrent: false
                }, {
                    place: 60,
                    name: "Маша",
                    rating: "4",
                    isCurrent: false
                }]
        }
    }
})