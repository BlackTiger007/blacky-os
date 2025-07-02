import { windows } from './windowStore.svelte';
import type { MyWindow } from './types';

export function addWindow(params: Omit<MyWindow, 'id'> & Partial<Pick<MyWindow, 'id'>>) {
	const windowWithId: MyWindow = {
		...params,
		id: params.id ?? `window-${windows.length}-${crypto.randomUUID()}`
	};

	windows.push(windowWithId);
}
