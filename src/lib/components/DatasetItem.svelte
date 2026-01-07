<script lang="ts">
  import type { CSVDataset } from "$lib/types/app";
  import { appState } from "$lib/stores/app-state.svelte";

  interface Props {
    dataset: CSVDataset;
  }

  let { dataset }: Props = $props();

  let showErrors = $state(false);

  function updateColor(e: Event) {
    const target = e.target as HTMLInputElement;
    appState.updateDatasetStyling(dataset.id, { color: target.value });
  }

  function updateRadius(e: Event) {
    const target = e.target as HTMLInputElement;
    appState.updateDatasetStyling(dataset.id, {
      radius: parseFloat(target.value),
    });
  }

  function updateOpacity(e: Event) {
    const target = e.target as HTMLInputElement;
    appState.updateDatasetStyling(dataset.id, {
      opacity: parseFloat(target.value),
    });
  }

  function removeDataset() {
    appState.removeDataset(dataset.id);
  }
</script>

<div
  class="dataset-item"
  class:has-errors={dataset.validationErrors.length > 0}
>
  <div class="header">
    <div class="title-row">
      <div
        class="color-indicator"
        style="background-color: {dataset.styling.color}"
      ></div>
      <h4>{dataset.name}</h4>
      <button class="remove-btn" onclick={removeDataset} title="Remove dataset"
        >×</button
      >
    </div>

    {#if dataset.latColumn && dataset.longColumn}
      <p class="columns">
        📍 {dataset.latColumn} / {dataset.longColumn}
      </p>
    {/if}

    {#if dataset.geojson}
      <p class="feature-count">
        {dataset.geojson.features.length} feature{dataset.geojson.features
          .length !== 1
          ? "s"
          : ""}
      </p>
    {/if}
  </div>

  {#if dataset.validationErrors.length > 0}
    <div class="errors">
      <div class="error-header">
        <span class="error-icon">⚠️</span>
        <span class="error-title"
          >{dataset.validationErrors.length} validation error{dataset
            .validationErrors.length !== 1
            ? "s"
            : ""}</span
        >
        <button class="toggle-btn" onclick={() => (showErrors = !showErrors)}>
          {showErrors ? "Hide" : "Show"}
        </button>
      </div>

      {#if showErrors}
        <div class="error-list">
          {#each dataset.validationErrors.slice(0, 10) as error}
            <div class="error-item">
              {#if error.row > 0}
                Row {error.row}{error.column ? `, ${error.column}` : ""}:
              {/if}
              {error.message}
              {#if error.value !== null && error.value !== undefined}
                (value: {error.value})
              {/if}
            </div>
          {/each}
          {#if dataset.validationErrors.length > 10}
            <p class="more-errors">
              ... and {dataset.validationErrors.length - 10} more errors
            </p>
          {/if}
        </div>
      {/if}
    </div>
  {:else if dataset.geojson}
    <div class="styling-controls">
      <div class="control">
        <label for="color-{dataset.id}">Color</label>
        <input
          type="color"
          id="color-{dataset.id}"
          value={dataset.styling.color}
          oninput={updateColor}
        />
      </div>

      <div class="control">
        <label for="radius-{dataset.id}">
          Radius: {dataset.styling.radius}px
        </label>
        <input
          type="range"
          id="radius-{dataset.id}"
          min="1"
          max="20"
          step="0.5"
          value={dataset.styling.radius}
          oninput={updateRadius}
        />
      </div>

      <div class="control">
        <label for="opacity-{dataset.id}">
          Opacity: {(dataset.styling.opacity * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          id="opacity-{dataset.id}"
          min="0"
          max="1"
          step="0.05"
          value={dataset.styling.opacity}
          oninput={updateOpacity}
        />
      </div>
    </div>
  {/if}
</div>

<style>
  .dataset-item {
    border: 1px solid #e0e0e0;
    padding: 1rem;
    background: white;
  }

  .dataset-item.has-errors {
    border-color: #ffcc00;
    background: #fffef0;
  }

  .header {
    margin-bottom: 1rem;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .color-indicator {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #ddd;
    flex-shrink: 0;
  }

  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    flex: 1;
    color: #333;
    word-break: break-word;
  }

  .remove-btn {
    background: #f0f0f0;
    border: none;
    border-radius: 4px;
    width: 28px;
    height: 28px;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    color: #666;
    transition: all 0.2s;
  }

  .remove-btn:hover {
    background: #ff4444;
    color: white;
  }

  .columns,
  .feature-count {
    margin: 0.25rem 0;
    font-size: 0.85rem;
    color: #666;
  }

  .errors {
    background: #fff5e6;
    border: 1px solid #ffcc00;
    border-radius: 4px;
    padding: 0.75rem;
    margin-top: 1rem;
  }

  .error-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }

  .error-icon {
    font-size: 1.2rem;
  }

  .error-title {
    flex: 1;
    color: #cc8800;
  }

  .toggle-btn {
    background: transparent;
    border: 1px solid #cc8800;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;
    color: #cc8800;
  }

  .toggle-btn:hover {
    background: #cc8800;
    color: white;
  }

  .error-list {
    margin-top: 0.75rem;
    font-size: 0.85rem;
  }

  .error-item {
    padding: 0.5rem;
    background: white;
    border-radius: 3px;
    margin-bottom: 0.5rem;
    color: #666;
  }

  .more-errors {
    margin: 0.5rem 0 0;
    font-style: italic;
    color: #999;
    font-size: 0.8rem;
  }

  .styling-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
  }

  .control {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .control label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #666;
  }

  input[type="color"] {
    width: 80px;
    height: 40px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
  }

  input[type="range"] {
    width: 100%;
    cursor: pointer;
  }
</style>
