import type { Action } from 'svelte/action';
import { windows } from '../stores/windows.svelte';

export function closeWindow(id: number) {
	// finde Index des zu entfernenden Fensters
	const idx = windows.findIndex((w) => w.id === id);
	if (idx !== -1) {
		// entferne genau 1 Element ab Index idx
		windows.splice(idx, 1);
	}
}

export function minimizeWindow(id: number) {
	const win = windows.find((w) => w.id === id);
	if (win) {
		win.minimized = !win.minimized;
		win.maximized = !win.maximized;
	}
}

export function maximizeWindow(id: number) {
	const win = windows.find((w) => w.id === id);
	if (win) {
		win.maximized = !win.maximized;
	}
}

export const resizeWindow: Action<HTMLDivElement, boolean> = (node, enabled = true) => {
	const directions = [
		'east',
		'west',
		'north',
		'south',
		'northwest',
		'northeast',
		'southwest',
		'southeast'
	] as const;

	type Direction = (typeof directions)[number];

	let activeDirection: Direction | null = null;
	let initialRect: DOMRect | null = null;
	let initialPos: { x: number; y: number } | null = null;

	const grabbers: HTMLElement[] = [];

	function createGrabber(direction: Direction) {
		const grabber = document.createElement('div');
		grabber.dataset.direction = direction;

		grabber.classList.add('absolute', 'bg-gray-600/30', 'z-50', ...getDirectionClasses(direction));

		grabber.addEventListener('pointerdown', onPointerDown);
		node.appendChild(grabber);
		grabbers.push(grabber);
	}

	function getDirectionClasses(direction: Direction): string[] {
		const base = ['bg-gray-600'];
		switch (direction) {
			case 'east':
				return [
					...base,
					'w-1.5',
					'h-full',
					'right-0',
					'top-1/2',
					'-translate-y-1/2',
					'cursor-ew-resize'
				];
			case 'west':
				return [
					...base,
					'w-1.5',
					'h-full',
					'left-0',
					'top-1/2',
					'-translate-y-1/2',
					'cursor-ew-resize'
				];
			case 'north':
				return [
					...base,
					'h-1.5',
					'w-full',
					'top-0',
					'left-1/2',
					'-translate-x-1/2',
					'cursor-ns-resize'
				];
			case 'south':
				return [
					...base,
					'h-1.5',
					'w-full',
					'bottom-0',
					'left-1/2',
					'-translate-x-1/2',
					'cursor-ns-resize'
				];
			case 'northwest':
				return [...base, 'w-2.5', 'h-2.5', 'top-0', 'left-0', 'cursor-nwse-resize', 'rounded-sm'];
			case 'northeast':
				return [...base, 'w-2.5', 'h-2.5', 'top-0', 'right-0', 'cursor-nesw-resize', 'rounded-sm'];
			case 'southwest':
				return [
					...base,
					'w-2.5',
					'h-2.5',
					'bottom-0',
					'left-0',
					'cursor-nesw-resize',
					'rounded-sm'
				];
			case 'southeast':
				return [
					...base,
					'w-2.5',
					'h-2.5',
					'bottom-0',
					'right-0',
					'cursor-nwse-resize',
					'rounded-sm'
				];
			default:
				return base;
		}
	}

	function onPointerDown(event: PointerEvent) {
		const target = event.target as HTMLElement;
		activeDirection = target.dataset.direction as Direction;
		if (!activeDirection) return;

		initialRect = node.getBoundingClientRect();
		initialPos = { x: event.clientX, y: event.clientY };

		document.addEventListener('pointermove', onPointerMove);
		document.addEventListener('pointerup', onPointerUp);
	}

	function onPointerMove(event: PointerEvent) {
		if (!activeDirection || !initialRect || !initialPos) return;

		const deltaX = event.clientX - initialPos.x;
		const deltaY = event.clientY - initialPos.y;

		if (activeDirection.includes('east')) {
			node.style.width = `${initialRect.width + deltaX}px`;
		}
		if (activeDirection.includes('west')) {
			node.style.width = `${initialRect.width - deltaX}px`;
			node.style.left = `${initialRect.left + deltaX}px`;
		}
		if (activeDirection.includes('south')) {
			node.style.height = `${initialRect.height + deltaY}px`;
		}
		if (activeDirection.includes('north')) {
			node.style.height = `${initialRect.height - deltaY}px`;
			node.style.top = `${initialRect.top + deltaY}px`;
		}
	}

	function onPointerUp() {
		activeDirection = null;
		initialRect = null;
		initialPos = null;

		document.removeEventListener('pointermove', onPointerMove);
		document.removeEventListener('pointerup', onPointerUp);
	}

	function destroyGrabbers() {
		grabbers.forEach((g) => {
			g.removeEventListener('pointerdown', onPointerDown);
			g.remove();
		});
		grabbers.length = 0;
	}

	function setEnabled(state: boolean) {
		if (state && grabbers.length === 0) {
			directions.forEach(createGrabber);
		} else if (!state) {
			destroyGrabbers();
		}
	}

	// initial
	setEnabled(enabled);

	return {
		update(newEnabled: boolean) {
			setEnabled(newEnabled);
		},
		destroy() {
			destroyGrabbers();
		}
	};
};
