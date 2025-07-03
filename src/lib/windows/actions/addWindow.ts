import { highestZIndex, windows } from '../windowStore.svelte';
import type { MyWindow } from '../types';
import { aktivWindow } from './aktivWindow';

export function addWindow(
	params: Partial<Omit<MyWindow, 'component'>> & Pick<MyWindow, 'component'>
) {
	const { id, ...rest } = params;

	const windowWithId: MyWindow = Object.assign(
		{
			id: id ?? `window-${windows.length}-${crypto.randomUUID()}`,
			title: 'Neues Fenster',
			position: { x: 100, y: 100 },
			size: { width: 800, height: 600 },
			minimized: false,
			maximized: false,
			fullscreen: false,
			closable: true,
			resizable: true,
			movable: true,
			visible: true,
			aktiv: true,
			zIndex: highestZIndex.value + 1
		},
		rest
	);

	windows.push(windowWithId);

	aktivWindow(windowWithId.id);
}
