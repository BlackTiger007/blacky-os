import type { Component } from 'svelte';

export type MyWindow = {
	id: number;
	title: string;
	icon?: string;
	component: Component;
	position: { x: number; y: number };
	size: { width: number; height: number };
	minimized: boolean;
	maximized: boolean;
	fullscreen: boolean;
	closable: boolean;
	resizable: boolean;
	movable: boolean;
	visible: boolean;
	zIndex: number;
};
