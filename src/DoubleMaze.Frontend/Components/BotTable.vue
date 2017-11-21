<script lang="ts" src="./BotTable.ts"></script>

<template>
    <table class="bots">
        <tr v-for="line in bots">
            <td><Player :name="line.name" :rating="line.rating" /></td>
            <td><LinkButton text="Играть" size="small" /></td>
        </tr>
    </table>
</template>

<style>
    .bots 
    {
        width: 25rem;
        line-height: 5rem;
    }

    .bots >tbody> tr > td:nth-child(1)
    {
        width: 10rem;
    }

    .bots >tbody> tr > td:nth-child(2)
    {
        width: 15rem;
        text-align: right;
    }
</style>

