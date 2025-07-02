import { windows } from '../windowStore.svelte';

export function closeWindow(id: string) {
	// finde Index des zu entfernenden Fensters
	const idx = windows.findIndex((w) => w.id === id);
	if (idx !== -1) {
		// entferne genau 1 Element ab Index idx
		windows.splice(idx, 1);
	}
}
