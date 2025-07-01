<script lang="ts">
	import MyWindow from '$lib/desktop/components/MyWindow.svelte';
	import type { MyWindow as TypeWindow } from '$lib/desktop/types/window';
	import Taskleiste from '$lib/desktop/components/Taskleiste.svelte';
	import Sandbox from '$lib/desktop/apps/Sandbox.svelte';
	import { windows } from '$lib/desktop/stores/windows.svelte';

	function openSandbox() {
		const win: TypeWindow = {
			id: windows.length + 1,
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
		};
		windows.push(win);
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
