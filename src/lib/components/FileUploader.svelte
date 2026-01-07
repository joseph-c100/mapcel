<script lang="ts">
	import { appState } from '$lib/stores/app-state.svelte';
	import { parseCSVFile } from '$lib/utils/csv-parser';

	let isDragging = $state(false);
	let isProcessing = $state(false);
	let errorMessage = $state<string | null>(null);

	async function handleFiles(files: FileList | null) {
		if (!files || files.length === 0) return;

		isProcessing = true;
		errorMessage = null;

		try {
			const csvFiles = Array.from(files).filter(
				(file) => file.name.endsWith('.csv') || file.type === 'text/csv'
			);

			if (csvFiles.length === 0) {
				errorMessage = 'Please select CSV files only.';
				isProcessing = false;
				return;
			}

			for (const file of csvFiles) {
				try {
					const dataset = await parseCSVFile(file);
					appState.addDataset(dataset);
				} catch (error) {
					console.error(`Error processing ${file.name}:`, error);
					errorMessage = `Error processing ${file.name}: ${error instanceof Error ? error.message : String(error)}`;
				}
			}
		} finally {
			isProcessing = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		handleFiles(e.dataTransfer?.files || null);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleFileInput(e: Event) {
		const target = e.target as HTMLInputElement;
		handleFiles(target.files);
		target.value = ''; // Reset input to allow same file selection
	}
</script>

<div
	class="upload-zone"
	class:dragging={isDragging}
	class:processing={isProcessing}
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	role="region"
	aria-label="File upload area"
>
	<input
		type="file"
		id="file-input"
		accept=".csv,text/csv"
		multiple
		onchange={handleFileInput}
		disabled={isProcessing}
	/>

	<label for="file-input">
		{#if isProcessing}
			<div class="spinner"></div>
			<p>Processing files...</p>
		{:else}
			<svg
				width="48"
				height="48"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
				<polyline points="17 8 12 3 7 8" />
				<line x1="12" y1="3" x2="12" y2="15" />
			</svg>
			<p class="main-text">Drop CSV files here or click to browse</p>
			<p class="sub-text">Supports multiple files</p>
		{/if}
	</label>

	{#if errorMessage}
		<div class="error">
			{errorMessage}
		</div>
	{/if}
</div>

<style>
	.upload-zone {
		border: 2px dashed #ccc;
		border-radius: 8px;
		padding: 3rem 2rem;
		text-align: center;
		transition: all 0.3s ease;
		background: #fafafa;
	}

	.upload-zone.dragging {
		border-color: #4a90e2;
		background: #f0f8ff;
	}

	.upload-zone.processing {
		opacity: 0.6;
	}

	input[type='file'] {
		display: none;
	}

	label {
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		color: #666;
	}

	label:hover {
		color: #4a90e2;
	}

	.main-text {
		font-size: 1.1rem;
		font-weight: 500;
		margin: 0;
		color: #333;
	}

	.sub-text {
		font-size: 0.9rem;
		margin: 0;
		color: #999;
	}

	.spinner {
		width: 48px;
		height: 48px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #4a90e2;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.error {
		margin-top: 1rem;
		padding: 0.75rem;
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 4px;
		color: #c00;
		font-size: 0.9rem;
	}
</style>
