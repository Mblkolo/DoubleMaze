<script lang="ts" src="./WaitPage.ts"></script>

<template>
    <Page class="wait-page">
        <LinkButton text="Назад" size="small" />
        <Title text="Дождись противника" size="small" />
        <img src=images/preloader.gif class="center-block top-padding4" />
        <div class="wait-page__online top-padding2">Игроков онлайн: {{online_count}}</div>
        <div class="wait-page__delimeter top-padding6">Или</div>

        <Title text="Сыграй с ботом" size="small" class="top-padding2" />
        <BotTable :bots="bots" class="center-block top-padding2" />
    </Page>
</template>

<style>
    .wait-page__delimeter {
        text-align: center;
    }

    .wait-page__online {
        text-align: center;
    }
</style>

