<script lang="ts" src="./BotTable.ts"></script>

<template>
    <table class="bots">
        <tr v-for="line in bots">
            <td class="bots__name"><Player :name="line.name" :rating="line.rating" /></td>
            <td>
                <LinkButton v-if="line.isAwaible" text="Играть" :value="line.id" size="small"
                             @click="botId => $emit('playWithBot', botId)" />
                <span v-else>В игре</span>
            </td>
        </tr>
    </table>
</template>

<style>
    .bots 
    {
        width: 25rem;
        line-height: 5rem;
    }

    .bots__name
    {
        width: 12rem;
    }

    .bots >tbody> tr > td:nth-child(2)
    {
        width: 15rem;
        text-align: right;
    }
</style>

