<script lang="ts">
	import { minimizeWindow } from '$lib/windows/actions/minimizeWindow';
	import { windows } from '../../windows/windowStore.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { addWindow } from '$lib/windows/actions/addWindow';
	import Sandbox from '$lib/desktop/apps/Sandbox.svelte';

	type Ausrichtung = 'links' | 'mitte' | 'rechts';

	let {
		ausrichtung = 'mitte',
		showSeconds = false
	}: { ausrichtung: Ausrichtung; showSeconds: boolean } = $props();

	let date = $state(new Date());
	let interval: ReturnType<typeof setInterval>;

	function updateTime() {
		date = new Date();
	}

	function addNewWindow() {
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		// Zufällige Position innerhalb des Bildschirms, mit Rand
		const posX = Math.floor(Math.random() * (screenWidth - 400)) + 50;
		const posY = Math.floor(Math.random() * (screenHeight - 300)) + 50;

		// Zufällige Größe zwischen Minimal- und Maximalwerten
		const width = Math.floor(Math.random() * (600 - 300)) + 300;
		const height = Math.floor(Math.random() * (600 - 300)) + 300;

		addWindow({
			title: 'Test Window W1 ' + windows.length,
			component: Sandbox,
			position: { x: posX, y: posY },
			size: { width, height }
		});
	}

	onMount(() => {
		updateTime();
		const intervalTime = showSeconds ? 1000 : 60000;
		interval = setInterval(updateTime, intervalTime);
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
		<button class="btn" onclick={addNewWindow}>New Window</button>
		{#each windows as win (win.id)}
			<button class="btn btn-square" onclick={() => minimizeWindow(win.id)}>🗕</button>
		{/each}
	</div>

	<time class="grid text-right text-xs" datetime={date.toISOString()}>
		<p>
			{#if showSeconds}
				{date.toLocaleTimeString()}
			{:else}
				{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
			{/if}
		</p>
		<p>{date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
	</time>
</nav>
