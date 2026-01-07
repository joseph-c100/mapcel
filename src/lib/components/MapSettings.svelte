<script lang="ts">
  import { appState } from "$lib/stores/app-state.svelte";

  function updateStyleUrl(e: Event) {
    const target = e.target as HTMLInputElement;
    appState.updateMapSettings({ styleUrl: target.value });
  }

  function updateMinZoom(e: Event) {
    const target = e.target as HTMLInputElement;
    appState.updateMapSettings({ minZoom: parseInt(target.value) });
  }

  function updateMaxZoom(e: Event) {
    const target = e.target as HTMLInputElement;
    appState.updateMapSettings({ maxZoom: parseInt(target.value) });
  }

  function toggleControls(e: Event) {
    const target = e.target as HTMLInputElement;
    appState.updateMapSettings({ enableControls: target.checked });
  }
</script>

<div class="map-settings">
  <div class="setting">
    <label for="style-url">Map Style URL</label>
    <input
      type="text"
      id="style-url"
      value={appState.mapSettings.styleUrl}
      oninput={updateStyleUrl}
      placeholder="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    />
    <p class="help-text">
      Enter a MapLibre style.json URL. Default: MapLibre Basic (demo tiles)
    </p>
  </div>

  <div class="setting-row">
    <div class="setting">
      <label for="min-zoom">Min Zoom: {appState.mapSettings.minZoom}</label>
      <input
        type="range"
        id="min-zoom"
        min="0"
        max="22"
        step="1"
        value={appState.mapSettings.minZoom}
        oninput={updateMinZoom}
      />
    </div>

    <div class="setting">
      <label for="max-zoom">Max Zoom: {appState.mapSettings.maxZoom}</label>
      <input
        type="range"
        id="max-zoom"
        min="0"
        max="22"
        step="1"
        value={appState.mapSettings.maxZoom}
        oninput={updateMaxZoom}
      />
    </div>
  </div>

  <div class="setting checkbox-setting">
    <label>
      <input
        type="checkbox"
        checked={appState.mapSettings.enableControls}
        onchange={toggleControls}
      />
      <span>Enable map controls (pan, zoom, navigation)</span>
    </label>
    <p class="help-text">
      When unchecked, the generated map will be static and non-interactive
    </p>
  </div>
</div>

<style>
  .map-settings {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .setting {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .setting-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #333;
  }

  input[type="text"] {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
    font-family: monospace;
  }

  input[type="text"]:focus {
    outline: none;
    border-color: #4a90e2;
  }

  input[type="range"] {
    width: 100%;
    cursor: pointer;
  }

  .checkbox-setting label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .checkbox-setting input[type="checkbox"] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  .help-text {
    margin: 0;
    font-size: 0.8rem;
    color: #999;
  }

  @media (max-width: 768px) {
    .setting-row {
      grid-template-columns: 1fr;
    }
  }
</style>
