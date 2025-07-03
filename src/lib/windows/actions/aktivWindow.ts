import { windows, highestZIndex } from '../windowStore.svelte';

export function aktivWindow(id: string) {
	if (highestZIndex.value > 5000) {
		normalizeZIndices();
	}

	highestZIndex.value += 1;

	windows.forEach((w) => {
		if (w.id === id) {
			w.aktiv = true;
			w.zIndex = highestZIndex.value;
		} else {
			w.aktiv = false;
		}
	});
}

function normalizeZIndices() {
	// Fenster nach aktuellem zIndex absteigend sortieren
	windows.sort((a, b) => b.zIndex - a.zIndex);

	// Neu durchnummerieren ab 1
	let currentZ = 1;
	windows.forEach((w) => {
		w.zIndex = currentZ++;
	});

	// highestZIndex anpassen
	highestZIndex.value = currentZ;
}
