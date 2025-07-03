import type { Action } from 'svelte/action';
import { windows } from '../windowStore.svelte';

export const moveWindow: Action<HTMLDivElement, { id: string; enabled: boolean }> = (
	node,
	options
) => {
	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let initialLeft = 0;
	let initialTop = 0;
	let newLeft = 0;
	let newTop = 0;

	function onPointerDown(event: PointerEvent) {
		if (!options.enabled) return;

		const parent = node.parentElement as HTMLElement;
		if (!parent) return;

		isDragging = true;
		startX = event.clientX;
		startY = event.clientY;

		const rect = parent.getBoundingClientRect();
		initialLeft = rect.left;
		initialTop = rect.top;

		document.addEventListener('pointermove', onPointerMove);
		document.addEventListener('pointerup', onPointerUp);
	}

	function onPointerMove(event: PointerEvent) {
		if (!isDragging) return;

		const deltaX = event.clientX - startX;
		const deltaY = event.clientY - startY;

		const parent = node.parentElement as HTMLElement;
		if (!parent) return;

		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight - 56;

		const rect = parent.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;

		newLeft = Math.max(0, Math.min(initialLeft + deltaX, screenWidth - width));
		newTop = Math.max(0, Math.min(initialTop + deltaY, screenHeight - height));

		parent.style.left = `${newLeft}px`;
		parent.style.top = `${newTop}px`;
	}

	function onPointerUp() {
		if (!isDragging) return;

		const win = windows.find((w) => w.id === options.id);
		if (win) {
			win.position.x = newLeft;
			win.position.y = newTop;
		}

		isDragging = false;
		document.removeEventListener('pointermove', onPointerMove);
		document.removeEventListener('pointerup', onPointerUp);
	}

	node.addEventListener('pointerdown', onPointerDown);

	return {
		update(newOptions) {
			options = newOptions;
		},
		destroy() {
			node.removeEventListener('pointerdown', onPointerDown);
		}
	};
};
