import type { Component } from 'svelte';
import type { MyWindow } from './types';
import { windows } from './windowStore.svelte';

/**
 * Repräsentiert ein einzelnes Fenster innerhalb des Window-Managers.
 */
export class Window implements MyWindow {
	public readonly id: string = crypto.randomUUID();
	title: string;
	icon?: string;
	component: Component;
	position: { x: number; y: number };
	size: { width: number; height: number };
	minimized: boolean = false;
	maximized: boolean = false;
	fullscreen: boolean = false;
	closable: boolean = true;
	resizable: boolean = true;
	movable: boolean = true;
	visible: boolean = true;
	zIndex: number;

	/**
	 * Erstellt ein neues Fenster.
	 * @param options Fenster-Eigenschaften
	 */
	constructor(options: {
		title: string;
		component: Component;
		icon?: string;
		position?: { x: number; y: number };
		size?: { width: number; height: number };
		minimized: boolean;
		maximized: boolean;
		fullscreen: boolean;
		closable?: boolean;
		resizable?: boolean;
		movable?: boolean;
		visible?: boolean;
		zIndex?: number;
	}) {
		this.title = options.title;
		this.component = options.component;
		this.icon = options.icon;
		this.position = options.position ?? { x: 100, y: 100 };
		this.size = options.size ?? { width: 800, height: 600 };
		this.minimized = options.minimized ?? false;
		this.maximized = options.maximized ?? false;
		this.fullscreen = options.fullscreen ?? false;
		this.closable = options.closable ?? true;
		this.resizable = options.resizable ?? true;
		this.movable = options.movable ?? true;
		this.visible = options.visible ?? true;
		this.zIndex = options.zIndex ?? 1;
	}
}

export class WindowManager {
	add(options: ConstructorParameters<typeof Window>[0]) {
		const win = new Window(options);
		windows.push(win);
	}

	remove(id: string) {
		const index = windows.findIndex((w) => w.id === id);
		if (index !== -1) {
			windows.splice(index, 1);
		}
	}

	findById(id: string) {
		return windows.find((w) => w.id === id);
	}
}

export const windowManager = new WindowManager();
