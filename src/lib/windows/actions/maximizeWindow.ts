import { windows } from '../windowStore.svelte';

export function maximizeWindow(id: string) {
	const win = windows.find((w) => w.id === id);
	if (win) {
		win.maximized = !win.maximized;
	}
}
