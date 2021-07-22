<script>
	import { fade } from "svelte/transition";
	let pos = { x: 0, y: 0 }, visible = false, menu;

	export function show(position) {
		pos = position;
		visible = true;
	}

	export function hide() {
		visible = false;
	}

	function onPageClick(e) {
		if (!menu || e.target === menu || menu.contains(e.target)) return;
		hide();
	}
</script>

<svelte:body on:click={onPageClick} />

{#if visible}
	<div
		class="menu"
		transition:fade={{ duration: 100 }}
		bind:this={menu}
		style="top: {pos.y}px; left: {pos.x}px;"
		on:click={hide}
	>
		<slot />
	</div>
{/if}

<style>
	.menu {
		position: absolute;
		display: grid;
		border: 1px solid #0003;
		box-shadow: 2px 2px 5px 0px #0002;
		background: white;
	}
</style>
