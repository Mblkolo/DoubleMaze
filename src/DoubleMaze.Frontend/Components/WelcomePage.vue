<script lang="ts" src="./WelcomePage.ts"></script>

<template>
    <Page class="welcome-page">
        <Title text="Лабиринт наперегонки" />
        <RatingTable class="center-block welcome-page__rating" :ratings="ratings" />
        <div style="text-align: center" class="welcome-page__play-button">
            <LinkButton text="Играть" size="big" v-on:click="$emit('start')" class="center-block" />
        </div>
    </Page>
</template>

<style>
    .welcome-page__rating {
        padding-top: 6rem;
    }

    .welcome-page__play-button {
        padding-top: 6rem;
    }
</style>

