<script lang="ts">
	import { appState } from '$lib/stores/app-state.svelte';
	import DatasetItem from './DatasetItem.svelte';
</script>

<div class="dataset-list">
	{#each appState.datasets as dataset (dataset.id)}
		<DatasetItem {dataset} />
	{/each}

	{#if appState.datasets.length === 0}
		<p class="empty-state">No datasets uploaded yet. Upload CSV files above to get started.</p>
	{/if}
</div>

<style>
	.dataset-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.empty-state {
		text-align: center;
		color: #999;
		padding: 2rem;
		font-style: italic;
	}
</style>
