<script lang="ts">
	import { windows } from '../stores/windows.svelte';
	import { minimizeWindow } from '../utils/window';
	import { onMount, onDestroy } from 'svelte';

	type Ausrichtung = 'links' | 'mitte' | 'rechts';
	let { ausrichtung = 'mitte' }: { ausrichtung: Ausrichtung } = $props();

	let date = $state(new Date());
	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		interval = setInterval(() => {
			date = new Date();
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<nav class="bg-base-300 fixed bottom-0 z-50 flex h-14 w-full items-center justify-between p-2">
	<div
		class="flex flex-1"
		class:justify-start={ausrichtung === 'links'}
		class:justify-center={ausrichtung === 'mitte'}
		class:justify-end={ausrichtung === 'rechts'}
	>
		{#each windows as win (win.id)}
			<button class="btn btn-square" onclick={() => minimizeWindow(win.id)}>🗕</button>
		{/each}
	</div>

	<time class="grid text-right text-xs" datetime={date.toISOString()}>
		<p>{date.toLocaleTimeString()}</p>
		<p>{date.toLocaleDateString()}</p>
	</time>
</nav>
