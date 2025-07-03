import { windows } from '../windowStore.svelte';

export function minimizeWindow(id: string) {
	const win = windows.find((w) => w.id === id);
	if (win) {
		win.minimized = !win.minimized;
	}
}
