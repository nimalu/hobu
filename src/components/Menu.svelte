<script>
    export let pos = { x: 0, y: 0 };
    let menu;

	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
    function onPageClick(e) {
        if (!menu || e.target === menu || menu.contains(e.target)) return;
        dispatch('onclickoutside')
    }
    function onEdit() {
        dispatch('onclickoutside')
        dispatch('onedit')
    }
</script>

<svelte:body on:click={onPageClick} />
<div transition:fade={{ duration: 100 }} bind:this={menu} style="top: {pos.y}px; left: {pos.x}px;">
    <div class="item" on:click={onEdit}>Edit</div>
</div>


<style>
	div {
		position: absolute;
		display: grid;
		border: 1px solid #0003;
		box-shadow: 2px 2px 5px 0px #0002;
		background: white;
	}
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