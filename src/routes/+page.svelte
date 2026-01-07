<script lang="ts">
  import FileUploader from "$lib/components/FileUploader.svelte";
  import DatasetList from "$lib/components/DatasetList.svelte";
  import MapPreview from "$lib/components/MapPreview.svelte";
  import MapSettings from "$lib/components/MapSettings.svelte";
  import DownloadButton from "$lib/components/DownloadButton.svelte";
  import { appState } from "$lib/stores/app-state.svelte";
</script>

<svelte:head>
  <title>Mapcel - CSV to GeoJSON Converter</title>
  <meta
    name="description"
    content="Convert CSV files to GeoJSON with MapLibre visualization. Upload, customize, and export."
  />
</svelte:head>

<div class="container">
  <header>
    <h1>mapcel</h1>
    <p class="tagline">CSV to GeoJSON + MapLibre converter</p>
    <p class="description">
      Upload CSV files with coordinates, customize the visualization, and
      download GeoJSON files with MapLibre GL JS code.
    </p>
  </header>

  <main>
    <section class="section">
      <div class="section-header">
        <span class="section-number">1</span>
        <h2>Upload CSV Files</h2>
      </div>
      <FileUploader />
    </section>

    {#if appState.hasDatasets}
      <section class="section">
        <div class="section-header">
          <span class="section-number">2</span>
          <h2>Configure Datasets</h2>
        </div>
        <DatasetList />
      </section>

      <section class="section">
        <div class="section-header">
          <span class="section-number">3</span>
          <h2>Map Settings</h2>
        </div>
        <MapSettings />
      </section>

      <section class="section">
        <div class="section-header">
          <span class="section-number">4</span>
          <h2>Preview</h2>
        </div>
        <MapPreview />
      </section>

      <section class="section">
        <div class="section-header">
          <span class="section-number">5</span>
          <h2>Download</h2>
        </div>
        <DownloadButton />
      </section>
    {/if}
  </main>

  <footer>
    <p>
      Built with <a href="https://svelte.dev" target="_blank" rel="noopener"
        >Svelte 5</a
      >,
      <a href="https://maplibre.org" target="_blank" rel="noopener"
        >MapLibre GL JS</a
      >, and
      <a href="https://proj4js.org" target="_blank" rel="noopener">Proj4</a>
    </p>
  </footer>
</div>

<style>
  .container {
    max-width: 1000px;
    padding: 2rem;
  }

  header {
    text-align: left;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid #e0e0e0;
  }

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 3rem;
    font-weight: 700;
    color: #2c3e50;
    letter-spacing: -1px;
  }

  .tagline {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 500;
    color: #000;
  }

  .description {
    margin: 0;
    font-size: 1rem;
    color: #666;
    max-width: 600px;
    line-height: 1.6;
  }

  main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .section {
    background: white;
    padding: 2rem;
    border: 1px solid #e0e0e0;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .section-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: #666;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    flex-shrink: 0;
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
  }

  footer {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid #e0e0e0;
    text-align: center;
    color: #999;
    font-size: 0.9rem;
  }

  footer a {
    color: #4a90e2;
    text-decoration: none;
  }

  footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .section {
      padding: 1.5rem;
    }

    .section-header {
      margin-bottom: 1rem;
    }

    h2 {
      font-size: 1.25rem;
    }
  }
</style>
