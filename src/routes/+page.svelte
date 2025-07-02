<script lang="ts">
	import MyWindow from '$lib/windows/Window.svelte';
	import Taskleiste from '$lib/desktop/components/Taskleiste.svelte';
	import Sandbox from '$lib/desktop/apps/Sandbox.svelte';
	import { windowManager } from '$lib/windows/WindowManager.svelte';
	import { windows } from '$lib/windows/windowStore.svelte';

	function openSandbox() {
		windowManager.add({
			title: 'test',
			component: Sandbox,
			position: { x: 5, y: 30 },
			size: { width: 300, height: 900 },
			minimized: false,
			maximized: false,
			fullscreen: false,
			closable: true,
			resizable: true,
			movable: true,
			visible: true,
			zIndex: 0
		});
	}
</script>

<div class="h-screen w-screen bg-cover bg-center">
	{#each windows as win (win.id)}
		<MyWindow {win} />
	{/each}

	<Taskleiste ausrichtung="links" showSeconds={false} />

	<button class="btn btn-primary fixed top-40 right-4" on:click={openSandbox}>
		Sandbox öffnen
	</button>
</div>
