<script lang="ts">
	import { aktivWindow } from './actions/aktivWindow';
	import { closeWindow } from './actions/closeWindow';
	import { maximizeWindow } from './actions/maximizeWindow';
	import { minimizeWindow } from './actions/minimizeWindow';
	import { moveWindow } from './actions/moveWindow';
	import { resizeWindow } from './actions/resizeWindow';
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
	role="button"
	tabindex="0"
	use:resizeWindow={{ id: win.id, enabled: !win.minimized && !win.maximized }}
	class={`bg-base-200 flex flex-col rounded shadow-lg ${
		!win.minimized && win.maximized ? 'fixed top-0 left-0 h-screen w-screen' : 'fixed'
	}`}
	class:hidden={!win.visible || win.minimized}
	style="z-index: {win.aktiv ? 9000 : win.zIndex}; {!win.maximized && !win.minimized
		? `top: ${win.position.y}px; left: ${win.position.x}px; width: ${win.size.width}px; height: ${win.size.height}px;`
		: ''}"
	onmousedown={() => aktivWindow(win.id)}
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
