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

export const resizeWindow: Action<HTMLDivElement, { id: number; enabled: boolean }> = (
	node,
	{ id, enabled = true }
) => {
	const win = windows.find((w) => w.id === id);
	if (!win) {
		console.warn(`Window with id ${id} not found for resizing.`);
		return;
	}
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

	// Optionale Mindestgrößen in px
	const minWidth = 200;
	const minHeight = 100;
	// Höhe der Taskleiste in px (z.B. 56)
	const taskbarHeight = 56;

	function createGrabber(direction: Direction) {
		const grabber = document.createElement('div');
		grabber.dataset.direction = direction;

		grabber.classList.add(
			'absolute',
			'bg-gray-600/30',
			'z-50',
			'user-select-none',
			...getDirectionClasses(direction)
		);

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

		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight - taskbarHeight;

		let newWidth = initialRect.width;
		let newHeight = initialRect.height;
		let newLeft = initialRect.left;
		let newTop = initialRect.top;

		if (activeDirection.includes('east')) {
			newWidth = Math.min(
				Math.max(initialRect.width + deltaX, minWidth),
				screenWidth - initialRect.left
			);
		}
		if (activeDirection.includes('west')) {
			newWidth = Math.min(Math.max(initialRect.width - deltaX, minWidth), initialRect.right);
			newLeft = Math.min(Math.max(initialRect.left + deltaX, 0), initialRect.right - minWidth);
		}
		if (activeDirection.includes('south')) {
			newHeight = Math.min(
				Math.max(initialRect.height + deltaY, minHeight),
				screenHeight - initialRect.top
			);
		}
		if (activeDirection.includes('north')) {
			newHeight = Math.min(Math.max(initialRect.height - deltaY, minHeight), initialRect.bottom);
			newTop = Math.min(Math.max(initialRect.top + deltaY, 0), initialRect.bottom - minHeight);
		}

		node.style.width = `${newWidth}px`;
		node.style.height = `${newHeight}px`;
		node.style.left = `${newLeft}px`;
		node.style.top = `${newTop}px`;

		// Update the window size in the store
		if (win) {
			win.size.width = newWidth;
			win.size.height = newHeight;
			win.position.x = newLeft;
			win.position.y = newTop;
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
		} else {
			destroyGrabbers();
		}
	}

	setEnabled(enabled);

	return {
		update({ enabled }) {
			setEnabled(enabled);
		},
		destroy() {
			destroyGrabbers();
		}
	};
};

export const moveWindow: Action<HTMLDivElement, { id: number; enabled: boolean }> = (
	node,
	options
) => {
	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let initialLeft = 0;
	let initialTop = 0;

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

		// Bildschirmgrenzen inkl. Taskleistenhöhe
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight - 56;

		// Neue Position berechnen
		let newLeft = initialLeft + deltaX;
		let newTop = initialTop + deltaY;

		// Begrenzen
		const rect = parent.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;

		newLeft = Math.max(0, Math.min(newLeft, screenWidth - width));
		newTop = Math.max(0, Math.min(newTop, screenHeight - height));

		parent.style.left = `${newLeft}px`;
		parent.style.top = `${newTop}px`;
	}

	function onPointerUp() {
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
