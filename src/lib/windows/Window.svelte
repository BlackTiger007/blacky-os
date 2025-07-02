<script lang="ts">
	import { closeWindow } from './actions/closeWindow';
	import { maximizeWindow } from './actions/maximizeWindow';
	import { minimizeWindow } from './actions/minimizeWindow';
	import { resizeWindow, moveWindow } from './actions/resizeWindow';
	import type { MyWindow } from './types';

	let { win }: { win: MyWindow } = $props();

	function close() {
		closeWindow(win.id);
	}

	function minimize() {
		minimizeWindow(win.id);
	}

	function maximize() {
		maximizeWindow(win.id);
	}
</script>

<div
	use:resizeWindow={{ id: win.id, enabled: !win.minimized && !win.maximized }}
	class={`bg-base-200 flex flex-col rounded shadow-lg ${
		win.minimized ? 'hidden' : win.maximized ? 'fixed top-0 left-0 h-screen w-screen' : 'fixed'
	}`}
	class:hidden={!win.visible}
	style={!win.maximized
		? `top: ${win.position.y}px; left: ${win.position.x}px; width: ${win.size.width}px; height: ${win.size.height}px;`
		: ''}
>
	<div
		class="flex items-center justify-between bg-gray-800 select-none"
		use:moveWindow={{ id: win.id, enabled: !win.minimized && !win.maximized }}
	>
		<span>{win.title}</span>
		<div>
			<button class="btn btn-square btn-ghost" onclick={minimize}>🗕</button>
			<button class="btn btn-square btn-ghost" onclick={maximize}>🗖</button>
			<button class="btn btn-square btn-ghost" onclick={close}>✖</button>
		</div>
	</div>

	<div class="flex-1 overflow-auto">
		{#if win.component}
			<win.component />
		{:else}
			<p class="text-error">Keine Komponente</p>
		{/if}
	</div>
</div>
