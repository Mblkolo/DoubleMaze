<script lang="ts" src="./LinkButton.ts"></script>

<template>
    <a href="#" class="link-button" :class="computedSize">{{text}}</a>
</template>

<style>
    .link-button {
        display: inline-block;
        text-decoration: none;
        color: #FFF;
        background: #227F32;
        text-transform: uppercase;
        font-weight: 500;
        text-align: center;
    }
        .link-button:hover {
            box-shadow: 2px 2px 4px 0 rgba(50, 50, 50, 0.5), 0 0 4px 0 rgba(50, 50, 50, 0.5);
        }

        .link-button:active {
            color: #227F32;
            background: #fff;
        }

        .link-button--big {
            font-size: 4rem;
            line-height: 8rem;
            padding: 0 4rem;
        }

        .link-button--middle {
            font-size: 3rem;
            line-height: 6rem;
            padding: 0 3rem;
        }

        .link-button--small{
            font-size: 2rem;
            line-height: 4rem;
            padding: 0 2rem;
        }
</style>

