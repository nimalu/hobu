<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
</script>

<div class="item" on:click={() => dispatch("onaction")}><slot /></div>

<style>
    .item {
        padding: 4px 15px;
        cursor: default;
        font-size: 14px;
        display: flex;
        align-items: center;
        grid-gap: 5px;
    }
    .item:hover {
        background: rgb(224, 224, 224);
    }
</style>
