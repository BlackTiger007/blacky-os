import { windows } from '../windowStore.svelte';

export function aktivWindow(id: string) {
	windows.forEach((w) => (w.aktiv = w.id === id));
}
