<script lang="ts" src="./Title.ts"></script>

<template>
    <h1 class="title" :class="computedSize">{{text}}</h1>
</template>

<style>
   .title
    {
        text-align: center;
        color: #227F32;
        text-transform: uppercase;
        font-size: 5rem;
        margin: 0;
    }

    .title--small
    {
        font-size: 4rem;
    }
</style>

