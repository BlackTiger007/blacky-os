<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let length = $state(0);

	function resize() {
		length = Math.trunc(window.innerWidth / 112) * Math.trunc(window.innerHeight / 112);
	}

	onMount(() => {
		resize();

		onresize = () => resize();
	});
</script>

<main
	class="flex h-screen max-h-screen min-h-screen w-full max-w-full min-w-full flex-wrap overflow-hidden"
>
	{#if browser}
		{#each { length }, item}
			<div class="m-auto h-28 w-28 border-2">
				{item + 1}
			</div>
		{/each}
	{/if}
</main>
