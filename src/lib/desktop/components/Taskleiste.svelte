<script lang="ts">
	import { windows } from '../stores/windows.svelte';
	import { minimizeWindow } from '../utils/window';
	type Ausrichtung = 'links' | 'mitte' | 'rechts';
	export let ausrichtung: Ausrichtung;
</script>

<nav
	class="bg-base-300 fixed bottom-0 z-50 flex h-14 min-h-fit w-full p-2"
	class:justify-start={ausrichtung === 'links'}
	class:justify-center={ausrichtung === 'mitte'}
	class:justify-end={ausrichtung === 'rechts'}
>
	{#each windows as win (win.id)}
		<button class="btn btn-square" on:click={() => minimizeWindow(win.id)}>🗕</button>
	{/each}
</nav>
