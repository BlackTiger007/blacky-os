<script lang="ts">
	import MyWindow from '$lib/windows/Window.svelte';
	import Taskleiste from '$lib/desktop/components/Taskleiste.svelte';
	import { windows } from '$lib/windows/windowStore.svelte';
	import Demo from '$lib/desktop/components/Demo.svelte';

	let open = $state(true);
</script>

<div class="h-screen w-screen bg-cover bg-center">
	{#each windows as win (win.id)}
		<MyWindow {win} />
	{/each}

	<Demo bind:open />

	<Taskleiste ausrichtung="links" showSeconds={false} />

	<button class="btn btn-primary fixed top-40 right-4" onclick={() => (open = true)}>Infos</button>
</div>
