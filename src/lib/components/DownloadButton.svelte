<script lang="ts">
  import { appState } from "$lib/stores/app-state.svelte";
  import { generateZipFile, downloadZip } from "$lib/utils/zip-generator";

  let isGenerating = $state(false);
  let errorMessage = $state<string | null>(null);

  async function handleDownload() {
    isGenerating = true;
    errorMessage = null;

    try {
      const validDatasets = appState.datasets.filter(
        (ds) => ds.geojson && ds.validationErrors.length === 0
      );

      if (validDatasets.length === 0) {
        errorMessage =
          "No valid datasets to export. Please fix validation errors.";
        return;
      }

      const zipBlob = await generateZipFile(
        validDatasets,
        appState.mapSettings
      );
      downloadZip(zipBlob);
    } catch (error) {
      console.error("Error generating ZIP:", error);
      errorMessage = `Error generating ZIP file: ${error instanceof Error ? error.message : String(error)}`;
    } finally {
      isGenerating = false;
    }
  }
</script>

<div class="download-section">
  <div class="info">
    <p class="description">
      Download a ZIP file containing GeoJSON files and MapLibre JS code. The ZIP
      includes:
    </p>
    <ul>
      <li>
        Individual .geojson files for each dataset (WGS84/EPSG:4326 with CRS
        declaration)
      </li>
      <li>map.js with MapLibre GL JS code</li>
      <li>README.md with usage instructions</li>
    </ul>
  </div>

  {#if errorMessage}
    <div class="error">
      {errorMessage}
    </div>
  {/if}

  <button
    class="download-btn"
    onclick={handleDownload}
    disabled={!appState.allDatasetsValid || isGenerating}
  >
    {#if isGenerating}
      <span class="spinner"></span>
      Generating ZIP...
    {:else if !appState.hasDatasets}
      No Datasets to Download
    {:else if !appState.allDatasetsValid}
      Fix Validation Errors First
    {:else}
      Download ZIP
    {/if}
  </button>

  {#if appState.hasDatasets && !appState.allDatasetsValid}
    <p class="warning">
      ⚠️ Some datasets have validation errors. Please fix them before
      downloading.
    </p>
  {/if}
</div>

<style>
  .download-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info {
    background: #f9f9f9;
    border-radius: 6px;
    padding: 1rem;
  }

  .description {
    margin: 0 0 0.75rem 0;
    color: #666;
    font-size: 0.9rem;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #666;
    font-size: 0.9rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  .download-btn {
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    background: #000;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .download-btn:hover:not(:disabled) {
    background: #fff;
    border: 1px solid black;
    color: #000;
  }

  .download-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
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
    padding: 0.75rem;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 4px;
    color: #c00;
    font-size: 0.9rem;
  }

  .warning {
    margin: 0;
    padding: 0.75rem;
    background: #fff5e6;
    border: 1px solid #ffcc00;
    border-radius: 4px;
    color: #cc8800;
    font-size: 0.9rem;
  }
</style>
