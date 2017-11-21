<script lang="ts" src="./RatingTable.ts"></script>

<template>
    <table class="rating">
        <tr v-for="line in ratings" :class="(line.isCurrent ? 'rating__select' : '' )">
            <td>{{line.place}}</td>
            <td><Player :name="line.name" :rating="line.rating" /></td>
        </tr>
    </table>
</template>

<style>

.rating
{
    /*background-color: #eee;*/
    table-layout: fixed;
    border-collapse: collapse;
    width: 35rem;
    font-size: 2rem;
    line-height:5rem;
}

    .rating tr td:nth-child(1)
    {
        text-align: right;
        width: 5rem;
        padding-right: 3rem;
    }

    .rating tr td:nth-child(2)
    {
        width: 30rem;
    }


    .rating__select
    {
        box-shadow: 2px 2px 4px 0 rgba(50, 50, 50, 0.5), 0 0 4px 0 rgba(50, 50, 50, 0.5) ;
    }

</style>

