<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        props: ["name", "rating"]
    })
</script>

<template>
    <span>{{name}}<span class="player__level">{{rating}}</span></span>
</template>

<style>
    .player {

    }

    .player__level {
        vertical-align: super;
        font-size: 1rem;
        line-height: 0;
        background-color: #dedede;
        border-radius: 2rem;
        padding: 0.25rem 0.5rem;
    }
</style>

