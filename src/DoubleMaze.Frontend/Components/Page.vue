<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({    
    })
</script>

<template>
    <div class="page center-block">
        <slot>Какое-то содержимое</slot>
    </div>
</template>

<style>
    .page {
        background-color: #fff;
        width: 100rem; 
        padding: 5rem;
        font-size: 1.5rem;
        box-shadow: 2px 2px 4px 0 rgba(50, 50, 50, 0.5), 0 0 4px 0 rgba(50, 50, 50, 0.5) ;
        font-size: 2rem;
    }
</style>

